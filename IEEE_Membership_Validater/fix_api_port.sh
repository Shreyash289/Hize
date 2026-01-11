#!/bin/bash
# Script to fix API server port configuration on VPS
# Run this ON THE VPS

echo "Fixing API server to use port 5001..."

# Stop the API server
sudo systemctl stop ieee-api-server

# Create override config for port 5001
sudo mkdir -p /etc/systemd/system/ieee-api-server.service.d

sudo bash -c 'cat > /etc/systemd/system/ieee-api-server.service.d/override.conf << EOF
[Service]
Environment="PORT=5001"
ExecStart=
ExecStart=/opt/ieee-validator/venv/bin/gunicorn -w 2 -b 0.0.0.0:5001 --timeout 120 api_server:app
EOF'

# Reload and start
sudo systemctl daemon-reload
sudo systemctl restart ieee-api-server

# Wait a moment
sleep 2

# Check status
echo ""
echo "API Server Status:"
sudo systemctl status ieee-api-server --no-pager -l

echo ""
echo "Testing port 5001:"
curl -s http://localhost:5001/health | head -5

echo ""
echo "✓ API server should now be running on port 5001"
echo "Update Vercel VPS_API_URL to: http://65.20.84.46:5001"

