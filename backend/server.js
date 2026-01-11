import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const QUEUE_NAME = 'ieee_validation_queue';
const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { error: 'Too many requests, please try again later' }
});

app.use(cors());
app.use(express.json());
app.use('/api/', limiter);

// Redis client
let redisClient = null;

async function initRedis() {
  try {
    redisClient = createClient({ url: REDIS_URL });
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
    
    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });
    
    await redisClient.connect();
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
}

/**
 * POST /api/check
 * Create a validation job or return cached result
 */
app.post('/api/check', async (req, res) => {
  try {
    const { memberId } = req.body;
    
    if (!memberId || !memberId.trim()) {
      return res.status(400).json({ error: 'memberId is required' });
    }
    
    const normalizedId = memberId.trim();
    const cacheKey = `result:${normalizedId}`;
    
    // Check cache first
    if (redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          console.log(`✅ Cache hit for ${normalizedId}`);
          const result = JSON.parse(cached);
          return res.json({
            jobId: null,
            status: 'completed',
            result: result
          });
        }
      } catch (error) {
        console.error('Cache read error:', error);
      }
    }
    
    // Check if job is already in progress
    const inProgressKey = `pending:${normalizedId}`;
    if (redisClient) {
      try {
        const existingJobId = await redisClient.get(inProgressKey);
        if (existingJobId) {
          console.log(`⏳ Job already in progress: ${existingJobId}`);
          return res.json({
            jobId: existingJobId,
            status: 'processing',
            memberId: normalizedId
          });
        }
      } catch (error) {
        console.error('Redis check error:', error);
      }
    }
    
    // Create new job
    const jobId = uuidv4();
    const job = {
      jobId,
      memberId: normalizedId,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Add to queue
    if (redisClient) {
      try {
        await redisClient.lPush(QUEUE_NAME, JSON.stringify(job));
        await redisClient.set(`pending:${normalizedId}`, jobId, { EX: 300 }); // 5 min TTL
        await redisClient.set(`job:${jobId}`, JSON.stringify({ ...job, status: 'processing' }), { EX: 600 }); // 10 min TTL
        console.log(`📋 Job created: ${jobId} for ${normalizedId}`);
      } catch (error) {
        console.error('Queue error:', error);
        if (!redisClient.isOpen) {
          return res.status(503).json({ 
            error: 'Service temporarily unavailable',
            message: 'Queue system is down' 
          });
        }
      }
    } else {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: 'Redis connection failed' 
      });
    }
    
    res.json({
      jobId,
      status: 'processing',
      memberId: normalizedId
    });
    
  } catch (error) {
    console.error('Error in /api/check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/status/:jobId
 * Get job status and result
 */
app.get('/api/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    if (!jobId) {
      return res.status(400).json({ error: 'jobId is required' });
    }
    
    if (!redisClient) {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: 'Redis connection failed' 
      });
    }
    
    try {
      // Check job status
      const jobData = await redisClient.get(`job:${jobId}`);
      
      if (!jobData) {
        // Check if it's in cache (completed)
        const cacheKey = await redisClient.keys(`result:*`);
        for (const key of cacheKey) {
          const cached = await redisClient.get(key);
          if (cached) {
            const result = JSON.parse(cached);
            if (result.memberId && result.jobId === jobId) {
              return res.json({
                jobId,
                status: 'completed',
                result: result
              });
            }
          }
        }
        return res.status(404).json({ 
          error: 'Job not found',
          status: 'not_found' 
        });
      }
      
      const job = JSON.parse(jobData);
      
      // If completed, get result from cache
      if (job.status === 'completed') {
        const cacheKey = `result:${job.memberId}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          const result = JSON.parse(cached);
          return res.json({
            jobId,
            status: 'completed',
            result: result
          });
        }
      }
      
      // Check if failed
      if (job.status === 'failed') {
        return res.json({
          jobId,
          status: 'failed',
          error: job.error || 'Validation failed'
        });
      }
      
      // Still processing
      return res.json({
        jobId,
        status: 'processing',
        memberId: job.memberId
      });
      
    } catch (error) {
      console.error('Status check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
  } catch (error) {
    console.error('Error in /api/status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', async (req, res) => {
  const redisStatus = redisClient && redisClient.isOpen ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    redis: redisStatus,
    timestamp: new Date().toISOString()
  });
});

// Start server
async function start() {
  const redisConnected = await initRedis();
  
  if (!redisConnected) {
    console.warn('⚠️  Warning: Redis not connected. Queue operations will fail.');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 IEEE Validator API Server running on port ${PORT}`);
    console.log(`📊 Redis: ${redisConnected ? 'Connected' : 'Disconnected'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}

start().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit(0);
});

