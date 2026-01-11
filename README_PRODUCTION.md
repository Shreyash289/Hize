# IEEE Membership Validator - Production System

A production-ready, scalable IEEE membership validation system with job queue, caching, and automatic cookie refresh.

## 🏗️ Architecture

```
Frontend (Next.js)
    ↓
Backend API (Node.js + Express)
    ↓
Redis Queue
    ↓
Worker (Python)
    ↓
IEEE Membership Validator API
```

## 📋 Features

- ✅ **Job Queue System**: Redis-based queue for async processing
- ✅ **Result Caching**: 24-hour cache to avoid redundant validations
- ✅ **Rate Limiting**: Built-in 0.7s delay between IEEE requests
- ✅ **Auto Cookie Refresh**: Playwright-based cookie refresh every 6 hours
- ✅ **Polling Frontend**: Real-time status updates via polling
- ✅ **Production Ready**: PM2/systemd deployment, error handling, logging

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- Python 3.9+
- Redis (install: `brew install redis` or `apt-get install redis-server`)

### 1. Install Dependencies

```bash
# Setup all components
npm run setup:all

# Or individually:
npm run setup:backend    # Backend API
npm run setup:worker     # Python worker
npm run setup:cookie     # Cookie refresh (includes Playwright)
```

### 2. Configure Environment

Copy example environment files and configure:

```bash
cp backend/env.example backend/.env
cp worker/env.example worker/.env
cp cookie-refresh/env.example cookie-refresh/.env
```

Edit `.env` files:
- `backend/.env`: Set `REDIS_URL` (default: `redis://localhost:6379`)
- `worker/.env`: Set `IEEE_COOKIE` (cookie refresh script will update this)
- `cookie-refresh/.env`: Set `IEEE_USERNAME` and `IEEE_PASSWORD`

### 3. Start Redis

```bash
redis-server
```

### 4. Start Services

**Option A: Use start script (recommended)**

```bash
chmod +x scripts/start-local.sh
./scripts/start-local.sh
```

**Option B: Manual start**

```bash
# Terminal 1: Backend API
npm run backend:dev

# Terminal 2: Worker
npm run worker:start

# Terminal 3: Frontend (Next.js)
npm run dev
```

### 5. Refresh Cookie (First Time)

```bash
npm run cookie:refresh
```

This will:
- Login to IEEE using Playwright
- Extract `PA.Global_Websession` cookie
- Update `backend/.env` and `worker/.env` files

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3001/api/health

# Create validation job
curl -X POST http://localhost:3001/api/check \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}'

# Check job status (use jobId from previous response)
curl http://localhost:3001/api/status/YOUR_JOB_ID
```

### Test Frontend

1. Open `http://localhost:3000`
2. Open registration modal
3. Enter IEEE member number (e.g., `99634594`)
4. Watch polling in action - validation completes in ~1-2 seconds

## 📦 VPS Deployment

### Prerequisites

- Ubuntu 20.04+ VPS
- Root/SSH access
- Redis installed and running

### 1. Deploy Code

```bash
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh root@your-vps-ip
```

### 2. Configure Environment on VPS

SSH into VPS and configure:

```bash
# Edit backend environment
nano /opt/ieee-validator/backend/.env

# Edit worker environment
nano /opt/ieee-validator/worker/.env

# Edit cookie refresh environment
nano /opt/ieee-validator/cookie-refresh/.env
```

### 3. Install PM2 (Backend API)

```bash
npm install -g pm2

cd /opt/ieee-validator/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions to enable PM2 on boot
```

### 4. Setup Worker (systemd)

```bash
# Copy systemd service file
cp deploy/systemd/ieee-worker.service /etc/systemd/system/

# Enable and start
systemctl daemon-reload
systemctl enable ieee-worker.service
systemctl start ieee-worker.service

# Check status
systemctl status ieee-worker.service
```

### 5. Setup Cookie Refresh (Cron)

```bash
# Make script executable
chmod +x /opt/ieee-validator/deploy/cron/refresh-cookie.sh

# Add to crontab (runs every 6 hours)
(crontab -l 2>/dev/null; echo "0 */6 * * * /opt/ieee-validator/deploy/cron/refresh-cookie.sh") | crontab -

# Test manual refresh
/opt/ieee-validator/deploy/cron/refresh-cookie.sh
```

### 6. Setup Logging

```bash
mkdir -p /var/log/ieee-validator
chmod 755 /var/log/ieee-validator
```

### 7. Configure Frontend

Update Next.js `.env.local`:

```env
BACKEND_API_URL=http://your-vps-ip:3001
```

Or use environment variable in production (Vercel):

```bash
vercel env add BACKEND_API_URL
# Enter: http://your-vps-ip:3001
```

## 📁 Project Structure

```
.
├── backend/              # Node.js API server
│   ├── server.js        # Express API with Redis queue
│   ├── package.json
│   ├── ecosystem.config.js  # PM2 config
│   └── .env            # Environment variables
│
├── worker/              # Python worker
│   ├── ieee_worker.py  # Worker that processes jobs
│   ├── requirements.txt
│   └── .env
│
├── cookie-refresh/      # Cookie refresh automation
│   ├── refresh_cookie.py  # Playwright login script
│   ├── requirements.txt
│   └── .env
│
├── src/                 # Next.js frontend
│   ├── app/api/ieee-validate/  # API proxy routes
│   └── components/      # React components
│
├── deploy/              # Deployment configs
│   ├── systemd/        # systemd service files
│   └── cron/           # Cron job scripts
│
└── scripts/            # Helper scripts
    ├── start-local.sh  # Local development startup
    └── deploy-vps.sh   # VPS deployment
```

## 🔧 Configuration

### Backend API (`backend/.env`)

```env
PORT=3001
REDIS_URL=redis://localhost:6379
IEEE_COOKIE=PA.Global_Websession=your_cookie_here
API_KEY=optional_api_key
```

### Worker (`worker/.env`)

```env
REDIS_URL=redis://localhost:6379
IEEE_COOKIE=PA.Global_Websession=your_cookie_here
WORKER_ID=worker-1
```

### Cookie Refresh (`cookie-refresh/.env`)

```env
IEEE_USERNAME=your-email@example.com
IEEE_PASSWORD=your-password
```

### Frontend (Next.js `.env.local`)

```env
BACKEND_API_URL=http://localhost:3001
```

## 🔍 Monitoring

### Check Backend API Status

```bash
# PM2
pm2 status
pm2 logs ieee-validator-api

# Or systemd (if not using PM2)
systemctl status ieee-validator-api
journalctl -u ieee-validator-api -f
```

### Check Worker Status

```bash
systemctl status ieee-worker
journalctl -u ieee-worker -f
```

### Check Redis Queue

```bash
redis-cli
> LLEN ieee_validation_queue  # Check queue length
> KEYS job:*                  # List active jobs
> KEYS result:*               # List cached results
```

### Check Cookie Refresh Logs

```bash
tail -f /var/log/ieee-validator/cookie-refresh.log
```

## 🐛 Troubleshooting

### Worker not processing jobs

1. Check Redis connection:
   ```bash
   redis-cli ping  # Should return "PONG"
   ```

2. Check worker logs:
   ```bash
   journalctl -u ieee-worker -n 50
   ```

3. Verify cookie is set:
   ```bash
   grep IEEE_COOKIE /opt/ieee-validator/worker/.env
   ```

### Cookie expired errors

1. Manually refresh cookie:
   ```bash
   npm run cookie:refresh
   ```

2. Check cookie refresh logs:
   ```bash
   tail -f /var/log/ieee-validator/cookie-refresh.log
   ```

3. Verify cron job is running:
   ```bash
   crontab -l
   ```

### API returning 503 errors

1. Check if Redis is running:
   ```bash
   systemctl status redis-server
   ```

2. Check backend logs:
   ```bash
   pm2 logs ieee-validator-api
   ```

3. Verify backend can connect to Redis:
   ```bash
   curl http://localhost:3001/api/health
   ```

## 🔒 Security Notes

- Never commit `.env` files to git
- Store `IEEE_PASSWORD` securely (use environment variables)
- Consider adding API key authentication for production
- Use HTTPS in production (Nginx reverse proxy)
- Rate limit API endpoints (already configured)

## 📈 Performance

- **Caching**: Results cached for 24 hours
- **Rate Limiting**: 0.7s delay between IEEE requests (built-in)
- **Polling**: 1-second intervals (configurable)
- **Queue**: Redis handles job distribution
- **Scalability**: Multiple workers can be run in parallel

## 🚀 Next Steps

- Add authentication/API keys
- Setup Nginx reverse proxy
- Add monitoring (Prometheus/Grafana)
- Setup alerting for cookie expiry
- Add admin dashboard for job monitoring

## 📝 License

MIT

