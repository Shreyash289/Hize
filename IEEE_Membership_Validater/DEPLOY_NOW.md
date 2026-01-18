# 🚀 Deploy Now - Step by Step

## Your VPS: 65.20.84.46

### Method 1: Quick Deploy (Using rsync/ssh)

**Step 1: Upload files to VPS**

```bash
cd "/Users/mrstark/Desktop/Code PlayGround/IEEE/Hize/IEEE_Membership_Validater"

# Upload files (you'll be prompted for password)
rsync -avz --progress \
  --exclude 'venv' \
  --exclude '__pycache__' \
  --exclude '*.pyc' \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude 'web-app/node_modules' \
  --exclude '*.log' \
  -e "ssh" \
  ./ root@65.20.84.46:/tmp/ieee-validator/
```

**Step 2: SSH into VPS and run setup**

```bash
ssh root@65.20.84.46

# Once connected, run:
cd /tmp/ieee-validator
chmod +x vps_setup.sh
chmod +x test_vps_api.sh
sudo ./vps_setup.sh
```

**Step 3: Configure IEEE credentials**

```bash
sudo systemctl edit ieee-cookie-refresher
```

Add these lines (replace with your actual IEEE credentials):
```ini
[Service]
Environment="IEEE_USERNAME=your-ieee-email@example.com"
Environment="IEEE_PASSWORD=your-ieee-password"
```

Save: Press `Ctrl+X`, then `Y`, then `Enter`

**Step 4: Start services**

```bash
sudo systemctl daemon-reload
sudo systemctl start ieee-cookie-refresher
sudo systemctl start ieee-api-server
sudo systemctl enable ieee-cookie-refresher
sudo systemctl enable ieee-api-server
```

**Step 5: Test**

```bash
# Wait 30 seconds for services to start, then:
curl http://localhost:5000/health
curl http://localhost:5000/api/cookie/status

# Wait 1-2 minutes for first cookie refresh, then:
curl http://localhost:5000/api/cookie
```

---

### Method 2: All-in-One Script

Create a file `quick_deploy.sh`:

```bash
#!/bin/bash
VPS_IP="65.20.84.46"
VPS_USER="root"

echo "Uploading files..."
rsync -avz --progress \
  --exclude 'venv' --exclude '__pycache__' --exclude '*.pyc' \
  --exclude '.git' --exclude 'node_modules' \
  -e "ssh" \
  ./ $VPS_USER@$VPS_IP:/tmp/ieee-validator/

echo "Running setup on VPS..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
cd /tmp/ieee-validator
chmod +x vps_setup.sh
sudo ./vps_setup.sh
ENDSSH

echo "Done! Now SSH to configure credentials:"
echo "ssh $VPS_USER@$VPS_IP"
```

Then run:
```bash
chmod +x quick_deploy.sh
./quick_deploy.sh
```

---

## ⚡ After Deployment

### 1. Configure Vercel Environment Variables

Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Add:
- **Key:** `VPS_API_URL`
- **Value:** `http://65.20.84.46:5000`
- **Environment:** Production, Preview, Development (select all)

**Optional (if you set API key):**
- **Key:** `VPS_API_KEY`
- **Value:** `your-api-key-here`

### 2. Redeploy Next.js App

```bash
cd web-app
git add .
git commit -m "Configure VPS API"
git push
```

Or trigger redeploy from Vercel dashboard.

---

## ✅ Verify Everything Works

1. **Check VPS services are running:**
   ```bash
   ssh root@65.20.84.46
   sudo systemctl status ieee-cookie-refresher
   sudo systemctl status ieee-api-server
   ```

2. **Test API from your local machine:**
   ```bash
   curl http://65.20.84.46:5000/health
   ```

3. **Test from Next.js app:**
   - Visit your Vercel deployment
   - Try validating a membership number
   - Should work instantly!

---

## 🔥 Quick Commands Cheat Sheet

```bash
# SSH into VPS
ssh root@65.20.84.46

# Check service status
sudo systemctl status ieee-cookie-refresher
sudo systemctl status ieee-api-server

# View logs
sudo journalctl -u ieee-cookie-refresher -f
sudo journalctl -u ieee-api-server -f

# Restart services
sudo systemctl restart ieee-cookie-refresher
sudo systemctl restart ieee-api-server

# Test API
curl http://localhost:5000/health
curl http://localhost:5000/api/cookie

# Check cookie file
cat /opt/ieee-validator/ieee_cookie.txt
```

---

## 🆘 Need Help?

1. **Can't connect to VPS?**
   - Verify IP: `65.20.84.46`
   - Check if SSH port 22 is open
   - Verify credentials

2. **Services not starting?**
   - Check logs: `sudo journalctl -u ieee-cookie-refresher -n 100`
   - Verify credentials are set correctly
   - Check if port 5000 is available

3. **Cookie not refreshing?**
   - Test manually: `cd /opt/ieee-validator && source venv/bin/activate && python ieee_login.py`
   - Check IEEE credentials in systemd service

---

**Ready to deploy? Run the commands above!** 🚀

