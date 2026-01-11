#!/bin/bash
VPS_IP="65.20.84.46"
VPS_USER="root"

echo "=========================================="
echo "IEEE Validator - Quick Deploy to VPS"
echo "VPS: $VPS_USER@$VPS_IP"
echo "=========================================="
echo ""

echo "Step 1: Uploading files to VPS..."
echo "(You'll be prompted for password)"
echo ""

rsync -avz --progress \
  --exclude 'venv' \
  --exclude '__pycache__' \
  --exclude '*.pyc' \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude 'web-app/node_modules' \
  --exclude '*.log' \
  --exclude 'ieee_cookie.txt' \
  -e "ssh" \
  ./ $VPS_USER@$VPS_IP:/tmp/ieee-validator/

echo ""
echo "✓ Files uploaded!"
echo ""

echo "Step 2: Running setup on VPS..."
echo "(You'll be prompted for password again)"
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
cd /tmp/ieee-validator
chmod +x vps_setup.sh test_vps_api.sh
sudo ./vps_setup.sh
ENDSSH

echo ""
echo "=========================================="
echo "✓ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. SSH to VPS:"
echo "   ssh root@65.20.84.46"
echo ""
echo "2. Configure IEEE credentials:"
echo "   sudo systemctl edit ieee-cookie-refresher"
echo "   # Add Environment lines with your IEEE email/password"
echo ""
echo "3. Start services:"
echo "   sudo systemctl start ieee-cookie-refresher"
echo "   sudo systemctl start ieee-api-server"
echo ""
echo "4. Test:"
echo "   curl http://localhost:5000/health"
echo ""
