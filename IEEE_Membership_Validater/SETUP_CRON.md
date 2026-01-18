# Automatic Cookie Refresh Setup (Cron Job)

## Quick Answer

**Yes, you need to keep your Mac ON** for automatic cookie refresh to work.

## Setup Instructions

### Step 1: Test the script manually

```bash
cd "/Users/mrstark/Desktop/Code PlayGround/IEEE_Membership_Validater"
./refresh_cookie_cron.sh
```

This should refresh your cookie. Check `cookie_refresh.log` for results.

### Step 2: Set up cron job

1. Open Terminal
2. Run: `crontab -e`
3. Add this line (refreshes every 6 hours):

```
0 */6 * * * /Users/mrstark/Desktop/Code\ PlayGround/IEEE_Membership_Validater/refresh_cookie_cron.sh
```

4. Save and exit (press `Esc`, then type `:wq` if using vim, or `Ctrl+X` then `Y` if using nano)

### Step 3: Verify cron is working

```bash
# Check if cron job is scheduled
crontab -l

# Check logs after waiting a bit
tail -f cookie_refresh.log
```

## Important Notes

⚠️ **Mac must be ON**: Cron jobs only run when your Mac is awake
- If Mac sleeps, cron pauses
- If Mac is off, cron doesn't run
- Mac can sleep between cron runs (it will wake for cron)

## Alternative: Keep Script Running (No Cron)

If you want it to run continuously without cron:

```bash
cd "/Users/mrstark/Desktop/Code PlayGround/IEEE_Membership_Validater"
source venv/bin/activate
export IEEE_USERNAME="ha1487@srmist.edu.in"
export IEEE_PASSWORD="Harsh@954"
python cookie_refresher.py
```

**This requires:**
- Mac must stay ON
- Terminal window must stay open
- Script runs continuously

## Best Option: Cloud Server (Mac Can Be Off)

For true 24/7 automation without keeping Mac on:
- Use a VPS (DigitalOcean, AWS, etc.) - costs ~$5/month
- Or use a Raspberry Pi at home
- Or use GitHub Actions (free, but limited)

## Current Status

- ✅ Web app: Free on Vercel, runs automatically
- ⚠️ Cookie refresh: Needs Mac ON or cloud server

