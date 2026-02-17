# Campus Resource Management System - Complete Setup Guide

## Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

## Backend Setup (Django + MySQL)

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup MySQL Database

Open MySQL command line or MySQL Workbench and run:
```sql
CREATE DATABASE campus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Configure Environment Variables

Create a `.env` file in the `backend` directory:
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
SECRET_KEY=your-secret-key-here-generate-a-random-string
DEBUG=True
DB_NAME=campus
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_HOST=localhost
DB_PORT=3306
```

### 6. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create Admin User (Optional)
```bash
python manage.py createsuperuser
```

### 8. Start Django Server
```bash
python manage.py runserver
```

Backend will run at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

---

## Frontend Setup (React + Vite)

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## Testing the Application

### 1. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/

### 2. API Endpoints

#### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user by ID
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user
- `GET /api/users/by_status/?status=ACTIVE` - Filter by status

#### Resources
- `GET /api/resources/` - List all resources
- `POST /api/resources/` - Create resource
- `GET /api/resources/{id}/` - Get resource by ID
- `PUT /api/resources/{id}/` - Update resource
- `DELETE /api/resources/{id}/` - Delete resource
- `GET /api/resources/available/` - Get available resources

#### Bookings
- `GET /api/bookings/` - List all bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/{id}/` - Get booking by ID
- `PUT /api/bookings/{id}/` - Update booking
- `DELETE /api/bookings/{id}/` - Delete booking
- `POST /api/bookings/{id}/approve/` - Approve booking
- `POST /api/bookings/{id}/reject/` - Reject booking
- `GET /api/bookings/upcoming/` - Get upcoming bookings

### 3. Test with Sample Data

You can use the Django admin panel to add sample data or use the API directly.

---

## Project Structure

```
campus-rms/
├── backend/
│   ├── api/
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py           # API views
│   │   ├── urls.py            # API routes
│   │   └── admin.py           # Admin configuration
│   ├── campus_rms/
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py            # Main URL configuration
│   │   └── wsgi.py            # WSGI configuration
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/        # React components
    │   ├── pages/             # Page components
    │   ├── services/          # API service layer
    │   ├── App.jsx            # Main app component
    │   └── index.jsx          # Entry point
    ├── package.json           # Node dependencies
    └── vite.config.ts         # Vite configuration
```

---

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL server is running
- Check credentials in `.env` file
- Verify database `campus` exists

### Port Already in Use
- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Vite will automatically suggest another port

### CORS Issues
- Ensure `corsheaders` is installed
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`

### Module Not Found
- Backend: Activate virtual environment and reinstall requirements
- Frontend: Delete `node_modules` and run `npm install` again

---

## Development Tips

1. Keep both servers running in separate terminals
2. Use Django admin panel for quick data management
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Use Django shell for database queries: `python manage.py shell`

---

## Production Deployment

For production deployment:
1. Set `DEBUG=False` in `.env`
2. Configure proper `ALLOWED_HOSTS`
3. Use a production-grade web server (Gunicorn, uWSGI)
4. Set up proper database backups
5. Use environment-specific settings
6. Enable HTTPS
7. Configure static file serving

---

## Support

For issues or questions, check:
- Django documentation: https://docs.djangoproject.com/
- React documentation: https://react.dev/
- MySQL documentation: https://dev.mysql.com/doc/
