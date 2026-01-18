#!/bin/bash
# Script to refresh IEEE cookie and update web app

set -e

echo "🔄 Refreshing IEEE cookie..."
cd "$(dirname "$0")"

# Activate venv and refresh cookie
source venv/bin/activate
export IEEE_USERNAME="ha1487@srmist.edu.in"
export IEEE_PASSWORD="Harsh@954"

python ieee_login.py

if [ ! -f "ieee_cookie.txt" ]; then
    echo "❌ Cookie file not created!"
    exit 1
fi

echo "✓ Cookie refreshed successfully"
echo ""

# Update web app default cookie
COOKIE=$(cat ieee_cookie.txt)
WEB_APP_PAGE="web-app/app/page.tsx"

# Extract the cookie value line and replace it
if [ -f "$WEB_APP_PAGE" ]; then
    echo "📝 Updating web app default cookie..."
    # Use sed to replace the defaultCookie line
    # This is a simple approach - in production you might want more robust parsing
    python3 << EOF
import re

with open('$WEB_APP_PAGE', 'r') as f:
    content = f.read()

# Find and replace the defaultCookie value
pattern = r"(const defaultCookie = ')[^']*(';)"
replacement = r"\1$COOKIE\2"
new_content = re.sub(pattern, replacement, content)

with open('$WEB_APP_PAGE', 'w') as f:
    f.write(new_content)

print("✓ Web app cookie updated")
EOF
else
    echo "⚠️  Web app file not found, skipping update"
fi

echo ""
echo "✅ Cookie refresh complete!"
echo ""
echo "Next steps:"
echo "1. Test the cookie: python ieee_validator.py"
echo "2. Deploy web app: cd web-app && vercel --prod"

