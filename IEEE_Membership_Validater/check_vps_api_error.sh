#!/bin/bash
# Run this ON THE VPS to diagnose API server issues

echo "=== Checking API Server Status ==="
sudo systemctl status ieee-api-server --no-pager -l | head -30

echo ""
echo "=== Recent Logs ==="
sudo journalctl -u ieee-api-server -n 50 --no-pager

echo ""
echo "=== Checking for Syntax Errors ==="
cd /opt/ieee-validator
source venv/bin/activate
python3 -m py_compile api_server.py 2>&1 || echo "Syntax error detected!"

echo ""
echo "=== Testing API Server Manually ==="
python3 api_server.py 2>&1 | head -20 || echo "Failed to start"

