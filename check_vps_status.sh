#!/bin/bash
# Commands to run ON THE VPS to check status

echo "=== IEEE API Server Status Check ==="
echo ""

echo "1. Check if API server service exists:"
sudo systemctl list-units | grep ieee-api || echo "Service not found"

echo ""
echo "2. Check API server status:"
sudo systemctl status ieee-api-server --no-pager -l | head -20

echo ""
echo "3. Check what's running on ports:"
echo "Port 5000:"
sudo lsof -i :5000 | head -3 || echo "Nothing on port 5000"
echo ""
echo "Port 5001:"
sudo lsof -i :5001 | head -3 || echo "Nothing on port 5001"

echo ""
echo "4. Check API server configuration:"
if [ -f /etc/systemd/system/ieee-api-server.service.d/override.conf ]; then
    cat /etc/systemd/system/ieee-api-server.service.d/override.conf
else
    echo "No override config found"
fi

echo ""
echo "5. Check recent logs:"
sudo journalctl -u ieee-api-server -n 30 --no-pager

echo ""
echo "6. Test locally (from VPS):"
curl -s http://localhost:5001/health 2>&1 | head -5 || echo "Port 5001 not responding locally"

echo ""
echo "=== Cookie Refresher Status ==="
sudo systemctl status ieee-cookie-refresher --no-pager -l | head -20

