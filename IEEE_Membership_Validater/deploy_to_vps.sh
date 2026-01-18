#!/bin/bash
#
# Automated Deployment Script for IEEE Validator VPS
# This script uploads files and sets up the VPS
#

set -e

VPS_IP="65.20.84.46"
VPS_USER="${VPS_USER:-root}"  # Change if using different user
APP_DIR="/opt/ieee-validator"
LOCAL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================="
echo "IEEE Validator VPS Deployment"
echo "VPS IP: $VPS_IP"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we have necessary files
if [ ! -f "vps_setup.sh" ]; then
    echo -e "${RED}Error: vps_setup.sh not found. Run this from IEEE_Membership_Validater directory${NC}"
    exit 1
fi

echo "Step 1: Uploading files to VPS..."
echo "This may take a few minutes..."

# Create remote directory and upload files
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "mkdir -p /tmp/ieee-validator" || true

# Upload files (excluding venv, __pycache__, etc.)
rsync -avz --progress \
    --exclude 'venv' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude 'web-app/node_modules' \
    --exclude '*.log' \
    --exclude 'ieee_cookie.txt' \
    -e "ssh -o StrictHostKeyChecking=no" \
    "$LOCAL_DIR/" $VPS_USER@$VPS_IP:/tmp/ieee-validator/

echo -e "${GREEN}✓ Files uploaded successfully${NC}"
echo ""

echo "Step 2: Running setup on VPS..."
echo "You may be prompted for the VPS password..."

ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP << 'ENDSSH'
cd /tmp/ieee-validator
chmod +x vps_setup.sh
sudo ./vps_setup.sh
ENDSSH

echo -e "${GREEN}✓ Setup completed${NC}"
echo ""

echo "Step 3: Configuration required..."
echo ""
echo -e "${YELLOW}IMPORTANT: You need to configure credentials manually:${NC}"
echo ""
echo "Run these commands on the VPS:"
echo ""
echo "  ssh $VPS_USER@$VPS_IP"
echo ""
echo "  sudo systemctl edit ieee-cookie-refresher"
echo ""
echo "  # Add these lines:"
echo "  [Service]"
echo "  Environment=\"IEEE_USERNAME=your-ieee-email@example.com\""
echo "  Environment=\"IEEE_PASSWORD=your-ieee-password\""
echo ""
echo "  # Save and exit (Ctrl+X, then Y, then Enter)"
echo ""
echo "  sudo systemctl restart ieee-cookie-refresher"
echo "  sudo systemctl restart ieee-api-server"
echo ""
echo "  # Test:"
echo "  curl http://localhost:5000/health"
echo "  curl http://localhost:5000/api/cookie"
echo ""

echo "=========================================="
echo -e "${GREEN}Deployment Script Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure IEEE credentials (see above)"
echo "2. Start services and test"
echo "3. Update Vercel environment variables:"
echo "   VPS_API_URL=http://$VPS_IP:5000"
echo ""

