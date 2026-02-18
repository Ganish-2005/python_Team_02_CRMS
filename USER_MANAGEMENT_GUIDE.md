# User Management Guide - Admin Operations

## Admin User Management Features

The admin has complete control over user management with full CRUD (Create, Read, Update, Delete) operations.

## Available Operations

### 1. ✅ **View All Users** (READ)
- Navigate to **Users** from the sidebar
- View complete list of all users in the system
- See user details: name, email, phone, role, status, created date
- Filter users by:
  - Role (Student, Staff, All)
  - Status (Active, Inactive, All)
- Search users by name, email, or phone number

### 2. ✅ **Add New User** (CREATE)
- Click **"Add User"** button on Users page
- Fill in user details:
  - Full Name (required)
  - Email Address (required, must be unique)
  - Phone Number (required)
  - Role (Student or Staff)
  - Status (Active or Inactive)
  - Password (required, must meet security requirements)
- Password requirements:
  - At least 8 characters
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One number (0-9)
  - One special character (!@#$%^&*...)
- Click **"Create User"** to save

### 3. ✅ **Edit User** (UPDATE)
- Click the **blue edit icon** (pencil) next to any user
- Modify user details:
  - Name
  - Email
  - Phone
  - Role
  - Status
  - Password (optional - leave blank to keep current password)
- Click **"Update User"** to save changes

### 4. ✅ **Delete User** (DELETE)
- Click the **red delete icon** (trash) next to any user
- Confirm deletion in the popup modal
- User will be permanently removed from the system
- **Warning**: This action cannot be undone

## User Interface Features

### Users List Page
- **Search Bar**: Quick search by name, email, or phone
- **Role Filter**: Filter by Student, Staff, or All
- **Status Filter**: Filter by Active, Inactive, or All
- **Action Buttons**: Edit (blue) and Delete (red) icons for each user
- **User Count**: Shows total and filtered user counts
- **Clear Filters**: Quick button to reset all filters

### Add/Edit User Form
- **Validation**: Real-time form validation
- **Password Strength**: Visual indicator for password requirements
- **Unique Email**: System prevents duplicate email addresses
- **Unique Name**: System prevents duplicate names
- **Cancel Button**: Return to users list without saving
- **Save Button**: Create or update user with loading state

### Delete Confirmation
- **Modal Dialog**: Prevents accidental deletions
- **User Name Display**: Shows which user will be deleted
- **Cancel Option**: Close modal without deleting
- **Confirm Delete**: Permanently remove user
- **Loading State**: Shows progress during deletion

## Access Control

### Admin Only
- Only users with **ADMIN** role can access user management
- Students and Staff cannot see the Users menu
- Direct URL access is blocked for non-admin users

### Protected Operations
- Create: Admin only
- Read: Admin only
- Update: Admin only
- Delete: Admin only

## Best Practices

### When Adding Users
1. Use official university email addresses
2. Set appropriate role (Student vs Staff)
3. Set status to Active for immediate access
4. Use strong passwords that meet all requirements
5. Verify phone number format

### When Editing Users
1. Update password only when necessary
2. Change status to Inactive instead of deleting (preserves history)
3. Verify email uniqueness before changing
4. Update role when user's position changes

### When Deleting Users
1. Consider setting status to Inactive instead
2. Verify user has no active bookings
3. Confirm you're deleting the correct user
4. Understand deletion is permanent

## Common Tasks

### Deactivate a User Account
1. Go to Users page
2. Click edit icon for the user
3. Change Status to "Inactive"
4. Click "Update User"

### Reactivate a User Account
1. Filter by Status: Inactive
2. Click edit icon for the user
3. Change Status to "Active"
4. Click "Update User"

### Reset User Password
1. Click edit icon for the user
2. Enter new password in password field
3. Ensure password meets all requirements
4. Click "Update User"

### Promote User to Staff
1. Click edit icon for the user
2. Change Role to "Staff"
3. Click "Update User"
4. User will now have resource management access

## Error Handling

### Common Errors
- **Duplicate Email**: Email already exists in system
- **Duplicate Name**: Name already exists in system
- **Weak Password**: Password doesn't meet requirements
- **Network Error**: Cannot connect to server
- **Validation Error**: Required fields missing

### Solutions
- Check for existing users before creating
- Use unique email addresses
- Follow password requirements
- Ensure backend server is running
- Fill all required fields

## Security Notes

- Passwords are encrypted in the database
- Admin cannot see existing passwords
- Password changes require meeting security requirements
- Deleted users cannot be recovered
- All operations are logged for audit purposes

## Quick Reference

| Operation | Button/Icon | Location | Access |
|-----------|-------------|----------|--------|
| View Users | "Users" menu | Sidebar | Admin only |
| Add User | "+ Add User" | Users page | Admin only |
| Edit User | Blue pencil icon | User row | Admin only |
| Delete User | Red trash icon | User row | Admin only |
| Search | Search bar | Top of page | Admin only |
| Filter | Dropdown menus | Top of page | Admin only |

## Support

For issues with user management:
1. Verify you're logged in as admin
2. Check backend server is running
3. Verify database connection
4. Check browser console for errors
5. Review error messages in the UI
