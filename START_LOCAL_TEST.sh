#!/bin/bash
#
# Quick Start Script for Local Testing
#

cd "/Users/mrstark/Desktop/Code PlayGround/IEEE/Hize"

echo "=========================================="
echo "IEEE Validation - Local Testing Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    echo "VPS_API_URL=http://65.20.84.46:5001" > .env.local
    echo "✓ Created .env.local"
else
    echo "✓ .env.local already exists"
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo ""
    echo "Installing dependencies..."
    npm install
fi

# Check if dev server is already running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo ""
    echo "✓ Dev server is already running!"
    echo ""
    echo "Open your browser and visit:"
    echo "  http://localhost:3000"
    echo ""
    echo "Then:"
    echo "1. Wait for registration modal (or find registration button)"
    echo "2. Enter IEEE member number (e.g., 99634594)"
    echo "3. Watch it validate automatically!"
    echo ""
    exit 0
fi

echo ""
echo "Starting Next.js dev server..."
echo "This will take 10-20 seconds..."
echo ""
echo "Once you see 'Ready in X.Xs', open:"
echo "  http://localhost:3000"
echo ""
echo "Then test the registration modal!"
echo ""

npm run dev

