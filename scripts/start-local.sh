#!/bin/bash
# Start local development environment

set -e

echo "🚀 Starting IEEE Validator System (Local Development)"
echo "=================================================="

# Check if Redis is running
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️  Redis is not running. Starting Redis..."
    echo "   Install Redis: brew install redis (macOS) or apt-get install redis-server (Linux)"
    echo "   Then run: redis-server"
    exit 1
fi

echo "✅ Redis is running"

# Start backend API
echo ""
echo "📡 Starting Backend API..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start worker
echo ""
echo "⚙️  Starting Worker..."
cd worker
if [ ! -d "venv" ]; then
    echo "   Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Worker .env not found. Copying from env.example..."
    cp env.example .env
    echo "   Please update worker/.env with your IEEE_COOKIE"
fi

python3 ieee_worker.py &
WORKER_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Services:"
echo "   - Backend API: http://localhost:3001"
echo "   - Frontend: http://localhost:3000 (run 'npm run dev' separately)"
echo "   - Worker: Running (PID: $WORKER_PID)"
echo ""
echo "📝 To stop services:"
echo "   kill $BACKEND_PID $WORKER_PID"
echo ""
echo "💡 To refresh cookie:"
echo "   npm run cookie:refresh"

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $WORKER_PID 2>/dev/null; exit" INT TERM

wait

