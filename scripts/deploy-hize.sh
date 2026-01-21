#!/bin/bash
# Hize Next.js Deployment Script
# Deploys Hize site to VPS and configures Nginx + SSL

set -e

# Configuration
VPS_HOST="${1:-}"
DOMAIN="${2:-hize2026.ieeecssrm.in}"
APP_DIR="/opt/hize"
APP_PORT="${APP_PORT:-3010}"

if [ -z "$VPS_HOST" ]; then
    echo "❌ Usage: $0 <vps_user@vps_ip> [domain]"
    echo "   Example: $0 root@123.45.67.89 hize2026.ieeecssrm.in"
    exit 1
fi

echo "🚀 Deploying Hize to VPS"
echo "========================"
echo "Host: $VPS_HOST"
echo "Domain: $DOMAIN"
echo "App Directory: $APP_DIR"
echo "App Port: $APP_PORT"
echo ""

# Test SSH connection
echo "📡 Testing SSH connection..."
ssh -o StrictHostKeyChecking=no "$VPS_HOST" "echo '✅ SSH OK'" || {
    echo "❌ SSH connection failed. Please check:"
    echo "   1. VPS IP is correct"
    echo "   2. SSH key is set up or password auth is enabled"
    exit 1
}

# Install prerequisites
echo "📦 Installing prerequisites..."
ssh "$VPS_HOST" "
    set -e
    apt-get update -y
    apt-get install -y git nginx certbot python3-certbot-nginx curl || true
    
    # Install Node.js 18+ if not present
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    
    # Install PM2 if not present
    npm install -g pm2 || true
    
    echo '✅ Prerequisites installed'
"

# Clone/update repository
echo "📥 Cloning/updating repository..."
ssh "$VPS_HOST" "
    set -e
    mkdir -p $APP_DIR
    cd $APP_DIR
    
    if [ -d .git ]; then
        echo 'Updating existing repository...'
        git fetch origin
        git checkout main
        git reset --hard origin/main
    else
        echo 'Cloning repository...'
        rm -rf $APP_DIR.tmp
        git clone -b main https://github.com/StarkAg/Hize.git $APP_DIR.tmp
        rm -rf $APP_DIR
        mv $APP_DIR.tmp $APP_DIR
        cd $APP_DIR
    fi
    
    echo '✅ Repository ready'
"

# Install dependencies and build
echo "🔨 Building application..."
ssh "$VPS_HOST" "
    set -e
    cd $APP_DIR
    
    echo 'Installing dependencies...'
    if [ -f package-lock.json ]; then
        npm install --legacy-peer-deps || npm ci --legacy-peer-deps || npm install --legacy-peer-deps
    else
        npm install --legacy-peer-deps
    fi
    
    echo 'Building Next.js app...'
    npm run build
    
    echo '✅ Build complete'
"

# Start with PM2
echo "🚀 Starting application with PM2..."
ssh "$VPS_HOST" "
    set -e
    cd $APP_DIR
    
    # Stop existing instance if running
    pm2 stop hize || true
    pm2 delete hize || true
    
    # Start new instance
    PORT=$APP_PORT pm2 start npm --name hize -- start
    pm2 save
    pm2 startup || true
    
    echo '✅ Application started'
    pm2 list | grep hize || true
"

# Configure Nginx
echo "⚙️  Configuring Nginx..."
ssh "$VPS_HOST" "
    set -e
    cat > /etc/nginx/sites-available/$DOMAIN <<NGX
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGX

    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
    nginx -t && systemctl restart nginx
    
    echo '✅ Nginx configured'
"

# SSL Certificate
echo "🔒 Setting up SSL certificate..."
echo "⚠️  Make sure DNS A record for $DOMAIN points to this VPS IP!"
read -p "Press Enter to continue with SSL setup (or Ctrl+C to skip)..."
ssh "$VPS_HOST" "
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --redirect || {
        echo '⚠️  SSL setup failed. This is OK if DNS is not pointing here yet.'
        echo '   Run this manually after DNS is configured:'
        echo "   certbot --nginx -d $DOMAIN"
    }
"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Summary:"
echo "   - App running on: http://127.0.0.1:$APP_PORT"
echo "   - Domain: http://$DOMAIN"
echo "   - PM2: pm2 list (to check status)"
echo "   - Logs: pm2 logs hize"
echo ""
echo "🔧 Next steps:"
echo "   1. Point DNS A record for $DOMAIN to this VPS IP"
echo "   2. After DNS propagates, run:"
echo "      ssh $VPS_HOST 'certbot --nginx -d $DOMAIN'"
echo "   3. Visit https://$DOMAIN"
echo ""
