#!/bin/bash
# Complete VPS API Test

VPS_IP="65.20.84.46"

echo "=========================================="
echo "Complete VPS API Test"
echo "=========================================="
echo ""

# Test port 5001 (our API)
echo "1. Testing port 5001 (IEEE API):"
echo "--------------------------------"
RESPONSE_5001=$(curl -s --connect-timeout 5 -w "\nHTTP:%{http_code}" http://$VPS_IP:5001/health 2>&1)
HTTP_5001=$(echo "$RESPONSE_5001" | grep "HTTP:" | cut -d: -f2)
BODY_5001=$(echo "$RESPONSE_5001" | sed '/HTTP:/d')

if [ "$HTTP_5001" = "200" ]; then
    echo "✓ Port 5001 is responding!"
    echo "Response: $BODY_5001"
else
    echo "✗ Port 5001 not responding (HTTP: $HTTP_5001)"
    echo "Response: $RESPONSE_5001"
fi
echo ""

# Test cookie endpoint
echo "2. Testing cookie endpoint on 5001:"
echo "-----------------------------------"
COOKIE_RESP=$(curl -s --connect-timeout 5 http://$VPS_IP:5001/api/cookie/status 2>&1)
echo "$COOKIE_RESP" | head -10
echo ""

# Test getting cookie
echo "3. Testing cookie retrieval:"
echo "----------------------------"
COOKIE_DATA=$(curl -s --connect-timeout 5 http://$VPS_IP:5001/api/cookie 2>&1)
if echo "$COOKIE_DATA" | grep -q '"cookie"'; then
    COOKIE_LEN=$(echo "$COOKIE_DATA" | grep -o '"cookie":"[^"]*' | cut -d'"' -f4 | wc -c)
    echo "✓ Cookie endpoint working (cookie length: $COOKIE_LEN)"
    echo "Preview: $(echo "$COOKIE_DATA" | grep -o '"cookie":"[^"]*' | cut -d'"' -f4 | head -c 50)..."
else
    echo "Response: $COOKIE_DATA" | head -5
fi
echo ""

# Check what port gunicorn is actually listening on
echo "4. Checking actual listening ports (need SSH access):"
echo "-----------------------------------------------------"
echo "Run on VPS: sudo lsof -i -P -n | grep gunicorn"
echo "Or: sudo netstat -tlnp | grep gunicorn"
echo ""

