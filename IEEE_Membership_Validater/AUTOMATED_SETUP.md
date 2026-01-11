# Automated Cookie Refresh Setup

This guide explains how to set up automated cookie refresh using Playwright.

## ⚠️ Important Notes

- **Fragile by nature**: This will work until IEEE changes login flow, adds CAPTCHA, or flags automation
- **Expect maintenance**: May break if IEEE updates their authentication system
- **Rate limiting**: Use responsibly - one account only, human-speed requests
- **CAPTCHA/MFA**: Will fail if IEEE adds CAPTCHA or MFA prompts

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
playwright install chromium
```

2. Set up credentials (choose one method):

**Method A: Environment Variables (Recommended)**
```bash
export IEEE_USERNAME="your_email@example.com"
export IEEE_PASSWORD="your_password"
```

**Method B: Interactive (prompts when running)**
```bash
python ieee_login.py
```

## Usage

### 1. Manual Cookie Refresh

Run the login script to refresh the cookie:
```bash
python ieee_login.py
```

This will:
- Log into IEEE.org using Playwright
- Extract the `PA.Global_Websession` cookie
- Save it to `ieee_cookie.txt`

### 2. Automatic Cookie Refresh (Loop)

Run the refresher script to automatically refresh cookies every 6 hours:
```bash
python cookie_refresher.py
```

This will:
- Refresh the cookie every 6 hours
- Optionally run the validator after each refresh (if enabled)

### 3. Cron Job (Recommended for Production)

Set up a cron job to refresh cookies automatically:

```bash
crontab -e
```

Add this line (adjust path as needed):
```
0 */6 * * * cd /path/to/IEEE_Membership_Validater && /usr/bin/python3 ieee_login.py >> cookie_refresh.log 2>&1
```

This refreshes the cookie every 6 hours.

### 4. Using with Validator

The validator script will automatically use `ieee_cookie.txt` if it exists:

```bash
python ieee_validator.py --input ieee_numbers.xlsx --output results.xlsx
```

If the cookie file doesn't exist, it will prompt you for the cookie.

## Troubleshooting

### CAPTCHA Detected
- The script will detect CAPTCHA and exit with an error
- You'll need to login manually and extract the cookie

### Login Fails
- Check your credentials
- Verify IEEE login page hasn't changed
- Check for MFA/2FA requirements

### Cookie Not Found
- Ensure login completed successfully
- Check browser console for errors
- Verify cookie name hasn't changed

### Session Expired Errors
- Cookie may have expired
- Run `python ieee_login.py` to refresh
- Check if IEEE changed their session timeout

## File Structure

```
.
├── ieee_login.py          # Playwright login script
├── cookie_refresher.py     # Auto-refresh supervisor
├── ieee_validator.py       # Main validator (reads cookie file)
├── ieee_cookie.txt         # Cookie storage (auto-generated)
└── requirements.txt        # Dependencies (includes playwright)
```

## Security Notes

- **Never commit `ieee_cookie.txt`** - Add to `.gitignore`
- **Never commit credentials** - Use environment variables
- **Rotate credentials** if compromised
- **Monitor for suspicious activity**

## Next Steps

If you want to add:
- CAPTCHA detection + pause
- Email alerts on failure
- Dockerized setup
- Better error handling

Let me know which direction you'd like to go!

