# VPS API Server - Verify and Fix

## 🔍 Quick Diagnostic (Run on VPS)

```bash
# 1. Check service status
sudo systemctl status ieee-api-server --no-pager -l

# 2. Check recent errors
sudo journalctl -u ieee-api-server -n 50 --no-pager

# 3. Check for syntax errors
cd /opt/ieee-validator
python3 -m py_compile api_server.py

# 4. Check if endpoint exists
grep -n "validate-member" /opt/ieee-validator/api_server.py

# 5. Check what port it's trying to bind to
grep -n "PORT\|port\|5001\|5000" /opt/ieee-validator/api_server.py
grep -n "0.0.0.0" /etc/systemd/system/ieee-api-server.service.d/override.conf
```

## 🛠️ Quick Fix

If the endpoint is missing, add it. The file should have:

1. `/api/cookie` endpoint (GET)
2. `/api/cookie/status` endpoint (GET)  
3. **`/api/validate-member` endpoint (POST)** ← This might be missing

Add the endpoint code (see ADD_ENDPOINT_TO_VPS.txt for the exact code).

## 🔄 Restart Process

```bash
# Restart service
sudo systemctl daemon-reload
sudo systemctl restart ieee-api-server

# Wait a moment
sleep 3

# Check if it started
sudo systemctl status ieee-api-server

# Test
curl http://localhost:5001/health
curl -X POST http://localhost:5001/api/validate-member \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}'
```

## ✅ Expected Result

After fix, you should see:
- Service status: `active (running)`
- Health check: `{"status":"ok",...}`
- Validate endpoint: Returns JSON with validation result

