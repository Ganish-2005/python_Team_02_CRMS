# Postman API Testing Guide

## Base URL
```
http://localhost:8000/api
```

---

## 1. User Registration (Create User)

### Endpoint
```
POST http://localhost:8000/api/users/
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)

#### Student Registration:
```json
{
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "phone": "9876543210",
  "password": "Student@123",
  "role": "STUDENT",
  "status": "ACTIVE"
}
```

#### Staff Registration:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@university.edu",
  "phone": "9876543211",
  "password": "Staff@123",
  "role": "STAFF",
  "status": "ACTIVE"
}
```

#### Another Student:
```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@university.edu",
  "phone": "9876543212",
  "password": "Alice@2024",
  "role": "STUDENT",
  "status": "ACTIVE"
}
```

### Expected Response (Success - 201 Created)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "phone": "9876543210",
  "role": "STUDENT",
  "status": "ACTIVE",
  "created_at": "2026-02-18T10:30:00Z"
}
```

### Error Responses

#### Duplicate Email (400 Bad Request):
```json
{
  "email": [
    "A user with this email already exists."
  ]
}
```

#### Duplicate Phone (400 Bad Request):
```json
{
  "phone": [
    "A user with this phone number already exists."
  ]
}
```

#### Weak Password (400 Bad Request):
```json
{
  "password": [
    "Password must be at least 8 characters long."
  ]
}
```

---

## 2. User Login

### Endpoint
```
POST http://localhost:8000/api/login/
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)

#### Admin Login:
```json
{
  "email": "admin@campus.edu",
  "password": "Admin@123"
}
```

#### Student Login:
```json
{
  "email": "john.doe@university.edu",
  "password": "Student@123"
}
```

#### Staff Login:
```json
{
  "email": "jane.smith@university.edu",
  "password": "Staff@123"
}
```

### Expected Response (Success - 200 OK)
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "phone": "9876543210",
    "role": "STUDENT",
    "status": "ACTIVE",
    "created_at": "2026-02-18T10:30:00Z"
  }
}
```

### Error Responses

#### Invalid Credentials (401 Unauthorized):
```json
{
  "error": "Invalid email or password"
}
```

#### Missing Fields (400 Bad Request):
```json
{
  "email": [
    "This field is required."
  ],
  "password": [
    "This field is required."
  ]
}
```

---

## 3. User Logout

### Endpoint
```
POST http://localhost:8000/api/logout/
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)
```json
{
  "user_id": 1
}
```

### Expected Response (Success - 200 OK)
```json
{
  "message": "Logout successful"
}
```

---

## 4. Get All Users

### Endpoint
```
GET http://localhost:8000/api/users/
```

### Headers
```
Content-Type: application/json
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@campus.edu",
    "phone": "+1234567890",
    "role": "ADMIN",
    "status": "ACTIVE",
    "created_at": "2026-02-18T10:00:00Z"
  },
  {
    "id": 2,
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "phone": "9876543210",
    "role": "STUDENT",
    "status": "INACTIVE",
    "created_at": "2026-02-18T10:30:00Z"
  }
]
```

---

## 5. Get Single User

### Endpoint
```
GET http://localhost:8000/api/users/1/
```

### Expected Response (Success - 200 OK)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "phone": "9876543210",
  "role": "STUDENT",
  "status": "ACTIVE",
  "created_at": "2026-02-18T10:30:00Z"
}
```

---

## 6. Update User

### Endpoint
```
PUT http://localhost:8000/api/users/1/
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)
```json
{
  "name": "John Doe Updated",
  "email": "john.doe@university.edu",
  "phone": "9876543210",
  "role": "STUDENT",
  "status": "ACTIVE"
}
```

### Expected Response (Success - 200 OK)
```json
{
  "id": 1,
  "name": "John Doe Updated",
  "email": "john.doe@university.edu",
  "phone": "9876543210",
  "role": "STUDENT",
  "status": "ACTIVE",
  "created_at": "2026-02-18T10:30:00Z"
}
```

---

## 7. Delete User

### Endpoint
```
DELETE http://localhost:8000/api/users/1/
```

### Expected Response (Success - 204 No Content)
```
(Empty response body)
```

---

## Password Validation Rules

When testing registration, passwords must meet these requirements:

✅ **Valid Passwords:**
```json
"Student@123"
"Admin@2024"
"MyPass123!"
"Secure#Pass1"
```

❌ **Invalid Passwords:**
```json
"short"           // Too short (less than 8 characters)
"alllowercase1!"  // No uppercase letter
"ALLUPPERCASE1!"  // No lowercase letter
"NoNumbers!"      // No number
"NoSpecial123"    // No special character
```

---

## Testing Workflow in Postman

### Step 1: Register a New User
1. Create a new POST request
2. URL: `http://localhost:8000/api/users/`
3. Body → raw → JSON
4. Paste student registration JSON
5. Click Send

### Step 2: Login with New User
1. Create a new POST request
2. URL: `http://localhost:8000/api/login/`
3. Body → raw → JSON
4. Paste login JSON with same email/password
5. Click Send
6. Save the user ID from response

### Step 3: Verify User Status
1. Create a new GET request
2. URL: `http://localhost:8000/api/users/`
3. Click Send
4. Check that logged-in user shows "status": "ACTIVE"
5. Other users should show "status": "INACTIVE"

### Step 4: Logout
1. Create a new POST request
2. URL: `http://localhost:8000/api/logout/`
3. Body → raw → JSON
4. Use user_id from login response
5. Click Send

### Step 5: Verify Status Changed
1. GET `http://localhost:8000/api/users/`
2. User should now show "status": "INACTIVE"

---

## Common Test Scenarios

### Test 1: Duplicate Email
```json
// First user
{
  "name": "User One",
  "email": "test@example.com",
  "phone": "1111111111",
  "password": "Test@123",
  "role": "STUDENT",
  "status": "ACTIVE"
}

// Second user (should fail)
{
  "name": "User Two",
  "email": "test@example.com",
  "phone": "2222222222",
  "password": "Test@456",
  "role": "STUDENT",
  "status": "ACTIVE"
}
```
Expected: 400 Bad Request - "A user with this email already exists."

### Test 2: Duplicate Phone
```json
// First user
{
  "name": "User One",
  "email": "user1@example.com",
  "phone": "9999999999",
  "password": "Test@123",
  "role": "STUDENT",
  "status": "ACTIVE"
}

// Second user (should fail)
{
  "name": "User Two",
  "email": "user2@example.com",
  "phone": "9999999999",
  "password": "Test@456",
  "role": "STUDENT",
  "status": "ACTIVE"
}
```
Expected: 400 Bad Request - "A user with this phone number already exists."

### Test 3: Same Name (Should Work)
```json
// First user
{
  "name": "John Smith",
  "email": "john1@example.com",
  "phone": "1111111111",
  "password": "Test@123",
  "role": "STUDENT",
  "status": "ACTIVE"
}

// Second user (should succeed)
{
  "name": "John Smith",
  "email": "john2@example.com",
  "phone": "2222222222",
  "password": "Test@456",
  "role": "STUDENT",
  "status": "ACTIVE"
}
```
Expected: 201 Created - Both users created successfully

---

## Quick Copy-Paste Collection

### Register Student
```
POST http://localhost:8000/api/users/
Content-Type: application/json

{
  "name": "Test Student",
  "email": "student@test.com",
  "phone": "9876543210",
  "password": "Student@123",
  "role": "STUDENT",
  "status": "ACTIVE"
}
```

### Login
```
POST http://localhost:8000/api/login/
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "Student@123"
}
```

### Get All Users
```
GET http://localhost:8000/api/users/
```

### Logout
```
POST http://localhost:8000/api/logout/
Content-Type: application/json

{
  "user_id": 1
}
```

---

## 8. Create Resource

### Endpoint
```
POST http://localhost:8000/api/resources/
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)

#### Lab Resource:
```json
{
  "name": "Computer Lab 1",
  "type": "LAB",
  "capacity": 40,
  "status": "AVAILABLE",
  "location": "Building A, Floor 2"
}
```

#### Classroom Resource:
```json
{
  "name": "Classroom 101",
  "type": "CLASSROOM",
  "capacity": 60,
  "status": "AVAILABLE",
  "location": "Main Building, Floor 1"
}
```

#### Event Hall Resource:
```json
{
  "name": "Auditorium",
  "type": "EVENT_HALL",
  "capacity": 200,
  "status": "AVAILABLE",
  "location": "Central Block"
}
```

#### Computer Resource:
```json
{
  "name": "Computer Station 5",
  "type": "COMPUTER",
  "capacity": 1,
  "status": "AVAILABLE",
  "location": "Library, Floor 3"
}
```

### Expected Response (Success - 201 Created)
```json
{
  "id": 1,
  "name": "Computer Lab 1",
  "type": "LAB",
  "capacity": 40,
  "status": "AVAILABLE",
  "location": "Building A, Floor 2"
}
```

---

## 9. Get All Resources

### Endpoint
```
GET http://localhost:8000/api/resources/
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 1,
    "name": "Computer Lab 1",
    "type": "LAB",
    "capacity": 40,
    "status": "AVAILABLE",
    "location": "Building A, Floor 2"
  },
  {
    "id": 2,
    "name": "Classroom 101",
    "type": "CLASSROOM",
    "capacity": 60,
    "status": "AVAILABLE",
    "location": "Main Building, Floor 1"
  }
]
```

---

## 10. Get Single Resource

### Endpoint
```
GET http://localhost:8000/api/resources/1/
```

### Expected Response (Success - 200 OK)
```json
{
  "id": 1,
  "name": "Computer Lab 1",
  "type": "LAB",
  "capacity": 40,
  "status": "AVAILABLE",
  "location": "Building A, Floor 2"
}
```

---

## 11. Update Resource

### Endpoint
```
PUT http://localhost:8000/api/resources/1/
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)
```json
{
  "name": "Computer Lab 1 - Updated",
  "type": "LAB",
  "capacity": 50,
  "status": "UNAVAILABLE",
  "location": "Building A, Floor 2, Room 201"
}
```

### Expected Response (Success - 200 OK)
```json
{
  "id": 1,
  "name": "Computer Lab 1 - Updated",
  "type": "LAB",
  "capacity": 50,
  "status": "UNAVAILABLE",
  "location": "Building A, Floor 2, Room 201"
}
```

---

## 12. Delete Resource

### Endpoint
```
DELETE http://localhost:8000/api/resources/1/
```

### Expected Response (Success - 204 No Content)
```
(Empty response body)
```

---

## 13. Get Available Resources

### Endpoint
```
GET http://localhost:8000/api/resources/available/
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 1,
    "name": "Computer Lab 1",
    "type": "LAB",
    "capacity": 40,
    "status": "AVAILABLE",
    "location": "Building A, Floor 2"
  }
]
```

---

## 14. Create Booking

### Endpoint
```
POST http://localhost:8000/api/bookings/
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)

#### Example 1:
```json
{
  "user": 2,
  "resource": 1,
  "booking_date": "2026-02-20",
  "time_slot": "09:00 - 10:00",
  "status": "PENDING"
}
```

#### Example 2:
```json
{
  "user": 3,
  "resource": 2,
  "booking_date": "2026-02-21",
  "time_slot": "14:00 - 15:00",
  "status": "PENDING"
}
```

#### Example 3 (Different time slots):
```json
{
  "user": 2,
  "resource": 1,
  "booking_date": "2026-02-20",
  "time_slot": "10:00 - 11:00",
  "status": "PENDING"
}
```

### Expected Response (Success - 201 Created)
```json
{
  "id": 1,
  "user": 2,
  "user_name": "John Doe",
  "resource": 1,
  "resource_name": "Computer Lab 1",
  "resource_type": "LAB",
  "booking_date": "2026-02-20",
  "time_slot": "09:00 - 10:00",
  "status": "PENDING",
  "created_at": "2026-02-18T11:00:00Z"
}
```

### Error Responses

#### Resource Already Booked (400 Bad Request):
```json
{
  "resource": [
    "This resource is already booked for the selected date and time slot."
  ]
}
```

#### User Double Booking (400 Bad Request):
```json
{
  "user": [
    "You already have a booking at this time slot. One user cannot make two bookings at the same time."
  ]
}
```

---

## 15. Get All Bookings

### Endpoint
```
GET http://localhost:8000/api/bookings/
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 1,
    "user": 2,
    "user_name": "John Doe",
    "resource": 1,
    "resource_name": "Computer Lab 1",
    "resource_type": "LAB",
    "booking_date": "2026-02-20",
    "time_slot": "09:00 - 10:00",
    "status": "PENDING",
    "created_at": "2026-02-18T11:00:00Z"
  },
  {
    "id": 2,
    "user": 3,
    "user_name": "Jane Smith",
    "resource": 2,
    "resource_name": "Classroom 101",
    "resource_type": "CLASSROOM",
    "booking_date": "2026-02-21",
    "time_slot": "14:00 - 15:00",
    "status": "APPROVED",
    "created_at": "2026-02-18T11:30:00Z"
  }
]
```

---

## 16. Get Single Booking

### Endpoint
```
GET http://localhost:8000/api/bookings/1/
```

### Expected Response (Success - 200 OK)
```json
{
  "id": 1,
  "user": 2,
  "user_name": "John Doe",
  "resource": 1,
  "resource_name": "Computer Lab 1",
  "resource_type": "LAB",
  "booking_date": "2026-02-20",
  "time_slot": "09:00 - 10:00",
  "status": "PENDING",
  "created_at": "2026-02-18T11:00:00Z"
}
```

---

## 17. Update Booking

### Endpoint
```
PUT http://localhost:8000/api/bookings/1/
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)
```json
{
  "user": 2,
  "resource": 1,
  "booking_date": "2026-02-22",
  "time_slot": "11:00 - 12:00",
  "status": "PENDING"
}
```

### Expected Response (Success - 200 OK)
```json
{
  "id": 1,
  "user": 2,
  "user_name": "John Doe",
  "resource": 1,
  "resource_name": "Computer Lab 1",
  "resource_type": "LAB",
  "booking_date": "2026-02-22",
  "time_slot": "11:00 - 12:00",
  "status": "PENDING",
  "created_at": "2026-02-18T11:00:00Z"
}
```

---

## 18. Delete Booking

### Endpoint
```
DELETE http://localhost:8000/api/bookings/1/
```

### Expected Response (Success - 204 No Content)
```
(Empty response body)
```

---

## 19. Approve Booking (Admin Only)

### Endpoint
```
POST http://localhost:8000/api/bookings/1/approve/
```

### Headers
```
Content-Type: application/json
```

### Request Body
```
(Empty body)
```

### Expected Response (Success - 200 OK)
```json
{
  "id": 1,
  "user": 2,
  "user_name": "John Doe",
  "resource": 1,
  "resource_name": "Computer Lab 1",
  "resource_type": "LAB",
  "booking_date": "2026-02-20",
  "time_slot": "09:00 - 10:00",
  "status": "APPROVED",
  "created_at": "2026-02-18T11:00:00Z"
}
```

---

## 20. Reject Booking (Admin Only)

### Endpoint
```
POST http://localhost:8000/api/bookings/1/reject/
```

### Headers
```
Content-Type: application/json
```

### Request Body
```
(Empty body)
```

### Expected Response (Success - 200 OK)
```json
{
  "id": 1,
  "user": 2,
  "user_name": "John Doe",
  "resource": 1,
  "resource_name": "Computer Lab 1",
  "resource_type": "LAB",
  "booking_date": "2026-02-20",
  "time_slot": "09:00 - 10:00",
  "status": "REJECTED",
  "created_at": "2026-02-18T11:00:00Z"
}
```

---

## 21. Get Upcoming Bookings

### Endpoint
```
GET http://localhost:8000/api/bookings/upcoming/
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 1,
    "user": 2,
    "user_name": "John Doe",
    "resource": 1,
    "resource_name": "Computer Lab 1",
    "resource_type": "LAB",
    "booking_date": "2026-02-20",
    "time_slot": "09:00 - 10:00",
    "status": "APPROVED",
    "created_at": "2026-02-18T11:00:00Z"
  }
]
```

---

## 22. Get Admin Dashboard Statistics

### Endpoint
```
GET http://localhost:8000/api/admin/stats/
```

### Expected Response (Success - 200 OK)
```json
{
  "total_users": 5,
  "total_resources": 10,
  "total_bookings": 25,
  "pending_bookings": 8,
  "user_breakdown": {
    "students": 3,
    "staff": 1,
    "admins": 1
  },
  "resource_breakdown": {
    "labs": 3,
    "classrooms": 4,
    "event_halls": 2,
    "computers": 1
  }
}
```

---

## 23. Filter Resources by Type

### Endpoint
```
GET http://localhost:8000/api/resources/?type=LAB
```

### Other Filter Examples:
```
GET http://localhost:8000/api/resources/?type=CLASSROOM
GET http://localhost:8000/api/resources/?type=EVENT_HALL
GET http://localhost:8000/api/resources/?type=COMPUTER
GET http://localhost:8000/api/resources/?status=AVAILABLE
GET http://localhost:8000/api/resources/?status=UNAVAILABLE
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 1,
    "name": "Computer Lab 1",
    "type": "LAB",
    "capacity": 40,
    "status": "AVAILABLE",
    "location": "Building A, Floor 2"
  },
  {
    "id": 3,
    "name": "Science Lab",
    "type": "LAB",
    "capacity": 30,
    "status": "AVAILABLE",
    "location": "Science Block"
  }
]
```

---

## 24. Filter Bookings by Status

### Endpoint
```
GET http://localhost:8000/api/bookings/?status=PENDING
```

### Other Filter Examples:
```
GET http://localhost:8000/api/bookings/?status=APPROVED
GET http://localhost:8000/api/bookings/?status=REJECTED
GET http://localhost:8000/api/bookings/?user=2
GET http://localhost:8000/api/bookings/?resource=1
GET http://localhost:8000/api/bookings/?booking_date=2026-02-20
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 1,
    "user": 2,
    "user_name": "John Doe",
    "resource": 1,
    "resource_name": "Computer Lab 1",
    "resource_type": "LAB",
    "booking_date": "2026-02-20",
    "time_slot": "09:00 - 10:00",
    "status": "PENDING",
    "created_at": "2026-02-18T11:00:00Z"
  }
]
```

---

## 25. Search Users

### Endpoint
```
GET http://localhost:8000/api/users/?search=john
```

### Other Search Examples:
```
GET http://localhost:8000/api/users/?search=john.doe@university.edu
GET http://localhost:8000/api/users/?search=9876543210
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 2,
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "phone": "9876543210",
    "role": "STUDENT",
    "status": "ACTIVE",
    "created_at": "2026-02-18T10:30:00Z"
  }
]
```

---

## 26. Filter Users by Role

### Endpoint
```
GET http://localhost:8000/api/users/?role=STUDENT
```

### Other Filter Examples:
```
GET http://localhost:8000/api/users/?role=STAFF
GET http://localhost:8000/api/users/?role=ADMIN
GET http://localhost:8000/api/users/?status=ACTIVE
GET http://localhost:8000/api/users/?status=INACTIVE
```

### Expected Response (Success - 200 OK)
```json
[
  {
    "id": 2,
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "phone": "9876543210",
    "role": "STUDENT",
    "status": "ACTIVE",
    "created_at": "2026-02-18T10:30:00Z"
  },
  {
    "id": 4,
    "name": "Alice Johnson",
    "email": "alice.johnson@university.edu",
    "phone": "9876543212",
    "role": "STUDENT",
    "status": "INACTIVE",
    "created_at": "2026-02-18T11:00:00Z"
  }
]
```

---

## Complete Testing Workflow

### Step 1: Setup (Create Resources and Users)
```
1. POST /api/users/ - Create 3 students
2. POST /api/users/ - Create 1 staff
3. POST /api/resources/ - Create 2 labs
4. POST /api/resources/ - Create 2 classrooms
5. POST /api/resources/ - Create 1 event hall
```

### Step 2: Authentication Flow
```
6. POST /api/login/ - Login as student
7. GET /api/users/ - Verify only logged-in user is ACTIVE
8. POST /api/logout/ - Logout
9. GET /api/users/ - Verify user is now INACTIVE
```

### Step 3: Booking Flow
```
10. POST /api/login/ - Login as student
11. POST /api/bookings/ - Create booking
12. GET /api/bookings/ - View all bookings
13. GET /api/bookings/upcoming/ - View upcoming bookings
```

### Step 4: Admin Operations
```
14. POST /api/login/ - Login as admin
15. GET /api/admin/stats/ - View dashboard stats
16. POST /api/bookings/1/approve/ - Approve booking
17. GET /api/bookings/?status=APPROVED - View approved bookings
```

### Step 5: Validation Testing
```
18. POST /api/bookings/ - Try to book same resource/time (should fail)
19. POST /api/bookings/ - Try to book past date (should fail)
20. POST /api/users/ - Try duplicate email (should fail)
21. POST /api/users/ - Try duplicate phone (should fail)
```

---

## Available Time Slots

When creating bookings, use these time slots:
```
08:00 - 09:00
09:00 - 10:00
10:00 - 11:00
11:00 - 12:00
12:00 - 13:00
13:00 - 14:00
14:00 - 15:00
15:00 - 16:00
16:00 - 17:00
```

---

## Resource Types

Valid resource types:
```
LAB
CLASSROOM
EVENT_HALL
COMPUTER
```

---

## User Roles

Valid user roles:
```
STUDENT
STAFF
ADMIN
```

---

## Booking Status

Valid booking statuses:
```
PENDING
APPROVED
REJECTED
```

---

## Resource Status

Valid resource statuses:
```
AVAILABLE
UNAVAILABLE
```

---

## Notes

- Make sure Django server is running on `http://localhost:8000`
- All timestamps are in ISO 8601 format
- User IDs are auto-incremented
- Status automatically changes on login/logout
- Only one user can be ACTIVE at a time
- Bookings cannot be made for past dates or time slots
- Resource and user must exist before creating a booking
- Admin can approve/reject any booking
- Users can only edit/delete their own bookings
- Staff and Admin can manage resources
