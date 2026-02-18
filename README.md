# Campus Resource Management System (CampusRMS)

A full-stack web application for managing campus resources, bookings, and users with role-based access control.

## 🚀 Features

- **User Management**: Admin can create, update, and delete users
- **Resource Management**: Staff and Admin can manage campus resources (Labs, Classrooms, Event Halls, Computers)
- **Booking System**: Students can book resources with date and time slot validation
- **Role-Based Access**: Three user roles (Student, Staff, Admin) with different permissions
- **Real-time Status**: Only logged-in user shows as ACTIVE
- **Smart Filters**: Filter bookings by Upcoming/Past/All and resources by type
- **Password Security**: Strong password validation with visibility toggle
- **Validation**: Prevents duplicate emails/phone numbers and past bookings

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- MySQL 8.0 or higher
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ganish-2005/Hostel_Management.git
cd Hostel_Management
```

### 2. Backend Setup (Django)

#### Windows:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### Linux/Mac:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Configure Database:

1. Create a MySQL database:
```sql
CREATE DATABASE campus_rms;
```

2. Update `backend/campus_rms/settings.py` with your MySQL credentials:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'campus_rms',
        'USER': 'your_mysql_username',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### Run Migrations:

```bash
python manage.py migrate
```

#### Create Admin User:

```bash
python manage.py create_admin
```

Default admin credentials:
- Email: `admin@campus.edu`
- Password: `Admin@123`

#### Fix User Status (One-time):

```bash
python fix_user_status.py
```

This sets all users to INACTIVE. When a user logs in, they become ACTIVE.

### 3. Frontend Setup (React)

Open a new terminal:

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server:

```bash
cd backend
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

### Start Frontend Server:

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🔑 Default Login Credentials

### Admin Account:
- Email: `admin@campus.edu`
- Password: `Admin@123`

### Test Accounts (if created):
Create new users through the registration page or admin panel.

## 📱 User Roles & Permissions

### Student
- View and create bookings
- View own bookings
- Edit/delete own bookings
- Cannot book past dates/times

### Staff
- All Student permissions
- Add and manage resources
- View all bookings

### Admin
- All Staff permissions
- Manage users (create, update, delete)
- Approve/reject bookings
- Full system access

## 🎯 Key Features Explained

### User Status Management
- Only the currently logged-in user shows as ACTIVE
- All other users show as INACTIVE
- Status automatically updates on login/logout

### Booking Validation
- Cannot book past dates
- Cannot book past time slots on current date
- Prevents double booking (same resource, date, time)
- Prevents user from booking multiple resources at same time

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Uniqueness Validation
- Email addresses must be unique
- Phone numbers must be unique
- Names can be duplicated

## 📂 Project Structure

```
Hostel_Management/
├── backend/
│   ├── api/                    # Django app
│   │   ├── migrations/         # Database migrations
│   │   ├── management/         # Custom commands
│   │   ├── models.py           # Database models
│   │   ├── serializers.py      # API serializers
│   │   ├── views.py            # API views
│   │   └── urls.py             # API routes
│   ├── campus_rms/             # Django project settings
│   ├── manage.py               # Django management script
│   ├── requirements.txt        # Python dependencies
│   └── fix_user_status.py      # User status fix script
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── App.jsx             # Main app component
│   ├── package.json            # Node dependencies
│   └── vite.config.ts          # Vite configuration
└── README.md                   # This file
```

## 🔧 Common Commands

### Backend Commands:

```bash
# Run development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Create admin user (custom command)
python manage.py create_admin

# Fix user status
python fix_user_status.py

# Django shell
python manage.py shell
```

### Frontend Commands:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### Backend Issues:

**MySQL Connection Error:**
- Verify MySQL is running
- Check database credentials in `settings.py`
- Ensure database exists: `CREATE DATABASE campus_rms;`

**Migration Errors:**
```bash
python manage.py migrate --run-syncdb
```

**Port Already in Use:**
```bash
python manage.py runserver 8001
```

### Frontend Issues:

**Port Already in Use:**
Edit `vite.config.ts` to change port:
```javascript
server: {
  port: 3000
}
```

**Module Not Found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 API Endpoints

### Authentication
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout

### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Resources
- `GET /api/resources/` - List all resources
- `POST /api/resources/` - Create resource
- `GET /api/resources/{id}/` - Get resource details
- `PUT /api/resources/{id}/` - Update resource
- `DELETE /api/resources/{id}/` - Delete resource

### Bookings
- `GET /api/bookings/` - List all bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/{id}/` - Get booking details
- `PUT /api/bookings/{id}/` - Update booking
- `DELETE /api/bookings/{id}/` - Delete booking
- `POST /api/bookings/{id}/approve/` - Approve booking (Admin)
- `POST /api/bookings/{id}/reject/` - Reject booking (Admin)

### Admin
- `GET /api/admin/stats/` - Get dashboard statistics

## 🔐 Security Features

- Password hashing using Django's built-in authentication
- CSRF protection enabled
- SQL injection prevention through ORM
- XSS protection through React
- Input validation on both frontend and backend

## 🎨 Tech Stack

### Backend:
- Django 4.2.7
- Django REST Framework
- MySQL
- Python 3.x

### Frontend:
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons
- React Router

## 📝 License

This project is for educational purposes.

## 👥 Contributors

- Ganish V - [GitHub](https://github.com/Ganish-2005)

## 📧 Support

For issues and questions, please create an issue on GitHub.

---

Made with ❤️ for Campus Resource Management
