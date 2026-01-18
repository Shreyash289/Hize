# VPS Setup Instructions - Quick Commands

## Your VPS Details
- **IP Address:** 65.20.84.46
- **Setup Status:** Ready to deploy

---

## 🚀 Quick Deployment (Choose One Method)

### Method 1: Automated Script (Easiest)

From your local machine, in the `IEEE_Membership_Validater` directory:

```bash
./deploy_to_vps.sh
```

This will:
1. Upload all files to VPS
2. Run the setup script
3. Guide you through configuration

---

### Method 2: Manual Upload

**Step 1: Upload files**

```bash
# From IEEE_Membership_Validater directory
rsync -avz --exclude 'venv' --exclude '__pycache__' --exclude '*.pyc' \
  --exclude '.git' --exclude 'node_modules' \
  -e "ssh" \
  ./ root@65.20.84.46:/tmp/ieee-validator/
```

**Step 2: SSH into VPS**

```bash
ssh root@65.20.84.46
```

**Step 3: Run setup**

```bash
cd /tmp/ieee-validator
chmod +x vps_setup.sh
sudo ./vps_setup.sh
```

---

## ⚙️ Configure Credentials

After setup, configure your IEEE credentials:

```bash
# SSH into VPS if not already
ssh root@65.20.84.46

# Edit cookie refresher service
sudo systemctl edit ieee-cookie-refresher
```

Add these lines:
```ini
[Service]
Environment="IEEE_USERNAME=your-ieee-email@example.com"
Environment="IEEE_PASSWORD=your-ieee-password"
```

Save: `Ctrl+X`, then `Y`, then `Enter`

**Optional: Add API key for security**

```bash
sudo systemctl edit ieee-api-server
```

Add:
```ini
[Service]
Environment="API_KEY=your-strong-random-key-here"
```

---

## ▶️ Start Services

```bash
# Start services
sudo systemctl start ieee-cookie-refresher
sudo systemctl start ieee-api-server

# Enable auto-start on boot
sudo systemctl enable ieee-cookie-refresher
sudo systemctl enable ieee-api-server

# Check status
sudo systemctl status ieee-cookie-refresher
sudo systemctl status ieee-api-server
```

---

## ✅ Test Everything

```bash
# Health check
curl http://localhost:5000/health

# Check cookie status
curl http://localhost:5000/api/cookie/status

# Get cookie (wait a minute for first refresh)
curl http://localhost:5000/api/cookie

# Or use the test script
cd /opt/ieee-validator
./test_vps_api.sh http://localhost:5000
```

---

## 🌐 Configure Vercel

In **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

1. **Add `VPS_API_URL`:**
   - Value: `http://65.20.84.46:5000`
   - (Or `https://your-domain.com` if you set up Nginx with SSL)

2. **Add `VPS_API_KEY` (if you set one):**
   - Value: `your-strong-random-key-here`

3. **Redeploy your app**

---

## 🔥 Quick Commands Reference

```bash
# View logs
sudo journalctl -u ieee-cookie-refresher -f
sudo journalctl -u ieee-api-server -f

# Restart services
sudo systemctl restart ieee-cookie-refresher
sudo systemctl restart ieee-api-server

# Check if services are running
sudo systemctl status ieee-cookie-refresher
sudo systemctl status ieee-api-server

# View application logs
tail -f /opt/ieee-validator/cookie_refresh.log

# Test API from outside VPS
curl http://65.20.84.46:5000/health
```

---

## 🔒 Security Setup (Recommended)

### 1. Set up Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP (for future Nginx)
sudo ufw allow 443/tcp  # HTTPS (for future SSL)
sudo ufw allow 5000/tcp # API (or restrict to Vercel IPs only)
sudo ufw enable
```

### 2. Use API Key (Already mentioned above)

Set `API_KEY` in systemd service and Vercel environment variables.

### 3. Set up Nginx + SSL (Optional but Recommended)

See `VPS_SETUP.md` for detailed Nginx configuration.

---

## 🆘 Troubleshooting

### Service won't start?

```bash
# Check status
sudo systemctl status ieee-cookie-refresher

# View recent logs
sudo journalctl -u ieee-cookie-refresher -n 100

# Check if cookie file is being created
ls -la /opt/ieee-validator/ieee_cookie.txt
```

### Cookie not refreshing?

```bash
# Test login manually
cd /opt/ieee-validator
source venv/bin/activate
export IEEE_USERNAME="your-email"
export IEEE_PASSWORD="your-password"
python ieee_login.py

# Check if credentials are set
sudo systemctl show ieee-cookie-refresher | grep Environment
```

### API not accessible from outside?

```bash
# Check if port is open
sudo netstat -tlnp | grep 5000

# Check firewall
sudo ufw status

# Test locally first
curl http://localhost:5000/health
```

### Port 5000 already in use?

```bash
# Check what's using it
sudo lsof -i :5000

# Change port in service file
sudo systemctl edit ieee-api-server
# Add: Environment="PORT=5001"
# Then update VPS_API_URL in Vercel
```

---

## ✅ Success Checklist

- [ ] Files uploaded to VPS
- [ ] Setup script completed successfully
- [ ] IEEE credentials configured in systemd
- [ ] Services started and enabled
- [ ] Health check returns `{"status":"ok"}`
- [ ] Cookie endpoint returns a cookie
- [ ] Cookie file exists: `/opt/ieee-validator/ieee_cookie.txt`
- [ ] Logs show successful cookie refresh
- [ ] VPS_API_URL set in Vercel
- [ ] Next.js app can validate memberships

---

## 🎉 You're Done!

Once all checkboxes are ✅, your validator will be:
- ✅ Always available (no waiting)
- ✅ Auto-refreshing cookies every 4 hours
- ✅ Ready for production use

Test it by visiting your Vercel deployment and validating a membership number!

