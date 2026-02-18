# Campus RMS - Admin Guide

## Admin User Setup

The system now supports a single admin user with full control over all operations.

### Default Admin Credentials
- **Email**: admin@campus.edu
- **Password**: Admin@123
- **Role**: ADMIN

### Creating Additional Admin Users
To create a new admin user, run:
```bash
cd backend
python manage.py create_admin --name "Admin Name" --email "admin@example.com" --password "SecurePassword123" --phone "+1234567890"
```

## Admin Capabilities

### 1. Booking Management
- **View all bookings**: See bookings from all users
- **Approve bookings**: Click the green checkmark button on pending bookings
- **Reject bookings**: Click the red X button on pending bookings
- **Real-time updates**: Booking list refreshes automatically after approval/rejection

### 2. Resource Management
- **Add resources**: Create new labs, classrooms, event halls, and computers
- **Edit resources**: Modify existing resource details
- **Delete resources**: Remove resources from the system
- **View all resources**: See complete resource inventory

### 3. User Management
- **View all users**: See all registered students and staff
- **Add users**: Create new user accounts
- **Edit users**: Modify user details and roles
- **Manage user status**: Activate/deactivate user accounts

### 4. Dashboard Features
- **System overview**: View total counts of users, resources, and bookings
- **Pending approvals**: Quick access to bookings awaiting approval
- **Admin badge**: Visual indicator showing admin status
- **Quick actions**: Direct links to common admin tasks

## Admin Interface Features

### Navigation
- **Admin Panel indicator**: Shows "Admin Panel" badge in sidebar
- **Role-based navigation**: Only admins see user and resource management options
- **Quick actions**: Admin-specific buttons for adding resources

### Dashboard
- **Administrator badge**: Shows admin role prominently
- **Enhanced stats**: Additional management options
- **Priority actions**: Booking approvals highlighted at the top

### Booking Approval Workflow
1. Navigate to Bookings page
2. Find pending bookings (yellow "PENDING" status)
3. Click green checkmark (✓) to approve
4. Click red X (✗) to reject
5. Status updates immediately

## Security Notes

- Only users with ADMIN role can approve/reject bookings
- Admin controls are hidden from regular users
- Resource and user management restricted to admins
- Admin creation requires backend command access

## User Roles

1. **STUDENT**: Can only create and view own bookings
2. **STAFF**: Can create bookings AND add/manage resources
3. **ADMIN**: Full system control - approve bookings, manage resources and users (only one exists)

## Role Permissions Breakdown

### Student Permissions
- ✅ Create bookings
- ✅ View own bookings
- ❌ Cannot add resources
- ❌ Cannot approve bookings
- ❌ Cannot manage users

### Staff Permissions
- ✅ Create bookings
- ✅ View own bookings
- ✅ Add resources
- ✅ Edit resources
- ✅ Delete resources
- ❌ Cannot approve bookings
- ❌ Cannot manage users

### Admin Permissions (Only One)
- ✅ Approve/reject all bookings
- ✅ Create bookings
- ✅ Add/edit/delete resources
- ✅ Add/edit/delete users
- ✅ Full system control

## Getting Started as Admin

1. Login with admin credentials
2. You'll see the admin dashboard with system overview
3. Use "Pending Approvals" to review and approve bookings
4. Use "Add Resource" to add new resources to the system
5. Use "Manage Users" to view and manage all user accounts

## Getting Started as Staff

1. Login with staff credentials
2. You'll see the staff dashboard with "Staff Portal" badge
3. Use "Add Resource" to add new resources to the system
4. Use "Manage Resources" to view and edit resources
5. Create bookings for yourself when needed

The admin has complete control over the Campus Resource Management System and is responsible for approving all booking requests and maintaining the resource inventory.