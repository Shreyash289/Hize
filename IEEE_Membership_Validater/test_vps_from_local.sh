#!/bin/bash
#
# Test VPS API from local machine
#

VPS_IP="65.20.84.46"

echo "=========================================="
echo "Testing VPS API: $VPS_IP"
echo "=========================================="
echo ""

echo "1. Testing /health endpoint on port 5000:"
curl -s http://$VPS_IP:5000/health | jq '.' 2>/dev/null || curl -s http://$VPS_IP:5000/health
echo ""
echo ""

echo "2. Testing /health endpoint on port 5001:"
curl -s http://$VPS_IP:5001/health | jq '.' 2>/dev/null || curl -s http://$VPS_IP:5001/health
echo ""
echo ""

echo "3. Testing /api/cookie/status on port 5000:"
curl -s http://$VPS_IP:5000/api/cookie/status | jq '.' 2>/dev/null || curl -s http://$VPS_IP:5000/api/cookie/status
echo ""
echo ""

echo "4. Testing /api/cookie/status on port 5001:"
curl -s http://$VPS_IP:5001/api/cookie/status | jq '.' 2>/dev/null || curl -s http://$VPS_IP:5001/api/cookie/status
echo ""
echo ""

echo "5. Testing /api/cookie on port 5000:"
curl -s http://$VPS_IP:5000/api/cookie | jq '.' 2>/dev/null || curl -s http://$VPS_IP:5000/api/cookie | head -c 200
echo ""
echo ""

echo "6. Testing /api/cookie on port 5001:"
curl -s http://$VPS_IP:5001/api/cookie | jq '.' 2>/dev/null || curl -s http://$VPS_IP:5001/api/cookie | head -c 200
echo ""

