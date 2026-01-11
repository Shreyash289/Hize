#!/bin/bash
# Script to update VPS API with new validation endpoint
# Run this ON THE VPS

echo "Updating VPS API server with validation endpoint..."

# Backup current file
cp /opt/ieee-validator/api_server.py /opt/ieee-validator/api_server.py.backup

# The new api_server.py should already be uploaded, or upload it now
# For now, let's just restart the service to pick up changes

echo "Restarting API server..."
sudo systemctl restart ieee-api-server

sleep 2

echo "Checking status..."
sudo systemctl status ieee-api-server --no-pager -l | head -20

echo ""
echo "Testing new endpoint..."
curl -s -X POST http://localhost:5001/api/validate-member \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}' | head -10

echo ""
echo "Done!"

