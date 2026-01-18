#!/bin/bash
#
# VPS Setup Script for IEEE Membership Validator
# Run this script on your VPS to set up the cookie refresh service
#

set -e

echo "=========================================="
echo "IEEE Membership Validator - VPS Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="/opt/ieee-validator"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo "Step 1: Installing system dependencies..."
apt update
apt install -y python3 python3-pip python3-venv git curl nginx

echo ""
echo "Step 2: Installing Playwright system dependencies..."
apt install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libasound2 \
    libasound2-data

echo ""
echo "Step 3: Creating application directory..."
mkdir -p $APP_DIR
cp -r $SCRIPT_DIR/* $APP_DIR/ 2>/dev/null || true
cd $APP_DIR

echo ""
echo "Step 4: Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo ""
echo "Step 5: Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Flask and Flask-CORS for API server
pip install flask flask-cors gunicorn

echo ""
echo "Step 6: Installing Playwright browser..."
playwright install chromium
playwright install-deps chromium

echo ""
echo "Step 7: Setting up systemd services..."

# Cookie Refresher Service
cat > /etc/systemd/system/ieee-cookie-refresher.service <<EOF
[Unit]
Description=IEEE Cookie Refresher Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
Environment="IEEE_USERNAME=${IEEE_USERNAME:-}"
Environment="IEEE_PASSWORD=${IEEE_PASSWORD:-}"
Environment="PATH=$APP_DIR/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=$APP_DIR/venv/bin/python $APP_DIR/cookie_refresher_service.py
Restart=always
RestartSec=60
StandardOutput=append:$APP_DIR/cookie_refresh.log
StandardError=append:$APP_DIR/cookie_refresh.log

[Install]
WantedBy=multi-user.target
EOF

# API Server Service
cat > /etc/systemd/system/ieee-api-server.service <<EOF
[Unit]
Description=IEEE Cookie API Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
Environment="PORT=5000"
Environment="API_KEY=${API_KEY:-}"
Environment="PATH=$APP_DIR/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=$APP_DIR/venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 --timeout 120 api_server:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "Step 8: Setting file permissions..."
chmod +x $APP_DIR/*.py
chown -R root:root $APP_DIR

echo ""
echo "Step 9: Enabling and starting services..."
systemctl daemon-reload
systemctl enable ieee-cookie-refresher
systemctl enable ieee-api-server

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Set environment variables:"
echo "   export IEEE_USERNAME='your-email@example.com'"
echo "   export IEEE_PASSWORD='your-password'"
echo "   export API_KEY='your-secret-api-key'  # Optional but recommended"
echo ""
echo "   Then update services:"
echo "   sudo systemctl edit ieee-cookie-refresher"
echo "   sudo systemctl edit ieee-api-server"
echo "   # Add [Service] section with Environment= lines"
echo ""
echo "2. Start the services:"
echo "   sudo systemctl start ieee-cookie-refresher"
echo "   sudo systemctl start ieee-api-server"
echo ""
echo "3. Check status:"
echo "   sudo systemctl status ieee-cookie-refresher"
echo "   sudo systemctl status ieee-api-server"
echo ""
echo "4. View logs:"
echo "   sudo journalctl -u ieee-cookie-refresher -f"
echo "   sudo journalctl -u ieee-api-server -f"
echo ""
echo "5. Test API endpoint:"
echo "   curl http://localhost:5000/health"
echo "   curl http://localhost:5000/api/cookie"
echo ""
echo "6. (Optional) Set up Nginx reverse proxy - see VPS_SETUP.md"
echo ""

