@echo off
echo Fixing user statuses...
echo Setting all users to INACTIVE...
echo.

python fix_user_status.py

echo.
echo Done! All users are now INACTIVE.
echo When a user logs in, they will automatically be set to ACTIVE.
echo.
pause
