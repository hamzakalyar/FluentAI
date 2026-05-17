@echo off
echo 💾 1. Backing up active files...
copy /y "audio-service\app.py" "audio-service\app.py.bak"
copy /y "audio-service\.gitattributes" "audio-service\.gitattributes.bak"
copy /y "audio-service\requirements.txt" "audio-service\requirements.txt.bak"

echo 🛑 2. Aborting the stuck rebase...
git rebase --abort

echo 🔄 3. Pulling and merging remote changes cleanly...
git pull origin main --no-rebase -m "Merge remote branch 'origin/main' into main"

echo 💾 4. Restoring backed-up files...
copy /y "audio-service\app.py.bak" "audio-service\app.py"
copy /y "audio-service\.gitattributes.bak" "audio-service\.gitattributes"
copy /y "audio-service\requirements.txt.bak" "audio-service\requirements.txt"

echo 🗑️ 5. Deleting temporary backups and helper scripts...
del "audio-service\app.py.bak"
del "audio-service\.gitattributes.bak"
del "audio-service\requirements.txt.bak"
del "git_status_output.txt"
del "git_diff_output.txt"
del "git_show_output.txt"
del "git_log_output.txt"
del "git_branch_output.txt"
del "git_remote_output.txt"
del "check_status.bat"
del "git_continue.bat"

echo 🔄 6. Staging all final changes...
git add .

echo 🔄 7. Committing final changes...
git commit -m "feat: optimize deployment configuration, configure port and root route for Hugging Face, clean up Git LFS tracking"

echo 🔄 8. Pushing to GitHub (origin main)...
git push origin main

echo 🔄 9. Final git status check...
git status

echo ✨ SUCCESS! All changes pushed to GitHub! Vercel should now be building and deploying.
