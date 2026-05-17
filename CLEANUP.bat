@echo off
echo ===================================================
echo   SpeakFlow AI - DEEP Project Cleanup Script
echo ===================================================
echo.

echo [1/5] Cleaning server and audio uploads...
del /q "server\uploads\*.*"
echo. > "server\uploads\.gitkeep"
del /q "audio-service\uploads\*.*"
echo. > "audio-service\uploads\.gitkeep"

echo [2/5] Removing Python cache files...
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"

echo [3/5] Deleting temporary test files...
if exist "test.wav" del "test.wav"
if exist "server\test.wav" del "server\test.wav"
if exist "audio-service\dummy.wav" del "audio-service\dummy.wav"

echo [4/5] Deleting old development scripts...
if exist "mudassir.md" del "mudassir.md"
if exist "reset-hamza.js" del "reset-hamza.js"
if exist "server\reset-hamza.js" del "server\reset-hamza.js"
if exist "start_all.sh" del "start_all.sh"

echo [5/5] Deleting legacy test-frontend folder...
if exist "test-frontend" rd /s /q "test-frontend"

echo.
echo ===================================================
echo   DEEP CLEAN COMPLETE! Your project is spotless.
echo ===================================================
pause
