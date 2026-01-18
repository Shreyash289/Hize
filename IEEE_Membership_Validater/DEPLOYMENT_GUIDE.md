# Live Deployment Guide - Always-Available IEEE Validator

## 🎯 Goal
Make the validator **instantly available** to users without waiting for cookie refresh or redeployments.

## 📊 Current Problem
- Cookie is hardcoded in `page.tsx`
- Requires GitHub Actions workflow to refresh → commit → redeploy (takes 1-2 minutes)
- Users must wait or click "Fire Up Validator API"

## ✅ Solution Options

### **Option 1: Serverless with Database Storage (RECOMMENDED - Cheapest & Best)**

**How it works:**
- Store cookie in a database (Redis/Vercel KV/Upstash)
- Scheduled function refreshes cookie automatically every 4-5 hours
- API reads fresh cookie from database instantly
- No VPS needed, fully serverless

**Requirements:**
- ✅ Next.js app on Vercel (FREE tier works)
- ✅ Vercel KV (Redis) or Upstash Redis (FREE tier)
- ✅ Vercel Cron Jobs (FREE)
- ✅ GitHub Actions for cookie refresh (already set up)

**Cost:** FREE or ~$5/month (if you exceed free tiers)

**Pros:**
- ✅ No server management
- ✅ Auto-scales
- ✅ Fast response times
- ✅ Free tier sufficient for most use cases

---

### **Option 2: VPS (Full Control)**

**How it works:**
- Run a background service that refreshes cookies every 4-5 hours
- Store cookie in a file or database
- API endpoint serves fresh cookie on demand

**Requirements:**
- 🖥️ VPS (Virtual Private Server)
- 🐧 Linux OS (Ubuntu 22.04 recommended)
- 🐍 Python 3.9+
- ⚙️ Systemd or PM2 for process management
- 🔒 Firewall setup
- 📦 Nginx (reverse proxy, optional)

**VPS Options:**

#### **Budget-Friendly VPS:**
1. **DigitalOcean Droplet**
   - **Specs:** $6/month - 1GB RAM, 1 vCPU, 25GB SSD
   - **Good for:** Low traffic (<1000 validations/day)
   - **URL:** https://m.do.co/c/yourcode

2. **Linode (Akamai)**
   - **Specs:** $5/month - 1GB RAM, 1 vCPU, 25GB SSD
   - **Good for:** Similar to DigitalOcean

3. **Hetzner Cloud**
   - **Specs:** €4.15/month - 2GB RAM, 1 vCPU, 20GB SSD
   - **Best value** for European servers

4. **Vultr**
   - **Specs:** $6/month - 1GB RAM, 1 vCPU, 25GB SSD
   - **Global locations**

#### **Managed Services (Easier but pricier):**
1. **Railway** - $5/month + usage (~$10-15/month)
2. **Render** - $7/month for always-on services
3. **Fly.io** - $1.94/month for smallest instance

**Cost:** $5-15/month

**Pros:**
- ✅ Full control
- ✅ Can run multiple services
- ✅ Predictable costs

**Cons:**
- ❌ Requires server management
- ❌ Need to handle security updates
- ❌ Must set up monitoring

---

### **Option 3: Hybrid Approach (BEST FOR PRODUCTION)**

**How it works:**
- Next.js frontend on Vercel (FREE)
- Cookie refresh service on VPS/Railway/Render
- Cookie stored in Redis/Upstash (accessible from both)

**Requirements:**
- Vercel account (FREE)
- Small VPS or Railway/Render (~$5-10/month)
- Upstash Redis (FREE tier)

**Cost:** $5-10/month

**Pros:**
- ✅ Separates concerns
- ✅ Frontend scales automatically
- ✅ Backend can be restarted independently

---

## 🚀 Implementation: Option 1 (Recommended)

### Step 1: Set Up Vercel KV (Redis)

1. Install Vercel KV:
```bash
npm install @vercel/kv
```

2. In Vercel Dashboard:
   - Go to your project → **Storage** → **Create Database**
   - Select **KV** (Redis)
   - Create database (FREE tier: 256MB, 10,000 commands/day)

3. Add to `.env.local`:
```env
KV_URL=your-kv-url
KV_REST_API_URL=your-rest-api-url
KV_REST_API_TOKEN=your-token
KV_REST_API_READ_ONLY_TOKEN=your-read-only-token
```

### Step 2: Create Cookie Storage API

Create `app/api/cookie/route.ts`:

```typescript
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

// Get cookie (used by validation API)
export async function GET() {
  try {
    const cookie = await kv.get<string>('ieee_cookie');
    if (!cookie) {
      return NextResponse.json({ error: 'Cookie not available' }, { status: 404 });
    }
    return NextResponse.json({ cookie });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get cookie' }, { status: 500 });
  }
}

// Set cookie (used by refresh service)
export async function POST(request: NextRequest) {
  try {
    const { cookie } = await request.json();
    if (!cookie) {
      return NextResponse.json({ error: 'Cookie required' }, { status: 400 });
    }
    
    // Store with expiration (6 hours)
    await kv.setex('ieee_cookie', 6 * 60 * 60, cookie);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set cookie' }, { status: 500 });
  }
}
```

### Step 3: Update Validation API to Use Stored Cookie

Modify `app/api/validate/route.ts` to read cookie from KV instead of request body:

```typescript
import { kv } from '@vercel/kv';

// At the top of POST handler:
const storedCookie = await kv.get<string>('ieee_cookie');
if (!storedCookie) {
  return NextResponse.json({ error: 'Cookie not available. Please refresh.' }, { status: 503 });
}

// Use storedCookie instead of cookie from body
const validator = new IEEEMembershipValidator(storedCookie, delay);
```

### Step 4: Create Scheduled Cookie Refresh

Create `app/api/cron/refresh-cookie/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Call GitHub Actions workflow or run Playwright script
    // Then store cookie in KV
    const newCookie = await refreshCookieFromIEEE(); // Implement this
    await kv.setex('ieee_cookie', 6 * 60 * 60, newCookie);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh' }, { status: 500 });
  }
}
```

### Step 5: Set Up Vercel Cron

Create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/refresh-cookie",
    "schedule": "0 */4 * * *"
  }]
}
```

**Note:** Vercel Cron requires Pro plan ($20/month) OR use external cron service like:
- Cron-job.org (FREE)
- EasyCron (FREE tier)
- GitHub Actions (already using, FREE)

### Step 6: Update GitHub Actions to Store in KV

Modify `.github/workflows/refresh-cookie.yml` to call your API:

```yaml
- name: Store cookie in Vercel KV
  run: |
    curl -X POST https://your-app.vercel.app/api/cookie \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${{ secrets.VERCEL_CRON_SECRET }}" \
      -d "{\"cookie\": \"$COOKIE\"}"
```

---

## 🚀 Implementation: Option 2 (VPS Setup)

### VPS Requirements:

**Minimum Specs:**
- **CPU:** 1 vCPU (2 recommended)
- **RAM:** 1GB (2GB recommended)
- **Storage:** 20GB SSD
- **OS:** Ubuntu 22.04 LTS
- **Network:** 1TB bandwidth/month (enough for thousands of requests)

**Recommended:** 2GB RAM, 2 vCPU for better performance (~$12/month)

### Setup Steps:

#### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3 python3-pip python3-venv git nginx -y

# Install Playwright dependencies
sudo apt install -y \
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
    libasound2
```

#### 2. Set Up Application

```bash
# Create app directory
mkdir -p /opt/ieee-validator
cd /opt/ieee-validator

# Clone or upload your code
git clone <your-repo> .

# Create virtual environment
python3 -venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
playwright install chromium

# Install Playwright system dependencies
playwright install-deps chromium
```

#### 3. Create Background Service

Create `/etc/systemd/system/ieee-cookie-refresher.service`:

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
ExecStart=/opt/ieee-validator/venv/bin/python /opt/ieee-validator/cookie_refresher.py
Restart=always
RestartSec=60

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable ieee-cookie-refresher
sudo systemctl start ieee-cookie-refresher
sudo systemctl status ieee-cookie-refresher
```

#### 4. Create API Server (Flask)

Install Flask:
```bash
pip install flask flask-cors gunicorn
```

Create `api_server.py`:

```python
from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/cookie', methods=['GET'])
def get_cookie():
    try:
        with open('/opt/ieee-validator/ieee_cookie.txt', 'r') as f:
            cookie = f.read().strip()
        return jsonify({'cookie': cookie})
    except FileNotFoundError:
        return jsonify({'error': 'Cookie not available'}), 503

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

Run with Gunicorn:
```bash
gunicorn -w 2 -b 0.0.0.0:5000 api_server:app
```

Or create systemd service for API server too.

#### 5. Set Up Nginx (Reverse Proxy)

Create `/etc/nginx/sites-available/ieee-validator`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/ieee-validator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Update Next.js to Use VPS API

Modify `app/api/validate/route.ts`:

```typescript
// Fetch cookie from VPS API
const cookieResponse = await fetch('http://your-vps-ip:5000/api/cookie');
const { cookie: storedCookie } = await cookieResponse.json();
```

**Security:** Use HTTPS and API keys for production!

---

## 💰 Cost Comparison

| Option | Monthly Cost | Complexity | Best For |
|--------|-------------|------------|----------|
| **Option 1: Serverless + KV** | **FREE - $5** | Low | Most users |
| **Option 2: VPS** | $5 - $15 | Medium | Full control needed |
| **Option 3: Hybrid** | $5 - $10 | Medium | Production apps |

---

## 🎯 Recommendation

**Start with Option 1 (Serverless + Vercel KV)** because:
1. ✅ FREE tier covers most use cases
2. ✅ No server management
3. ✅ Auto-scales
4. ✅ Fast global CDN
5. ✅ Easy to set up (1-2 hours)

**Move to Option 2 (VPS) if:**
- You need more control
- You have high traffic (>10k validations/day)
- You want to run other services on same server

---

## 📝 Next Steps

1. **Choose your option** (recommend Option 1)
2. **I'll help implement** the chosen solution
3. **Test thoroughly** before going live
4. **Monitor** cookie refresh status

Would you like me to implement Option 1 (Serverless) for you? It's the quickest path to a live, always-available validator!

