#!/bin/bash
# VPS Deployment Script
# This script deploys the IEEE Validator system to a VPS

set -e

VPS_HOST="${1:-root@65.20.84.46}"
DEPLOY_DIR="/opt/ieee-validator"
SSH_KEY="${SSH_KEY:-}"

echo "🚀 Deploying IEEE Validator to VPS"
echo "=================================="
echo "Host: $VPS_HOST"
echo "Directory: $DEPLOY_DIR"
echo ""

# Check SSH connection
echo "📡 Testing SSH connection..."
if [ -n "$SSH_KEY" ]; then
    ssh -i "$SSH_KEY" "$VPS_HOST" "echo 'SSH connection OK'" || {
        echo "❌ SSH connection failed"
        exit 1
    }
    SSH_CMD="ssh -i $SSH_KEY $VPS_HOST"
    SCP_CMD="scp -i $SSH_KEY"
else
    ssh "$VPS_HOST" "echo 'SSH connection OK'" || {
        echo "❌ SSH connection failed"
        exit 1
    }
    SSH_CMD="ssh $VPS_HOST"
    SCP_CMD="scp"
fi

echo "✅ SSH connection OK"
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
$SSH_CMD "mkdir -p $DEPLOY_DIR/{backend,worker,cookie-refresh,logs}"

# Upload backend
echo "📤 Uploading backend..."
$SCP_CMD -r backend/* "$VPS_HOST:$DEPLOY_DIR/backend/"

# Upload worker
echo "📤 Uploading worker..."
$SCP_CMD -r worker/* "$VPS_HOST:$DEPLOY_DIR/worker/"

# Upload cookie refresh
echo "📤 Uploading cookie refresh..."
$SCP_CMD -r cookie-refresh/* "$VPS_HOST:$DEPLOY_DIR/cookie-refresh/"

# Setup backend
echo "⚙️  Setting up backend..."
$SSH_CMD "cd $DEPLOY_DIR/backend && npm install --production"

# Setup worker
echo "⚙️  Setting up worker..."
$SSH_CMD "cd $DEPLOY_DIR/worker && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"

# Setup cookie refresh
echo "⚙️  Setting up cookie refresh..."
$SSH_CMD "cd $DEPLOY_DIR/cookie-refresh && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && playwright install chromium"

# Copy environment files if they don't exist
echo "📝 Setting up environment files..."
$SSH_CMD "
    cd $DEPLOY_DIR/backend && [ ! -f .env ] && cp env.example .env || true
    cd $DEPLOY_DIR/worker && [ ! -f .env ] && cp env.example .env || true
    cd $DEPLOY_DIR/cookie-refresh && [ ! -f .env ] && cp env.example .env || true
"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps on VPS:"
echo "   1. Configure environment files:"
echo "      - $DEPLOY_DIR/backend/.env"
echo "      - $DEPLOY_DIR/worker/.env"
echo "      - $DEPLOY_DIR/cookie-refresh/.env"
echo ""
echo "   2. Install and start services:"
echo "      - Install PM2: npm install -g pm2"
echo "      - Start backend: cd $DEPLOY_DIR/backend && pm2 start ecosystem.config.js"
echo "      - Create systemd service for worker (see deploy/systemd/worker.service)"
echo "      - Create cron job for cookie refresh (see deploy/cron/refresh-cookie)"
echo ""
echo "   3. Configure Redis (if not already installed):"
echo "      - apt-get install redis-server"
echo "      - systemctl enable redis-server"
echo "      - systemctl start redis-server"

