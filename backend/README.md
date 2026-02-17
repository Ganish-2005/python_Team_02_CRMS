# Campus Resource Management System - Backend

Django REST API backend for Campus Resource Management System.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure MySQL Database

Create a MySQL database named `campus`:

```sql
CREATE DATABASE campus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=campus
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_HOST=localhost
DB_PORT=3306
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user by ID
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user
- `GET /api/users/by_status/?status=ACTIVE` - Filter by status

### Resources
- `GET /api/resources/` - List all resources
- `POST /api/resources/` - Create resource
- `GET /api/resources/{id}/` - Get resource by ID
- `PUT /api/resources/{id}/` - Update resource
- `DELETE /api/resources/{id}/` - Delete resource
- `GET /api/resources/available/` - Get available resources

### Bookings
- `GET /api/bookings/` - List all bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/{id}/` - Get booking by ID
- `PUT /api/bookings/{id}/` - Update booking
- `DELETE /api/bookings/{id}/` - Delete booking
- `POST /api/bookings/{id}/approve/` - Approve booking
- `POST /api/bookings/{id}/reject/` - Reject booking
- `GET /api/bookings/upcoming/` - Get upcoming bookings

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/`
