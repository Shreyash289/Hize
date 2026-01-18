# Local Development Testing Setup

## 🚀 Quick Start

### Step 1: Create Environment File

Create `.env.local` in the root directory (same level as `package.json`):

```bash
# Create the file
cat > .env.local << 'EOF'
VPS_API_URL=http://65.20.84.46:5001
# VPS_API_KEY=your-api-key-if-set
EOF
```

Or manually create `.env.local` with:
```
VPS_API_URL=http://65.20.84.46:5001
```

### Step 2: Start Dev Server

```bash
cd "/Users/mrstark/Desktop/Code PlayGround/IEEE/Hize"
npm run dev
```

### Step 3: Test in Browser

1. Open http://localhost:3000
2. Wait for registration modal to appear (or scroll to find registration button)
3. Click on "IEEE Member" section
4. Enter IEEE member number (e.g., `99634594`)
5. Wait 1 second - validation should start automatically
6. You should see:
   - ⏳ Loading spinner
   - ✅ Green checkmark if valid
   - ❌ Red X if invalid

### Step 4: Test API Route Directly

In another terminal:

```bash
# Test the API endpoint
curl -X POST http://localhost:3000/api/validate-ieee \
  -H "Content-Type: application/json" \
  -d '{"memberId": "99634594"}' | jq '.'

# Or without jq:
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

## 🧪 Testing Checklist

- [ ] `.env.local` file created with `VPS_API_URL=http://65.20.84.46:5001`
- [ ] Dev server started: `npm run dev`
- [ ] Browser opens: http://localhost:3000
- [ ] Registration modal appears
- [ ] Enter IEEE number triggers validation
- [ ] Loading spinner appears
- [ ] Validation result shows (✓ or ✗)
- [ ] API route works: `curl http://localhost:3000/api/validate-ieee`

## 🐛 Troubleshooting

### API Route Not Found?

Make sure the route file exists:
```bash
ls -la src/app/api/validate-ieee/route.ts
```

If missing, check that it was created correctly.

### Environment Variable Not Working?

Next.js requires server restart after adding `.env.local`:
```bash
# Stop dev server (Ctrl+C)
# Start again
npm run dev
```

### VPS API Not Responding?

Test VPS directly:
```bash
curl http://65.20.84.46:5001/health
```

Should return:
```json
{"status":"ok","cookie_available":true,"timestamp":"..."}
```

### Validation Always Fails?

Check browser console (F12) for errors. Common issues:
- VPS API timeout
- Cookie expired
- Network error

## 📝 Quick Test Script

Run this to test everything:

```bash
# 1. Test VPS API
echo "Testing VPS API..."
curl -s http://65.20.84.46:5001/health | grep -q "ok" && echo "✓ VPS API OK" || echo "✗ VPS API failed"

# 2. Test local API (requires dev server running)
echo "Testing Local API..."
curl -s -X POST http://localhost:3000/api/validate-ieee \
  -H "Content-Type: application/json" \
  -d '{"memberId":"99634594"}' | grep -q "isValid" && echo "✓ Local API OK" || echo "✗ Local API failed (start dev server?)"
```

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Dev server starts without errors
2. ✅ Browser shows registration modal
3. ✅ Entering IEEE number shows loading spinner
4. ✅ Validation completes and shows result
5. ✅ Toggle automatically turns ON if valid
6. ✅ Price updates based on validation

---

**Ready to test!** Run `npm run dev` and open http://localhost:3000

