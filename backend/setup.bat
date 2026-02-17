@echo off
echo Setting up Campus RMS Backend...

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please update it with your MySQL credentials.
)

echo Setup complete! Next steps:
echo 1. Update .env with your MySQL credentials
echo 2. Create MySQL database: CREATE DATABASE campus;
echo 3. Run: python manage.py makemigrations
echo 4. Run: python manage.py migrate
echo 5. Run: python manage.py createsuperuser (optional)
echo 6. Run: python manage.py runserver

pause
