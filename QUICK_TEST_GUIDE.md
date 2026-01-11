# 🚀 Quick Local Testing Guide

## ✅ Setup Complete!

- ✓ `.env.local` file created with `VPS_API_URL=http://65.20.84.46:5001`
- ✓ API route created at `src/app/api/validate-ieee/route.ts`
- ✓ RegistrationPopup component updated with validation

## 🔄 Restart Dev Server (IMPORTANT!)

The dev server needs to be restarted to pick up the new API route:

1. **Stop the current server** (if running):
   - Press `Ctrl+C` in the terminal where `npm run dev` is running

2. **Start it again**:
   ```bash
   cd "/Users/mrstark/Desktop/Code PlayGround/IEEE/Hize"
   npm run dev
   ```

3. **Wait for "Ready" message** (10-20 seconds)

## 🧪 Test It!

### Test 1: API Route (Terminal)
```bash
curl -X POST http://localhost:3000/api/validate-ieee \
  -H "Content-Type: application/json" \
  -d '{"memberId": "99634594"}'
```

Expected response:
```json
{
  "isValid": true,
  "membershipStatus": "Active",
  "nameInitials": "K. G.",
  "memberId": "99634594"
}
```

### Test 2: In Browser

1. **Open:** http://localhost:3000
2. **Wait for registration modal** (appears automatically after 4 seconds, or scroll to find it)
3. **Enter IEEE number:** Type `99634594` in the IEEE Member Number field
4. **Watch validation:**
   - ⏳ Loading spinner appears (1 second delay)
   - ✅ Green checkmark if valid
   - ❌ Red X if invalid
   - Name initials displayed if valid

## 🎯 What to Look For

### Success Indicators:
- ✅ API route responds with JSON
- ✅ Registration modal shows IEEE input field
- ✅ Entering number triggers validation
- ✅ Loading spinner appears
- ✅ Validation result shows (✓ or ✗)
- ✅ IEEE toggle automatically turns ON if valid
- ✅ Price updates based on validation

### If Something's Wrong:

**API route not found?**
- Make sure you restarted the dev server
- Check route exists: `ls src/app/api/validate-ieee/route.ts`

**Environment variable not working?**
- Verify `.env.local` exists: `cat .env.local`
- Restart dev server after creating/editing `.env.local`

**VPS API error?**
- Test VPS: `curl http://65.20.84.46:5001/health`
- Should return: `{"status":"ok","cookie_available":true,...}`

**Validation always fails?**
- Open browser console (F12) to see errors
- Check Network tab for API request/response

## 🎉 You're Ready!

Once the dev server restarts, everything should work. The integration is complete and ready to test!

---

**Quick Command:**
```bash
# Stop server (Ctrl+C), then:
cd "/Users/mrstark/Desktop/Code PlayGround/IEEE/Hize" && npm run dev
```

Then open http://localhost:3000 and test the registration modal! 🚀

