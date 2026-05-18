@echo off
title FluentAI Master Orchestrator
color 0B

echo.
echo  ===================================================================
echo    🎤 FluentAI - Speech Fluency Monitoring & Practice System
echo  ===================================================================
echo.

echo  [Step 1/4] Running Spotless Cache & Temp File Cleanup...
echo ─────────────────────────────────────────────────────────────
:: Purge Python Pycache files
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d" >nul 2>&1
:: Clean audio uploads and tests
del /q "server\uploads\*.*" >nul 2>&1
echo. > "server\uploads\.gitkeep"
del /q "audio-service\uploads\*.*" >nul 2>&1
echo. > "audio-service\uploads\.gitkeep"
if exist "test.wav" del /q "test.wav" >nul 2>&1
if exist "server\test.wav" del /q "server\test.wav" >nul 2>&1
if exist "audio-service\dummy.wav" del /q "audio-service\dummy.wav" >nul 2>&1
echo  ✔ Spotless cleanup complete! Caches and temp audios cleared.
echo.

echo  [Step 2/4] Verifying System Prerequisites...
echo ─────────────────────────────────────────────────────────────
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  ❌ ERROR: Node.js is not installed or not in PATH!
    echo  Please install Node.js v18+ from https://nodejs.org
    pause
    exit /b 1
) else (
    echo  ✔ Node.js verified.
)

python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  ❌ ERROR: Python is not installed or not in PATH!
    echo  Please install Python v3.10+ from https://python.org
    pause
    exit /b 1
) else (
    echo  ✔ Python verified.
)
echo.

echo  [Step 3/4] Initializing Microservices Pipeline...
echo ─────────────────────────────────────────────────────────────

:: Terminal A: Backend (Node.js/Express)
echo  ⚡ Launching Express Backend Server (Port 3001)...
start "FluentAI Backend [Express]" cmd /k "color 0E && cd server && echo Starting Express Backend... && npm run dev"

:: Give backend time to spin up
timeout /t 2 > nul

:: Terminal B: Python Audio service (Flask)
echo  🧠 Launching AI Audio Service [Whisper + Wav2Vec] (Port 5000)...
start "FluentAI Audio Server [Flask]" cmd /k "color 09 && cd audio-service && echo Activating virtual environment... && venv\Scripts\activate.bat && echo Starting Flask inference server... && python app.py"

:: Give Python service time to spin up
timeout /t 3 > nul

:: Terminal C: Frontend UI (React + Vite)
echo  💻 Launching React Client GUI (Port 5173)...
start "FluentAI Client GUI [Vite]" cmd /k "color 0D && cd client && echo Starting Vite Dev server... && npm run dev"

echo.
echo  [Step 4/4] Connection Framework Established!
echo ─────────────────────────────────────────────────────────────
echo   ✔ Client GUI:      http://localhost:5173
echo   ✔ Telemetry API:    http://localhost:3001
echo   ✔ Audio Inference:  http://localhost:5000
echo ─────────────────────────────────────────────────────────────
echo.
echo  🎉 All services running! Client GUI should open in browser shortly.
echo  Press any key to exit this monitor window (services will stay alive).
echo.
pause
