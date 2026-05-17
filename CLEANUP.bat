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

echo [4/5] Deleting old development and temporary git scripts...
if exist "mudassir.md" del "mudassir.md"
if exist "reset-hamza.js" del "reset-hamza.js"
if exist "server\reset-hamza.js" del "server\reset-hamza.js"
if exist "start_all.sh" del "start_all.sh"
if exist "check_status.bat" del "check_status.bat"
if exist "resolve_git.bat" del "resolve_git.bat"
if exist "git_continue.bat" del "git_continue.bat"
if exist "abort_and_merge.bat" del "abort_and_merge.bat"
if exist "final_push.bat" del "final_push.bat"
if exist "git_branch_output.txt" del "git_branch_output.txt"
if exist "git_diff_output.txt" del "git_diff_output.txt"
if exist "git_log_output.txt" del "git_log_output.txt"
if exist "git_show_output.txt" del "git_show_output.txt"
if exist "stutter_detector_backup.py" del "stutter_detector_backup.py"
if exist "requirements_backup.txt" del "requirements_backup.txt"

echo [5/5] Deleting legacy test-frontend folder...
if exist "test-frontend" rd /s /q "test-frontend"

echo.
echo ===================================================
echo   DEEP CLEAN COMPLETE! Your project is spotless.
echo ===================================================
pause
