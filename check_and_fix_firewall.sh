#!/bin/bash
# Commands to run ON THE VPS to fix firewall and test

echo "=== Checking Port and Firewall ==="
echo ""

echo "1. Check what port gunicorn is listening on:"
sudo lsof -i -P -n | grep gunicorn || echo "Not found with lsof, trying netstat..."

echo ""
echo "2. Check with netstat:"
sudo netstat -tlnp | grep gunicorn || echo "Not found with netstat"

echo ""
echo "3. Test locally on VPS:"
curl -s http://localhost:5001/health 2>&1 | head -5 || echo "Not responding on localhost:5001"

echo ""
echo "4. Check firewall status:"
sudo ufw status

echo ""
echo "5. If firewall is active and blocking, run these:"
echo "   sudo ufw allow 5001/tcp"
echo "   sudo ufw reload"
echo "   sudo ufw status"

echo ""
echo "6. Check service configuration:"
cat /etc/systemd/system/ieee-api-server.service.d/override.conf 2>/dev/null || echo "No override config found"

