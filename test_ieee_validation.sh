#!/bin/bash
#
# Test IEEE Validation Integration
# Tests both VPS API and Next.js API route
#

set -e

VPS_IP="65.20.84.46"
VPS_PORT="5001"
VPS_URL="http://${VPS_IP}:${VPS_PORT}"
TEST_MEMBER_ID="${1:-99634594}"  # Default test member ID

echo "=========================================="
echo "IEEE Validation Integration Test"
echo "=========================================="
echo ""
echo "Test Member ID: $TEST_MEMBER_ID"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: VPS Health Check
echo -e "${BLUE}Test 1: VPS API Health Check${NC}"
echo "----------------------------------------"
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$VPS_URL/health" || echo "CONNECTION_FAILED")
HTTP_STATUS=$(echo "$HEALTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2 || echo "000")
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '/HTTP_STATUS/d' || echo "")

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ VPS API is responding${NC}"
    echo "Response: $HEALTH_BODY" | head -3
else
    echo -e "${RED}✗ VPS API not responding (HTTP $HTTP_STATUS)${NC}"
    echo "Make sure VPS API server is running on port $VPS_PORT"
    exit 1
fi
echo ""

# Test 2: Get Cookie from VPS
echo -e "${BLUE}Test 2: Get Cookie from VPS API${NC}"
echo "----------------------------------------"
COOKIE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$VPS_URL/api/cookie" || echo "CONNECTION_FAILED")
HTTP_STATUS=$(echo "$COOKIE_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2 || echo "000")
COOKIE_BODY=$(echo "$COOKIE_RESPONSE" | sed '/HTTP_STATUS/d' || echo "")

if [ "$HTTP_STATUS" = "200" ]; then
    COOKIE=$(echo "$COOKIE_BODY" | grep -o '"cookie":"[^"]*' | cut -d'"' -f4 || echo "")
    if [ -n "$COOKIE" ] && [ ${#COOKIE} -gt 50 ]; then
        echo -e "${GREEN}✓ Cookie retrieved successfully${NC}"
        echo "Cookie length: ${#COOKIE} characters"
        echo "Cookie preview: ${COOKIE:0:50}..."
    else
        echo -e "${YELLOW}⚠ Cookie may be invalid or too short${NC}"
        echo "Response: $COOKIE_BODY"
    fi
elif [ "$HTTP_STATUS" = "503" ]; then
    echo -e "${YELLOW}⚠ Cookie not available yet (service may still be initializing)${NC}"
    echo "Wait 1-2 minutes for cookie refresh, then try again"
    echo "Response: $COOKIE_BODY"
else
    echo -e "${RED}✗ Failed to get cookie (HTTP $HTTP_STATUS)${NC}"
    echo "Response: $COOKIE_BODY"
    exit 1
fi
echo ""

# Test 3: Direct IEEE Validation (if cookie available)
if [ -n "$COOKIE" ] && [ ${#COOKIE} -gt 50 ]; then
    echo -e "${BLUE}Test 3: Direct IEEE Validation${NC}"
    echo "----------------------------------------"
    echo "Validating member: $TEST_MEMBER_ID"
    
    # Create form data
    FORM_DATA="customerId=$TEST_MEMBER_ID"
    
    # Send request to IEEE
    IEEE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
        -X POST "https://services24.ieee.org/membership-validator.html" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -H "Cookie: PA.Global_Websession=$COOKIE" \
        -H "User-Agent: Mozilla/5.0" \
        --data "$FORM_DATA" \
        --max-time 30 || echo "TIMEOUT")
    
    HTTP_STATUS=$(echo "$IEEE_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2 || echo "000")
    IEEE_BODY=$(echo "$IEEE_RESPONSE" | sed '/HTTP_STATUS/d' || echo "")
    
    if echo "$IEEE_BODY" | grep -q "Membership validation status"; then
        echo -e "${GREEN}✓ IEEE validation request successful${NC}"
        
        # Extract status
        STATUS=$(echo "$IEEE_BODY" | grep -oP 'Membership status[^<]*<span[^>]*>\K[^<]+' | head -1 || echo "")
        if [ -n "$STATUS" ]; then
            echo "Membership Status: $STATUS"
            if echo "$STATUS" | grep -qi "active"; then
                echo -e "${GREEN}✓ Member is ACTIVE${NC}"
            else
                echo -e "${YELLOW}⚠ Member status: $STATUS${NC}"
            fi
        fi
    else
        echo -e "${RED}✗ IEEE validation failed or session expired${NC}"
        echo "Response preview: $(echo "$IEEE_BODY" | head -c 200)"
    fi
    echo ""
fi

# Test 4: Next.js API Route (if running locally)
echo -e "${BLUE}Test 4: Next.js API Route${NC}"
echo "----------------------------------------"
LOCAL_API="http://localhost:3000/api/validate-ieee"

if curl -s --connect-timeout 2 "$LOCAL_API" > /dev/null 2>&1; then
    echo "Testing Next.js API route..."
    API_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
        -X POST "$LOCAL_API" \
        -H "Content-Type: application/json" \
        -d "{\"memberId\": \"$TEST_MEMBER_ID\"}" \
        --max-time 30 || echo "TIMEOUT")
    
    HTTP_STATUS=$(echo "$API_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2 || echo "000")
    API_BODY=$(echo "$API_RESPONSE" | sed '/HTTP_STATUS/d' || echo "")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✓ Next.js API route working${NC}"
        echo "Response: $API_BODY"
        
        # Parse JSON response
        if command -v jq > /dev/null; then
            echo ""
            echo "Parsed response:"
            echo "$API_BODY" | jq '.'
        fi
    else
        echo -e "${YELLOW}⚠ Next.js API returned HTTP $HTTP_STATUS${NC}"
        echo "Response: $API_BODY"
        echo ""
        echo "Note: Make sure Next.js dev server is running: npm run dev"
    fi
else
    echo -e "${YELLOW}⚠ Next.js dev server not running${NC}"
    echo "Start it with: cd src && npm run dev"
    echo "Or test after deploying to Vercel"
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "503" ]; then
    echo -e "${GREEN}✓ VPS API is accessible${NC}"
else
    echo -e "${RED}✗ VPS API is not accessible${NC}"
fi

if [ -n "$COOKIE" ] && [ ${#COOKIE} -gt 50 ]; then
    echo -e "${GREEN}✓ Cookie is available${NC}"
else
    echo -e "${YELLOW}⚠ Cookie not available (may need to wait for refresh)${NC}"
fi

echo ""
echo "Next steps:"
echo "1. Ensure VPS API is running: ssh root@$VPS_IP 'sudo systemctl status ieee-api-server'"
echo "2. Check cookie refresh: ssh root@$VPS_IP 'sudo journalctl -u ieee-cookie-refresher -n 20'"
echo "3. Test Next.js API: Start dev server (npm run dev) and visit registration modal"
echo "4. Test on Vercel: Deploy and test the registration modal"
echo ""

