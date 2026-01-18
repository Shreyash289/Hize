# Testing IEEE Validation Integration

## 🧪 Current Status

**Port 5000:** Responding (but different service - Node.js)
**Port 5001:** Not responding (our API server needs to be started/configured)

## ✅ Quick Test Commands

### Test 1: Check VPS API Status (SSH Required)

```bash
ssh root@65.20.84.46

# Check if API server is running
sudo systemctl status ieee-api-server

# Check what port it's configured for
cat /etc/systemd/system/ieee-api-server.service.d/override.conf

# Check what's running on each port
sudo lsof -i :5000
sudo lsof -i :5001

# If API server isn't running, start it
sudo systemctl start ieee-api-server
sudo systemctl restart ieee-api-server
```

### Test 2: Test VPS API from Local Machine

```bash
# Test port 5000 (may be different service)
curl http://65.20.84.46:5000/health
curl http://65.20.84.46:5000/api/cookie/status

# Test port 5001 (our API)
curl http://65.20.84.46:5001/health
curl http://65.20.84.46:5001/api/cookie
```

### Test 3: Test Next.js API Route Locally

First, make sure you have environment variables set:

```bash
# In your .env.local file (root of project)
VPS_API_URL=http://65.20.84.46:5001
# VPS_API_KEY=your-key-if-set
```

Then start Next.js dev server:

```bash
cd /Users/mrstark/Desktop/Code\ PlayGround/IEEE/Hize
npm run dev
```

In another terminal, test the API:

```bash
curl -X POST http://localhost:3000/api/validate-ieee \
  -H "Content-Type: application/json" \
  -d '{"memberId": "99634594"}'
```

### Test 4: Test in Browser

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Wait for registration modal to appear (or trigger it)
4. Enter IEEE member number: `99634594`
5. Watch for validation status

### Test 5: Test Complete Flow (Manual)

```bash
# Step 1: Get cookie from VPS
COOKIE=$(curl -s http://65.20.84.46:5001/api/cookie | grep -o '"cookie":"[^"]*' | cut -d'"' -f4)

# Step 2: Validate with IEEE (if cookie retrieved)
if [ -n "$COOKIE" ]; then
  curl -X POST "https://services24.ieee.org/membership-validator.html" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "Cookie: PA.Global_Websession=$COOKIE" \
    -d "customerId=99634594" \
    | grep -i "membership status"
fi
```

## 🔧 Fix Port 5001 Issue

If port 5001 isn't working, on VPS:

```bash
# Check if service exists
sudo systemctl list-units | grep ieee-api

# Check service status
sudo systemctl status ieee-api-server

# Check logs
sudo journalctl -u ieee-api-server -n 50

# Restart service
sudo systemctl restart ieee-api-server

# If port conflict, check what's using port 5001
sudo lsof -i :5001

# If needed, reconfigure to use port 5002
sudo mkdir -p /etc/systemd/system/ieee-api-server.service.d
sudo bash -c 'cat > /etc/systemd/system/ieee-api-server.service.d/override.conf << EOF
[Service]
Environment="PORT=5002"
ExecStart=
ExecStart=/opt/ieee-validator/venv/bin/gunicorn -w 2 -b 0.0.0.0:5002 --timeout 120 api_server:app
EOF'
sudo systemctl daemon-reload
sudo systemctl restart ieee-api-server
```

## ✅ Expected Test Results

### VPS API Health Check:
```json
{
  "status": "ok",
  "cookie_available": true,
  "timestamp": "2026-01-10T..."
}
```

### VPS API Cookie:
```json
{
  "cookie": "eyJ6aXAiOiJERUYiLCJhbGc...",
  "timestamp": "2026-01-10T..."
}
```

### Next.js API Validate:
```json
{
  "isValid": true,
  "membershipStatus": "Active",
  "nameInitials": "K. G.",
  "memberId": "99634594"
}
```

## 🐛 Troubleshooting

**Port 5001 not responding?**
- Check firewall: `sudo ufw status`
- Allow port: `sudo ufw allow 5001/tcp`
- Check if service is running: `sudo systemctl status ieee-api-server`

**Cookie not available?**
- Wait 1-2 minutes for first refresh
- Check cookie refresh service: `sudo journalctl -u ieee-cookie-refresher -n 50`
- Test manually: `cd /opt/ieee-validator && python ieee_login.py`

**Next.js API not working?**
- Check environment variables are set
- Check VPS_API_URL is correct
- Check Vercel environment variables if deployed

## 📝 Next Steps

1. **Fix VPS API port 5001** - Ensure service is running
2. **Test locally** - Use `npm run dev` and test registration modal
3. **Deploy to Vercel** - Set environment variables and test
4. **Monitor** - Check logs if issues occur

