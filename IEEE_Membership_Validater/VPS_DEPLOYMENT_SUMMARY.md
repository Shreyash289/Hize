# VPS Deployment - Complete Package Summary

## 📦 What You Got

I've created a complete VPS deployment package that makes your IEEE validator **always available** without waiting for cookie refresh.

### New Files Created:

1. **`api_server.py`** - Flask API server that serves fresh cookies
   - Endpoints: `/api/cookie`, `/api/cookie/status`, `/health`
   - Runs on port 5000
   - Optional API key authentication

2. **`cookie_refresher_service.py`** - Improved cookie refresh service
   - Runs continuously in background
   - Refreshes every 4 hours automatically
   - Better error handling and retries
   - Comprehensive logging

3. **`vps_setup.sh`** - Automated setup script
   - Installs all dependencies
   - Sets up systemd services
   - Configures everything automatically

4. **`VPS_SETUP.md`** - Complete deployment guide
   - Step-by-step instructions
   - Manual setup alternative
   - Nginx + SSL configuration
   - Troubleshooting guide

5. **`QUICK_START_VPS.md`** - 5-minute quick start guide

### Modified Files:

1. **`requirements.txt`** - Added Flask, Flask-CORS, Gunicorn
2. **`web-app/app/api/validate/route.ts`** - Updated to fetch cookie from VPS API

---

## 🎯 How It Works

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Next.js App    │────▶│  VPS API Server  │
│   (Vercel)      │     │   Port 5000      │
└─────────────────┘     └────────┬─────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Cookie File           │
                    │  (Refreshed every 4h)  │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Cookie Refresher      │
                    │  (systemd service)     │
                    └────────────────────────┘
```

**Flow:**
1. User visits your Next.js app (on Vercel)
2. User enters membership numbers and clicks validate
3. Next.js API fetches fresh cookie from VPS API (`http://your-vps:5000/api/cookie`)
4. Validation happens instantly with fresh cookie
5. Background service on VPS refreshes cookie every 4 hours automatically

---

## 🚀 Quick Deployment Steps

### On Your VPS:

```bash
# 1. Upload files
scp -r IEEE_Membership_Validater/* user@vps:/tmp/ieee-validator/

# 2. SSH into VPS
ssh user@vps

# 3. Run setup
cd /tmp/ieee-validator
chmod +x vps_setup.sh
sudo ./vps_setup.sh

# 4. Configure credentials
sudo systemctl edit ieee-cookie-refresher
# Add: Environment="IEEE_USERNAME=your-email"
# Add: Environment="IEEE_PASSWORD=your-password"

# 5. Start services
sudo systemctl start ieee-cookie-refresher
sudo systemctl start ieee-api-server
sudo systemctl enable ieee-cookie-refresher
sudo systemctl enable ieee-api-server

# 6. Test
curl http://localhost:5000/health
curl http://localhost:5000/api/cookie
```

### In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add:
   - `VPS_API_URL`: `http://your-vps-ip:5000` (or `https://your-domain.com` if using Nginx)
   - `VPS_API_KEY`: (optional) Your API key if you set one

3. Redeploy your app

---

## ✅ Benefits

- ✅ **Zero wait time** - Cookie always fresh and available
- ✅ **Automatic refresh** - No manual intervention needed
- ✅ **High availability** - Services auto-restart if they crash
- ✅ **Secure** - Optional API key protection
- ✅ **Scalable** - Can handle thousands of requests
- ✅ **Monitored** - Comprehensive logging

---

## 🔧 System Requirements

**Minimum VPS Specs:**
- 1GB RAM
- 1 vCPU
- 20GB storage
- Ubuntu 20.04+ or Debian 11+

**Recommended:**
- 2GB RAM
- 2 vCPU
- 40GB storage

**Cost:** $5-12/month (DigitalOcean, Hetzner, Vultr, etc.)

---

## 📊 Service Architecture

### Services Running:

1. **ieee-cookie-refresher.service**
   - Refreshes cookie every 4 hours
   - Writes to `/opt/ieee-validator/ieee_cookie.txt`
   - Logs to `/opt/ieee-validator/cookie_refresh.log`

2. **ieee-api-server.service**
   - Serves cookie via HTTP API
   - Runs on port 5000
   - Uses Gunicorn (2 workers)
   - Auto-restarts on failure

---

## 🔒 Security Recommendations

1. **Use API Key:**
   ```bash
   sudo systemctl edit ieee-api-server
   # Add: Environment="API_KEY=your-strong-random-key"
   ```
   
   Then in Vercel: `VPS_API_KEY=your-strong-random-key`

2. **Use Nginx + SSL:**
   - Set up Nginx reverse proxy
   - Get SSL certificate (Let's Encrypt)
   - Use HTTPS in `VPS_API_URL`

3. **Firewall:**
   ```bash
   sudo ufw allow 22/tcp   # SSH
   sudo ufw allow 80/tcp   # HTTP (for Let's Encrypt)
   sudo ufw allow 443/tcp  # HTTPS
   sudo ufw allow 5000/tcp # API (or only allow from Vercel IPs)
   sudo ufw enable
   ```

4. **Restrict API Access:**
   - Use Vercel IP allowlist in Nginx
   - Or use Cloudflare/AWS WAF

---

## 🐛 Troubleshooting

### Service not starting:
```bash
sudo systemctl status ieee-cookie-refresher
sudo journalctl -u ieee-cookie-refresher -n 100
```

### Cookie not refreshing:
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

### API not responding:
```bash
curl -v http://localhost:5000/health
sudo systemctl restart ieee-api-server
sudo journalctl -u ieee-api-server -f
```

### Next.js can't reach VPS:
- Check VPS firewall allows port 5000
- Verify `VPS_API_URL` is correct in Vercel
- Check VPS IP hasn't changed
- Test from command line: `curl http://your-vps-ip:5000/health`

---

## 📈 Monitoring

### Check Service Health:
```bash
# Status
sudo systemctl status ieee-cookie-refresher ieee-api-server

# Logs (real-time)
sudo journalctl -u ieee-cookie-refresher -f
sudo journalctl -u ieee-api-server -f

# Application logs
tail -f /opt/ieee-validator/cookie_refresh.log
```

### Monitor API:
```bash
# Health endpoint
curl http://localhost:5000/health

# Cookie status
curl http://localhost:5000/api/cookie/status

# Get cookie
curl http://localhost:5000/api/cookie
```

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Services show as "active (running)"
2. ✅ `curl http://localhost:5000/health` returns `{"status":"ok"}`
3. ✅ `curl http://localhost:5000/api/cookie` returns a cookie
4. ✅ `/opt/ieee-validator/ieee_cookie.txt` exists and has content
5. ✅ Logs show successful cookie refresh every 4 hours
6. ✅ Next.js app validates memberships instantly without errors

---

## 📞 Next Steps

1. **Deploy to VPS** using `QUICK_START_VPS.md`
2. **Configure Vercel** environment variables
3. **Test end-to-end** - validate a membership number
4. **Set up monitoring** - add alerts if needed
5. **Optional:** Set up Nginx + SSL for production

---

## 📚 Documentation Files

- `QUICK_START_VPS.md` - 5-minute quick start
- `VPS_SETUP.md` - Complete detailed guide
- `DEPLOYMENT_GUIDE.md` - Comparison of all deployment options
- `README.md` - Original project documentation

---

**You're all set!** 🚀

Your validator will now be **always available** with zero wait time for users!

