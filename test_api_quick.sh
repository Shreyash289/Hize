#!/bin/bash
# Quick test script for VPS API

VPS_IP="65.20.84.46"

echo "Testing VPS API connectivity..."
echo ""

echo "Port 5000:"
curl -s --connect-timeout 3 http://$VPS_IP:5000/health 2>&1 | head -3 || echo "✗ Connection failed"
echo ""

echo "Port 5001:"
curl -s --connect-timeout 3 http://$VPS_IP:5001/health 2>&1 | head -3 || echo "✗ Connection failed"
echo ""

echo "Testing cookie endpoint on port 5001:"
curl -s --connect-timeout 3 http://$VPS_IP:5001/api/cookie 2>&1 | head -5 || echo "✗ Connection failed"
echo ""

echo "If both fail, the API server may not be running or firewall is blocking."
echo "SSH to VPS and check: sudo systemctl status ieee-api-server"

