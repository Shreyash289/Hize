#!/bin/bash
#
# Test script for VPS API - Run this to verify your setup works
#

VPS_URL="${1:-http://localhost:5000}"
API_KEY="${2:-}"

echo "=========================================="
echo "Testing VPS API: $VPS_URL"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Build headers
HEADERS=()
if [ -n "$API_KEY" ]; then
    HEADERS+=(-H "Authorization: Bearer $API_KEY")
fi

# Test 1: Health Check
echo "1. Testing /health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${HEADERS[@]}" "$VPS_URL/health")
HTTP_STATUS=$(echo "$HEALTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "Response: $HEALTH_BODY"
else
    echo -e "${RED}✗ Health check failed (HTTP $HTTP_STATUS)${NC}"
    echo "Response: $HEALTH_BODY"
fi
echo ""

# Test 2: Cookie Status
echo "2. Testing /api/cookie/status endpoint..."
STATUS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${HEADERS[@]}" "$VPS_URL/api/cookie/status")
HTTP_STATUS=$(echo "$STATUS_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
STATUS_BODY=$(echo "$STATUS_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Status check passed${NC}"
    echo "Response: $STATUS_BODY"
    
    # Check if cookie is available
    if echo "$STATUS_BODY" | grep -q '"available":true'; then
        echo -e "${GREEN}✓ Cookie is available${NC}"
    else
        echo -e "${YELLOW}⚠ Cookie not yet available (may still be refreshing)${NC}"
    fi
else
    echo -e "${RED}✗ Status check failed (HTTP $HTTP_STATUS)${NC}"
    echo "Response: $STATUS_BODY"
fi
echo ""

# Test 3: Get Cookie
echo "3. Testing /api/cookie endpoint..."
COOKIE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${HEADERS[@]}" "$VPS_URL/api/cookie")
HTTP_STATUS=$(echo "$COOKIE_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
COOKIE_BODY=$(echo "$COOKIE_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Cookie endpoint working${NC}"
    COOKIE=$(echo "$COOKIE_BODY" | grep -o '"cookie":"[^"]*' | cut -d'"' -f4)
    if [ -n "$COOKIE" ]; then
        COOKIE_LENGTH=${#COOKIE}
        echo "Cookie length: $COOKIE_LENGTH characters"
        echo "Cookie preview: ${COOKIE:0:50}..."
        if [ "$COOKIE_LENGTH" -gt 50 ]; then
            echo -e "${GREEN}✓ Cookie appears valid${NC}"
        else
            echo -e "${YELLOW}⚠ Cookie seems too short (may be invalid)${NC}"
        fi
    else
        echo -e "${RED}✗ No cookie in response${NC}"
    fi
elif [ "$HTTP_STATUS" = "503" ]; then
    echo -e "${YELLOW}⚠ Cookie not available (service may still be initializing)${NC}"
    echo "Response: $COOKIE_BODY"
elif [ "$HTTP_STATUS" = "401" ]; then
    echo -e "${RED}✗ Unauthorized - Check API key${NC}"
    echo "Response: $COOKIE_BODY"
else
    echo -e "${RED}✗ Cookie endpoint failed (HTTP $HTTP_STATUS)${NC}"
    echo "Response: $COOKIE_BODY"
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "503" ]; then
    echo -e "${GREEN}✓ API is responding${NC}"
    echo ""
    echo "Next steps:"
    echo "1. If cookie not available, wait for first refresh (check logs)"
    echo "2. Verify VPS_API_URL is set in Vercel: $VPS_URL"
    if [ -n "$API_KEY" ]; then
        echo "3. Verify VPS_API_KEY is set in Vercel: $API_KEY"
    fi
    echo "4. Test from Next.js app - validate a membership number"
else
    echo -e "${RED}✗ API is not responding correctly${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check if service is running: sudo systemctl status ieee-api-server"
    echo "2. Check logs: sudo journalctl -u ieee-api-server -n 50"
    echo "3. Verify port 5000 is open: sudo netstat -tlnp | grep 5000"
    echo "4. Check firewall: sudo ufw status"
fi

