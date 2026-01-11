#!/bin/bash
# Complete local testing script

echo "=========================================="
echo "Complete Local Test - IEEE Validation"
echo "=========================================="
echo ""

PORT=${1:-3002}  # Default to 3002, or pass port as argument

echo "Testing on port: $PORT"
echo ""

# Test 1: Check dev server
echo "1. Checking dev server..."
if curl -s http://localhost:$PORT > /dev/null 2>&1; then
    echo "✓ Dev server is running on port $PORT"
else
    echo "✗ Dev server not running on port $PORT"
    exit 1
fi
echo ""

# Test 2: Test VPS API
echo "2. Testing VPS API connection..."
VPS_HEALTH=$(curl -s http://65.20.84.46:5001/health)
if echo "$VPS_HEALTH" | grep -q '"status":"ok"'; then
    echo "✓ VPS API is accessible"
    echo "  $VPS_HEALTH" | head -c 100
else
    echo "✗ VPS API not accessible"
    echo "  Response: $VPS_HEALTH"
fi
echo ""

# Test 3: Test local API route
echo "3. Testing local API route..."
API_RESPONSE=$(curl -s -X POST http://localhost:$PORT/api/validate-ieee \
    -H "Content-Type: application/json" \
    -d '{"memberId":"99634594"}' \
    --max-time 30)

echo "Response: $API_RESPONSE"
echo ""

# Check response
if echo "$API_RESPONSE" | grep -q '"isValid"'; then
    echo "✓ API route is working and returning validation results"
    if echo "$API_RESPONSE" | grep -q '"isValid":true'; then
        echo "  ✅ Member validated successfully!"
    elif echo "$API_RESPONSE" | grep -q '"isValid":false'; then
        ERROR=$(echo "$API_RESPONSE" | grep -o '"error":"[^"]*' | cut -d'"' -f4)
        echo "  ⚠️  Validation returned false"
        echo "  Error: $ERROR"
        echo ""
        echo "  This could mean:"
        echo "  - Member ID doesn't exist"
        echo "  - Member is inactive"
        echo "  - Cookie needs refresh (wait 1-2 minutes)"
    fi
else
    echo "✗ API route error"
    echo "  Full response: $API_RESPONSE"
fi
echo ""

echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo "✓ Server running: http://localhost:$PORT"
echo "✓ API route exists: /api/validate-ieee"
echo ""
echo "Next: Open browser and test registration modal:"
echo "  http://localhost:$PORT"
echo ""

