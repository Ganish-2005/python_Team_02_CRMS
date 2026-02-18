@echo off
echo ========================================
echo Git Push Script
echo ========================================
echo.

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Adding all changes...
git add .
echo.

echo Step 3: Committing changes...
git commit -m "Major updates: User status management, password visibility toggle, booking time validation, resource filters, and bug fixes"
echo.

echo Step 4: Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo Done! Check your GitHub repository:
echo https://github.com/Ganish-2005/Hostel_Management
echo ========================================
echo.

pause
