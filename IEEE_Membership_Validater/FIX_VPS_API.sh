#!/bin/bash
# Run this ON THE VPS to fix and verify API server

echo "=== Step 1: Check Service Status ==="
sudo systemctl status ieee-api-server --no-pager -l | head -30

echo ""
echo "=== Step 2: Check for Syntax Errors ==="
cd /opt/ieee-validator
python3 -m py_compile api_server.py 2>&1
if [ $? -eq 0 ]; then
    echo "✓ No syntax errors"
else
    echo "✗ Syntax error found!"
    echo "Check the file and fix errors"
    exit 1
fi

echo ""
echo "=== Step 3: Check if endpoint exists ==="
if grep -q "@app.route('/api/validate-member'" api_server.py; then
    echo "✓ Validation endpoint found in file"
else
    echo "✗ Validation endpoint NOT found - need to add it"
    exit 1
fi

echo ""
echo "=== Step 4: Check Gunicorn Process ==="
ps aux | grep gunicorn | grep -v grep

echo ""
echo "=== Step 5: Restart Service ==="
sudo systemctl restart ieee-api-server
sleep 3

echo ""
echo "=== Step 6: Check Status Again ==="
sudo systemctl status ieee-api-server --no-pager -l | head -20

echo ""
echo "=== Step 7: Test Endpoint ==="
curl -X POST http://localhost:5001/api/validate-member \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}' 2>&1 | head -10

