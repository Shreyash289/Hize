# VPS Deployment Guide - Complete Setup

## 🎯 Overview

This guide will help you deploy the IEEE Membership Validator on your VPS so that:
- ✅ Cookies refresh automatically every 4 hours
- ✅ Cookie is available instantly via API
- ✅ No waiting time for users
- ✅ Services run continuously and auto-restart

---

## 📋 Prerequisites

- **VPS with:**
  - Ubuntu 20.04+ or Debian 11+ (recommended)
  - 1GB+ RAM
  - Root or sudo access
  - Python 3.9+
  - ~2GB free disk space

- **IEEE Credentials:**
  - IEEE email address
  - IEEE password

---

## 🚀 Quick Setup (Automated)

### Step 1: Upload Files to VPS

```bash
# On your local machine, from IEEE_Membership_Validater directory:
scp -r * user@your-vps-ip:/tmp/ieee-validator/
```

Or use Git:
```bash
# On VPS
cd /tmp
git clone <your-repo-url> ieee-validator
cd ieee-validator
```

### Step 2: Run Setup Script

```bash
# On VPS
cd /tmp/ieee-validator
chmod +x vps_setup.sh
sudo ./vps_setup.sh
```

### Step 3: Configure Environment Variables

**Option A: Systemd override (Recommended)**

```bash
# Edit cookie refresher service
sudo systemctl edit ieee-cookie-refresher

# Add these lines:
[Service]
Environment="IEEE_USERNAME=your-email@example.com"
Environment="IEEE_PASSWORD=your-password"

# Edit API server service (optional API key)
sudo systemctl edit ieee-api-server

# Add these lines:
[Service]
Environment="API_KEY=your-secret-key-here"
```

**Option B: Create .env file (Alternative)**

```bash
sudo nano /opt/ieee-validator/.env
```

Add:
```
IEEE_USERNAME=your-email@example.com
IEEE_PASSWORD=your-password
API_KEY=your-secret-key
```

Then modify services to load .env file.

### Step 4: Start Services

```bash
sudo systemctl start ieee-cookie-refresher
sudo systemctl start ieee-api-server

# Check status
sudo systemctl status ieee-cookie-refresher
sudo systemctl status ieee-api-server
```

### Step 5: Test the API

```bash
# Health check
curl http://localhost:5000/health

# Get cookie (if no API key set)
curl http://localhost:5000/api/cookie

# Get cookie (with API key)
curl -H "Authorization: Bearer your-secret-key" http://localhost:5000/api/cookie
```

---

## 🔧 Manual Setup (Step by Step)

If the automated script doesn't work, follow these steps:

### 1. Install Dependencies

```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git curl
```

### 2. Install Playwright Dependencies

```bash
sudo apt install -y \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
    libxdamage1 libxfixes3 libxrandr2 libgbm1 \
    libpango-1.0-0 libasound2
```

### 3. Set Up Application

```bash
sudo mkdir -p /opt/ieee-validator
sudo cp -r /tmp/ieee-validator/* /opt/ieee-validator/
cd /opt/ieee-validator
sudo python3 -m venv venv
sudo venv/bin/pip install --upgrade pip
sudo venv/bin/pip install -r requirements.txt
sudo venv/bin/pip install flask flask-cors gunicorn
sudo venv/bin/playwright install chromium
sudo venv/bin/playwright install-deps chromium
```

### 4. Set Permissions

```bash
sudo chmod +x /opt/ieee-validator/*.py
```

### 5. Create Systemd Services

**Cookie Refresher Service:**

```bash
sudo nano /etc/systemd/system/ieee-cookie-refresher.service
```

Paste:
```ini
[Unit]
Description=IEEE Cookie Refresher Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ieee-validator
Environment="IEEE_USERNAME=your-email@example.com"
Environment="IEEE_PASSWORD=your-password"
Environment="PATH=/opt/ieee-validator/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/opt/ieee-validator/venv/bin/python /opt/ieee-validator/cookie_refresher_service.py
Restart=always
RestartSec=60
StandardOutput=append:/opt/ieee-validator/cookie_refresh.log
StandardError=append:/opt/ieee-validator/cookie_refresh.log

[Install]
WantedBy=multi-user.target
```

**API Server Service:**

```bash
sudo nano /etc/systemd/system/ieee-api-server.service
```

Paste:
```ini
[Unit]
Description=IEEE Cookie API Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ieee-validator
Environment="PORT=5000"
Environment="API_KEY=your-secret-key"
Environment="PATH=/opt/ieee-validator/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/opt/ieee-validator/venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 --timeout 120 api_server:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 6. Enable and Start Services

```bash
sudo systemctl daemon-reload
sudo systemctl enable ieee-cookie-refresher
sudo systemctl enable ieee-api-server
sudo systemctl start ieee-cookie-refresher
sudo systemctl start ieee-api-server
```

---

## 🔒 Security Setup (Nginx + SSL)

### 1. Install Nginx

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

### 2. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/ieee-validator
```

Paste:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Change to your domain

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/ieee-validator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Set Up SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d your-domain.com
```

---

## 🔍 Monitoring & Troubleshooting

### View Logs

```bash
# Cookie refresher logs
sudo journalctl -u ieee-cookie-refresher -f

# API server logs
sudo journalctl -u ieee-api-server -f

# Application logs
tail -f /opt/ieee-validator/cookie_refresh.log
```

### Check Service Status

```bash
sudo systemctl status ieee-cookie-refresher
sudo systemctl status ieee-api-server
```

### Restart Services

```bash
sudo systemctl restart ieee-cookie-refresher
sudo systemctl restart ieee-api-server
```

### Test Cookie Refresh Manually

```bash
cd /opt/ieee-validator
source venv/bin/activate
export IEEE_USERNAME="your-email@example.com"
export IEEE_PASSWORD="your-password"
python ieee_login.py
```

---

## 🌐 Update Next.js App to Use VPS

### Update Validation API

Modify `web-app/app/api/validate/route.ts`:

```typescript
// At the top of POST handler, before validation:
let cookie: string;

try {
  // Fetch cookie from VPS API
  const vpsApiUrl = process.env.VPS_API_URL || 'http://your-vps-ip:5000';
  const apiKey = process.env.VPS_API_KEY || '';
  
  const headers: HeadersInit = {};
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const cookieResponse = await fetch(`${vpsApiUrl}/api/cookie`, { headers });
  
  if (!cookieResponse.ok) {
    return NextResponse.json(
      { error: 'Cookie service unavailable. Please try again later.' },
      { status: 503 }
    );
  }
  
  const cookieData = await cookieResponse.json();
  cookie = cookieData.cookie;
  
} catch (error) {
  console.error('Failed to fetch cookie from VPS:', error);
  return NextResponse.json(
    { error: 'Failed to connect to cookie service' },
    { status: 503 }
  );
}

// Use 'cookie' variable instead of 'cookie' from request body
const validator = new IEEEMembershipValidator(cookie, delay);
```

### Add Environment Variables to Vercel

In Vercel Dashboard → Project Settings → Environment Variables:

- `VPS_API_URL`: `https://your-domain.com` or `http://your-vps-ip:5000`
- `VPS_API_KEY`: Your API key (if you set one)

### Remove Hardcoded Cookie

Update `web-app/app/page.tsx` to remove the defaultCookie or fetch it dynamically.

---

## ✅ Verification Checklist

- [ ] Services are running: `sudo systemctl status ieee-cookie-refresher ieee-api-server`
- [ ] Health check works: `curl http://localhost:5000/health`
- [ ] Cookie endpoint returns cookie: `curl http://localhost:5000/api/cookie`
- [ ] Cookie file exists: `ls -la /opt/ieee-validator/ieee_cookie.txt`
- [ ] Logs show successful refresh: `tail -n 50 /opt/ieee-validator/cookie_refresh.log`
- [ ] Next.js app can fetch cookie from VPS
- [ ] Validation works end-to-end

---

## 🆘 Common Issues

### Issue: Cookie refresh fails with CAPTCHA

**Solution:** IEEE may be detecting automation. Options:
- Reduce refresh frequency
- Use a residential proxy
- Manual refresh occasionally

### Issue: Service won't start

**Solution:**
```bash
sudo systemctl status ieee-cookie-refresher
# Check error messages
sudo journalctl -u ieee-cookie-refresher -n 50
```

### Issue: Playwright browser not found

**Solution:**
```bash
cd /opt/ieee-validator
source venv/bin/activate
playwright install chromium
playwright install-deps chromium
```

### Issue: Port 5000 already in use

**Solution:**
- Change port in `/etc/systemd/system/ieee-api-server.service`
- Update `Environment="PORT=5001"` (or another port)
- Update Next.js app to use new port

---

## 📞 Need Help?

Check the logs first:
```bash
sudo journalctl -u ieee-cookie-refresher -n 100
sudo journalctl -u ieee-api-server -n 100
```

Then check application logs:
```bash
cat /opt/ieee-validator/cookie_refresh.log
```

