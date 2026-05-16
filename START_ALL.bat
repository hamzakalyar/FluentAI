@echo off
REM START_ALL.bat - One-command startup for Windows
REM This script starts all three services in separate terminal windows

echo.
echo ====================================================
echo  AI-Based Speech Fluency Monitoring System Startup
echo ====================================================
echo.
echo Starting all services...
echo.

REM Terminal 1: Backend (Node.js/Express)
echo [1/3] Starting Backend Service (Express)...
start "Backend Service" cmd /k "cd server && npm start"

REM Give backend time to start
timeout /t 2 > nul

REM Terminal 2: Python Service (Flask)
echo [2/3] Starting Python Audio Service (Flask)...
start "Python Audio Service" cmd /k "cd audio-service && python app.py"

REM Give Python service time to start
timeout /t 3 > nul

REM Terminal 3: Frontend (React/Vite)
echo [3/3] Starting Frontend (React/Vite)...
start "Frontend (React)" cmd /k "cd client && npm run dev"

echo.
echo ====================================================
echo  Services Started!
echo ====================================================
echo.
echo Backend:       http://localhost:3001
echo Python:        http://localhost:5000
echo Frontend:      http://localhost:5173
echo.
echo Open http://localhost:5173 in your browser when ready.
echo.
echo Press any key to exit this window (services will keep running).
echo.
pause
