#!/bin/bash
# START_ALL.sh - One-command startup for macOS/Linux
# This script starts all three services in the background

echo ""
echo "===================================================="
echo "  AI-Based Speech Fluency Monitoring System Startup"
echo "===================================================="
echo ""

# Check if required commands exist
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ Error: $1 is not installed"
        return 1
    fi
    return 0
}

echo "Checking prerequisites..."
check_command "node" || exit 1
check_command "python3" || exit 1
check_command "npm" || exit 1

echo "✅ All prerequisites found"
echo ""
echo "Starting services..."
echo ""

# Start Backend
echo "[1/3] Starting Backend (Express on port 3001)..."
(cd server && npm start) &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start Python Service
echo "[2/3] Starting Python Service (Flask on port 5000)..."
(cd audio-service && python3 app.py) &
PYTHON_PID=$!

# Wait a moment for Python to start
sleep 3

# Start Frontend
echo "[3/3] Starting Frontend (React/Vite on port 5173)..."
(cd client && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "===================================================="
echo "  Services Started!"
echo "===================================================="
echo ""
echo "Backend:       http://localhost:3001"
echo "Python:        http://localhost:5000"
echo "Frontend:      http://localhost:5173"
echo ""
echo "Open http://localhost:5173 in your browser"
echo ""
echo "To stop all services, press Ctrl+C"
echo ""

# Wait for all processes
wait
