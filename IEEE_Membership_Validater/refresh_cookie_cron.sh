#!/bin/bash
# Cron-friendly script to refresh IEEE cookie
# This script activates venv and runs the login script

cd "/Users/mrstark/Desktop/Code PlayGround/IEEE_Membership_Validater"

# Activate venv
source venv/bin/activate

# Set credentials
export IEEE_USERNAME="ha1487@srmist.edu.in"
export IEEE_PASSWORD="Harsh@954"

# Run login script
python ieee_login.py >> cookie_refresh.log 2>&1

# Optional: Update web app cookie (uncomment if you want this)
# COOKIE=$(cat ieee_cookie.txt)
# python3 << EOF
# import re
# with open('web-app/app/page.tsx', 'r') as f:
#     content = f.read()
# pattern = r"(const defaultCookie = ')[^']*(';)"
# replacement = r"\1$COOKIE\2"
# new_content = re.sub(pattern, replacement, content)
# with open('web-app/app/page.tsx', 'w') as f:
#     f.write(new_content)
# EOF

echo "$(date): Cookie refreshed" >> cookie_refresh.log

