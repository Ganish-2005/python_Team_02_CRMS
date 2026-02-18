@echo off
echo Applying phone uniqueness migration...
echo.
echo Please make sure the Django server is stopped before running this script.
echo.
pause

python manage.py migrate api 0003_add_phone_unique_constraint

echo.
echo Migration complete!
echo You can now restart the Django server.
echo.
pause
