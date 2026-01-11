# Quick Start - VPS Deployment (5 Minutes)

## 🚀 Fastest Setup Path

### Step 1: Upload Files to VPS

```bash
# From your local machine, in IEEE_Membership_Validater directory:
rsync -avz --exclude 'venv' --exclude '__pycache__' --exclude '*.pyc' \
  . user@your-vps-ip:/tmp/ieee-validator/
```

Or use Git:
```bash
# On VPS
cd /tmp && git clone <your-repo> ieee-validator && cd ieee-validator
```

### Step 2: Run Automated Setup

```bash
cd /tmp/ieee-validator
chmod +x vps_setup.sh
sudo ./vps_setup.sh
```

### Step 3: Configure Credentials

```bash
# Edit services to add credentials
sudo systemctl edit ieee-cookie-refresher
```

Add:
```ini
[Service]
Environment="IEEE_USERNAME=your-email@example.com"
Environment="IEEE_PASSWORD=your-password"
```

(Optional) Add API key for security:
```bash
sudo systemctl edit ieee-api-server
```

Add:
```ini
[Service]
Environment="API_KEY=your-secret-key-here"
```

### Step 4: Start Services

```bash
sudo systemctl start ieee-cookie-refresher
sudo systemctl start ieee-api-server
sudo systemctl enable ieee-cookie-refresher
sudo systemctl enable ieee-api-server
```

### Step 5: Test

```bash
# Check status
sudo systemctl status ieee-cookie-refresher
sudo systemctl status ieee-api-server

# Test API
curl http://localhost:5000/health
curl http://localhost:5000/api/cookie
```

### Step 6: Update Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

- `VPS_API_URL`: `http://your-vps-ip:5000` or `https://your-domain.com` (if using Nginx)
- `VPS_API_KEY`: (if you set one) `your-secret-key-here`

**Important:** Use HTTPS if you set up SSL, or keep HTTP if accessing via IP only.

### Step 7: Deploy Next.js App

```bash
cd web-app
git add .
git commit -m "Configure VPS cookie API"
git push
```

Vercel will auto-deploy. Your app will now fetch cookies from VPS automatically!

---

## 🔍 Verify Everything Works

1. **Check VPS services:**
   ```bash
   sudo systemctl status ieee-cookie-refresher ieee-api-server
   ```

2. **Check cookie file exists:**
   ```bash
   ls -la /opt/ieee-validator/ieee_cookie.txt
   cat /opt/ieee-validator/ieee_cookie.txt  # Should show cookie
   ```

3. **Check logs:**
   ```bash
   sudo journalctl -u ieee-cookie-refresher -n 50
   tail -n 50 /opt/ieee-validator/cookie_refresh.log
   ```

4. **Test from Next.js app:**
   - Visit your Vercel deployment
   - Try validating a membership number
   - Should work instantly without waiting!

---

## ⚡ What Happens Now

- ✅ Cookie refreshes automatically every 4 hours
- ✅ Cookie is always available via API at `/api/cookie`
- ✅ Next.js app fetches fresh cookie on every validation request
- ✅ No more waiting for users!
- ✅ Services auto-restart if they crash

---

## 🆘 Quick Troubleshooting

**Service won't start?**
```bash
sudo journalctl -u ieee-cookie-refresher -n 100
```

**Cookie not refreshing?**
```bash
# Check credentials
sudo systemctl show ieee-cookie-refresher | grep Environment

# Test manually
cd /opt/ieee-validator
source venv/bin/activate
export IEEE_USERNAME="your-email"
export IEEE_PASSWORD="your-password"
python ieee_login.py
```

**API not responding?**
```bash
curl -v http://localhost:5000/health
sudo systemctl restart ieee-api-server
```

---

## 📚 Full Documentation

See `VPS_SETUP.md` for detailed instructions, Nginx setup, SSL configuration, and advanced troubleshooting.

