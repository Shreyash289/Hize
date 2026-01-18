#!/bin/bash
# Quick fix script - Run ON THE VPS

echo "=== Fixing and Testing IEEE API Server ==="
echo ""

# Stop any existing service
sudo systemctl stop ieee-api-server 2>/dev/null || true

# Check if API server files exist
if [ ! -f /opt/ieee-validator/api_server.py ]; then
    echo "Error: API server file not found at /opt/ieee-validator/api_server.py"
    echo "Make sure files were uploaded correctly"
    exit 1
fi

# Create override config for port 5001
echo "Creating service override config..."
sudo mkdir -p /etc/systemd/system/ieee-api-server.service.d

sudo bash -c 'cat > /etc/systemd/system/ieee-api-server.service.d/override.conf << EOF
[Service]
Environment="PORT=5001"
ExecStart=
ExecStart=/opt/ieee-validator/venv/bin/gunicorn -w 2 -b 0.0.0.0:5001 --timeout 120 api_server:app
EOF'

# Reload systemd
echo "Reloading systemd..."
sudo systemctl daemon-reload

# Start service
echo "Starting API server..."
sudo systemctl start ieee-api-server

# Wait a moment
sleep 2

# Check status
echo ""
echo "=== Service Status ==="
sudo systemctl status ieee-api-server --no-pager -l | head -20

echo ""
echo "=== Testing API ==="
echo "Testing port 5001:"
curl -s http://localhost:5001/health 2>&1 | head -5 || echo "Still not responding"

echo ""
echo "Testing cookie endpoint:"
curl -s http://localhost:5001/api/cookie/status 2>&1 | head -5 || echo "Cookie endpoint not working"

echo ""
echo "=== Next Steps ==="
echo "If service started successfully:"
echo "1. Test from your local machine: curl http://65.20.84.46:5001/health"
echo "2. If firewall blocks, run: sudo ufw allow 5001/tcp"
echo "3. Update Vercel VPS_API_URL to: http://65.20.84.46:5001"

