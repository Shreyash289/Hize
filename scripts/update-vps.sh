#!/bin/bash
# Quick update script for Hize VPS deployment
# Usage: ./scripts/update-vps.sh

set -e

VPS_HOST="root@65.20.84.46"
APP_DIR="/opt/hize"
APP_PORT="3010"

echo "🚀 Updating Hize on VPS..."
echo "============================"
echo ""

# Push to git first (optional - comment out if you don't want to push)
echo "📤 Pushing to git..."
git add -A
git commit -m "Update: $(date +%Y-%m-%d\ %H:%M:%S)" || echo "No changes to commit"
git push fork main || echo "Git push skipped or failed"

echo ""
echo "🔄 Updating VPS..."

# SSH and update
ssh -o StrictHostKeyChecking=no "$VPS_HOST" "
set -e
cd $APP_DIR
echo '📥 Pulling latest changes...'
git fetch origin
git reset --hard origin/main
echo '📦 Installing dependencies...'
npm install --legacy-peer-deps
echo '🔨 Building...'
npm run build
echo '🔄 Restarting app...'
PORT=$APP_PORT pm2 restart hize --update-env
pm2 save
echo ''
echo '✅ Update complete!'
pm2 logs hize --lines 5 --nostream
"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Site: https://hize2026.ieeecssrm.in"
