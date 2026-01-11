# Update VPS API with Validation Endpoint

## Quick Update Steps

### On Your Local Machine:

1. **Upload updated api_server.py to VPS:**
```bash
scp "/Users/mrstark/Desktop/Code PlayGround/IEEE/Hize/IEEE_Membership_Validater/api_server.py" root@65.20.84.46:/opt/ieee-validator/api_server.py
```

### On VPS (SSH):

```bash
# Restart the API server
sudo systemctl restart ieee-api-server

# Wait a moment
sleep 2

# Check status
sudo systemctl status ieee-api-server

# Test the new endpoint
curl -X POST http://localhost:5001/api/validate-member \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}'
```

## What Changed

1. **Added `/api/validate-member` endpoint** to VPS API
   - Uses the working Python `IEEEMembershipValidator` class
   - Handles validation server-side (more secure)
   - Returns JSON with validation results

2. **Updated Next.js route** to call VPS endpoint instead of IEEE directly
   - More reliable (uses proven working code)
   - Better error handling
   - Centralized validation logic

## Benefits

- ✅ Uses proven working Python validator code
- ✅ Cookie handling stays on VPS (secure)
- ✅ Better error messages
- ✅ No direct IEEE calls from Next.js

## After Update

Once VPS is updated and restarted:
1. Test VPS endpoint: `curl -X POST http://65.20.84.46:5001/api/validate-member -H "Content-Type: application/json" -d '{"memberId":"99634594"}'`
2. Test Next.js API: `curl -X POST http://localhost:3002/api/validate-ieee -H "Content-Type: application/json" -d '{"memberId":"99634594"}'`
3. Test in browser: http://localhost:3002

