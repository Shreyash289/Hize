#!/bin/bash
#
# Test Local Next.js API Route
#

echo "=========================================="
echo "Testing Local IEEE Validation API"
echo "=========================================="
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Next.js dev server is not running!"
    echo ""
    echo "Start it with:"
    echo "  cd \"/Users/mrstark/Desktop/Code PlayGround/IEEE/Hize\""
    echo "  npm run dev"
    echo ""
    exit 1
fi

echo "✓ Dev server is running"
echo ""

# Test the API route
echo "Testing /api/validate-ieee endpoint..."
echo "--------------------------------------"

RESPONSE=$(curl -s -w "\nHTTP:%{http_code}" \
    -X POST http://localhost:3000/api/validate-ieee \
    -H "Content-Type: application/json" \
    -d '{"memberId": "99634594"}' \
    --max-time 30)

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP:/d')

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ API route is working!"
    echo ""
    echo "Response:"
    
    # Try to format JSON if jq is available
    if command -v jq > /dev/null; then
        echo "$BODY" | jq '.'
    else
        echo "$BODY"
    fi
    
    # Check if validation succeeded
    if echo "$BODY" | grep -q '"isValid":true'; then
        echo ""
        echo "✅ IEEE member is VALID"
    elif echo "$BODY" | grep -q '"isValid":false'; then
        echo ""
        echo "❌ IEEE member is INVALID or not found"
    fi
else
    echo "✗ API route returned error (HTTP $HTTP_CODE)"
    echo ""
    echo "Response:"
    echo "$BODY"
    echo ""
    echo "Check:"
    echo "1. Is .env.local file created with VPS_API_URL?"
    echo "2. Is VPS API accessible? Test: curl http://65.20.84.46:5001/health"
    echo "3. Check browser console for errors"
fi

echo ""
echo "=========================================="
echo "Test Complete"
echo "=========================================="

