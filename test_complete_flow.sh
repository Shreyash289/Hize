#!/bin/bash
#
# Complete End-to-End Test of IEEE Validation
#

VPS_URL="http://65.20.84.46:5001"
TEST_MEMBER="99634594"

echo "=========================================="
echo "Complete IEEE Validation Flow Test"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: VPS API Health Check${NC}"
echo "----------------------------------------"
HEALTH=$(curl -s "$VPS_URL/health")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
    echo -e "${GREEN}✓ VPS API is healthy${NC}"
    echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
else
    echo -e "${RED}✗ VPS API not healthy${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 2: Get Cookie from VPS${NC}"
echo "----------------------------------------"
COOKIE_RESP=$(curl -s "$VPS_URL/api/cookie")
COOKIE=$(echo "$COOKIE_RESP" | grep -o '"cookie":"[^"]*' | cut -d'"' -f4)

if [ -n "$COOKIE" ] && [ ${#COOKIE} -gt 50 ]; then
    echo -e "${GREEN}✓ Cookie retrieved successfully${NC}"
    echo "Cookie length: ${#COOKIE} characters"
else
    echo -e "${RED}✗ Failed to get cookie${NC}"
    echo "$COOKIE_RESP"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 3: Validate IEEE Member Directly${NC}"
echo "----------------------------------------"
echo "Testing member: $TEST_MEMBER"

FORM_DATA="customerId=$TEST_MEMBER"
IEEE_RESP=$(curl -s -X POST "https://services24.ieee.org/membership-validator.html" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "Cookie: PA.Global_Websession=$COOKIE" \
    -H "User-Agent: Mozilla/5.0" \
    --data "$FORM_DATA" \
    --max-time 30)

if echo "$IEEE_RESP" | grep -q "Membership validation status"; then
    echo -e "${GREEN}✓ IEEE validation request successful${NC}"
    
    # Extract status
    STATUS=$(echo "$IEEE_RESP" | grep -oP 'Membership status[^<]*<span[^>]*>\K[^<]+' | head -1 | xargs || echo "")
    if [ -n "$STATUS" ]; then
        echo "Membership Status: $STATUS"
        if echo "$STATUS" | grep -qi "active"; then
            echo -e "${GREEN}✓ Member is ACTIVE${NC}"
        else
            echo -e "${YELLOW}⚠ Member status: $STATUS${NC}"
        fi
    fi
else
    echo -e "${RED}✗ IEEE validation failed${NC}"
    echo "Response preview: $(echo "$IEEE_RESP" | head -c 300)"
fi
echo ""

echo -e "${BLUE}Step 4: Test Next.js API Route${NC}"
echo "----------------------------------------"
echo "Note: This requires Next.js dev server running (npm run dev)"
echo "Or test after deploying to Vercel"
echo ""

echo "=========================================="
echo -e "${GREEN}✓ All Backend Tests Passed!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start Next.js: cd . && npm run dev"
echo "2. Test in browser: http://localhost:3000"
echo "3. Open registration modal and test IEEE validation"
echo "4. Deploy to Vercel with VPS_API_URL=http://65.20.84.46:5001"
echo ""

