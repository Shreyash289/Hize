# 🚀 Quick Start Guide

Get the IEEE Validator system running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check Python (need 3.9+)
python3 --version

# Check Redis
redis-cli ping  # Should return "PONG"
```

If Redis is not installed:
- **macOS**: `brew install redis && brew services start redis`
- **Ubuntu**: `sudo apt-get install redis-server && sudo systemctl start redis-server`

## Step 1: Install Dependencies (2 min)

```bash
# Install all dependencies
npm run setup:all

# This runs:
# - npm install in backend/
# - Creates Python venv and installs packages in worker/
# - Creates Python venv and installs Playwright in cookie-refresh/
```

## Step 2: Configure Environment (1 min)

```bash
# Copy example files
cp backend/env.example backend/.env
cp worker/env.example worker/.env
cp cookie-refresh/env.example cookie-refresh/.env

# Edit cookie-refresh/.env and add your IEEE credentials:
# IEEE_USERNAME=your-email@example.com
# IEEE_PASSWORD=your-password
```

## Step 3: Start Redis (if not running)

```bash
# macOS (with Homebrew)
brew services start redis

# Linux
sudo systemctl start redis-server

# Or run manually
redis-server
```

## Step 4: Refresh Cookie (2 min)

```bash
# This logs into IEEE and extracts cookie
npm run cookie:refresh

# Enter your IEEE credentials if not in .env
# Cookie will be saved to backend/.env and worker/.env
```

## Step 5: Start Services

**Easy way (one command):**

```bash
chmod +x scripts/start-local.sh
./scripts/start-local.sh
```

**Manual way (3 terminals):**

```bash
# Terminal 1: Backend API
npm run backend:dev

# Terminal 2: Worker
npm run worker:start

# Terminal 3: Frontend
npm run dev
```

## Step 6: Test It! 🎉

1. Open `http://localhost:3000`
2. Open registration modal
3. Enter IEEE member number: `99634594`
4. Watch it validate! (should take ~1-2 seconds)

## Troubleshooting

### Redis not running
```bash
redis-cli ping
# If not "PONG", start Redis (see Step 3)
```

### Cookie refresh fails
- Check your IEEE credentials in `cookie-refresh/.env`
- Make sure Playwright is installed: `cd cookie-refresh && source venv/bin/activate && playwright install chromium`

### Worker not processing
- Check Redis is running: `redis-cli ping`
- Check worker logs for errors
- Verify cookie in `worker/.env` file

### API returns 503
- Check backend is running on port 3001
- Check Redis connection: `curl http://localhost:3001/api/health`

## Next Steps

- See `README_PRODUCTION.md` for VPS deployment
- Configure rate limiting and security for production
- Set up monitoring and logging

## Quick Commands Reference

```bash
# Start everything
./scripts/start-local.sh

# Refresh cookie
npm run cookie:refresh

# Check backend health
curl http://localhost:3001/api/health

# Test validation (creates job)
curl -X POST http://localhost:3001/api/check \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}'

# Check job status (use jobId from above)
curl http://localhost:3001/api/status/YOUR_JOB_ID
```

That's it! You're ready to go! 🎉

