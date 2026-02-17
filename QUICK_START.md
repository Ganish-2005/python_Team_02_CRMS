# Quick Start Guide

## Prerequisites
1. MySQL server running
2. Python 3.8+ installed
3. Node.js 16+ installed

## Step 1: Database Setup

Open MySQL and run:
```sql
CREATE DATABASE campus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Step 2: Backend Setup

1. Open a terminal in the `backend` folder
2. Create a `.env` file with your MySQL credentials:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=campus
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_HOST=localhost
DB_PORT=3306
```

3. Run these commands:
```bash
# Install dependencies (if not already done)
pip install -r requirements.txt

# Create database tables
python manage.py makemigrations
python manage.py migrate

# Start the backend server
python manage.py runserver
```

The backend should now be running at `http://localhost:8000`

## Step 3: Frontend Setup

1. Open a NEW terminal in the `frontend` folder
2. Run these commands:
```bash
# Install dependencies (if not already done)
npm install

# Start the frontend
npm run dev
```

The frontend should now be running at `http://localhost:5173`

## Step 4: Test the Application

1. Open your browser to `http://localhost:5173`
2. Click "Create an account" to register
3. Fill in the form and click "Register"
4. You should be redirected to the login page
5. Login with your credentials

## Troubleshooting

### "Failed to fetch" error
- Make sure the backend is running on `http://localhost:8000`
- Check the browser console for detailed error messages
- Verify your `.env` file has correct MySQL credentials

### Database connection errors
- Ensure MySQL is running
- Verify the database `campus` exists
- Check your MySQL username and password in `.env`

### Migration errors
- Delete the `backend/api/migrations` folder (except `__init__.py`)
- Run `python manage.py makemigrations` again
- Run `python manage.py migrate` again
