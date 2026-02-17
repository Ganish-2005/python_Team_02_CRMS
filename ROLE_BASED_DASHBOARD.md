# Role-Based Dashboard

## Overview
The dashboard now displays different content based on whether the logged-in user is a STUDENT or STAFF member.

## Student Dashboard

### Features:
1. **Personalized Welcome Message**
   - "Welcome back, [Student Name]!"
   - "Here's your booking overview"

2. **Student-Specific Statistics**
   - My Bookings (total count)
   - Pending (bookings awaiting approval)
   - Approved (confirmed bookings)
   - Rejected (declined bookings)

3. **Quick Actions**
   - New Booking → Create a new booking
   - My Bookings → View all their bookings
   - Browse Resources → See available resources

4. **Recent Bookings**
   - Shows only the student's own bookings
   - Displays last 5 bookings
   - Shows status (Approved/Pending/Rejected)
   - Shows date and time slot

### What Students Can See:
- ✅ Their own booking statistics
- ✅ Their own recent bookings
- ✅ Quick access to create bookings
- ✅ Browse available resources
- ❌ Cannot see other users' bookings
- ❌ Cannot see total system statistics
- ❌ Cannot access user management

## Staff/Admin Dashboard

### Features:
1. **Personalized Welcome Message**
   - "Welcome back, [Staff Name]!"
   - "System overview and management"

2. **System-Wide Statistics**
   - Total Bookings (all bookings in system)
   - Total Resources (all resources)
   - Total Users (all registered users)
   - Pending Approvals (bookings needing approval)

3. **Quick Actions**
   - Pending Approvals → Review bookings (shows count)
   - Add User → Create new user accounts
   - Add Resource → Add new resources

4. **Recent Bookings**
   - Shows all recent bookings from all users
   - Displays last 5 bookings
   - Shows user name, resource, date, time, and status
   - Can see who made each booking

### What Staff Can See:
- ✅ All system statistics
- ✅ All users' bookings
- ✅ Pending approvals count
- ✅ Quick access to management functions
- ✅ User and resource management
- ✅ Full system overview

## How It Works

### User Detection:
```javascript
// Gets current user from localStorage
const userStr = localStorage.getItem('user');
const user = JSON.parse(userStr);

// Check role
if (user.role === 'STUDENT') {
  // Show student dashboard
} else {
  // Show staff dashboard
}
```

### Data Filtering:
- **Students**: Data is filtered to show only their bookings
  ```javascript
  myBookingsData = bookingsData.filter(b => b.user === user.id);
  ```
- **Staff**: Shows all data without filtering

## Visual Differences

### Student Dashboard:
- Focus on personal bookings
- Simplified statistics (4 cards about their bookings)
- Action buttons for booking and browsing
- Recent bookings show only their own

### Staff Dashboard:
- Focus on system management
- Comprehensive statistics (system-wide data)
- Action buttons for administration tasks
- Recent bookings show all users

## Statistics Breakdown

### Student Stats:
1. **My Bookings** - Total number of bookings made by the student
2. **Pending** - Student's bookings waiting for approval
3. **Approved** - Student's confirmed bookings
4. **Rejected** - Student's declined bookings

### Staff Stats:
1. **Total Bookings** - All bookings in the system
2. **Total Resources** - All resources available
3. **Total Users** - All registered users
4. **Pending Approvals** - All bookings needing approval

## Color Coding

### Student Dashboard:
- My Bookings: Terracotta (primary)
- Pending: Amber (warning)
- Approved: Emerald (success)
- Rejected: Red (error)

### Staff Dashboard:
- Total Bookings: Terracotta
- Total Resources: Amber
- Total Users: Emerald
- Pending Approvals: Blue

## Quick Actions

### Student Actions:
1. **New Booking** (Terracotta) - Direct link to create booking
2. **My Bookings** (Blue) - View all their bookings
3. **Browse Resources** (Emerald) - See available resources

### Staff Actions:
1. **Pending Approvals** (Terracotta) - Review bookings with count
2. **Add User** (Blue) - Create new user accounts
3. **Add Resource** (Emerald) - Add new resources

## Benefits

### For Students:
- Focused view of their own data
- Easy access to booking functions
- Clear status of their bookings
- No clutter from system-wide data

### For Staff:
- Complete system overview
- Quick access to management tasks
- See pending approvals at a glance
- Monitor all user activity

## Testing

### Test as Student:
1. Login with a STUDENT account
2. Dashboard shows:
   - Personal statistics
   - Only your bookings
   - Student-focused actions

### Test as Staff:
1. Login with a STAFF account
2. Dashboard shows:
   - System-wide statistics
   - All bookings
   - Admin-focused actions

## Notes

- User role is determined from the login response
- Data is stored in localStorage after login
- Dashboard automatically adapts based on role
- No manual configuration needed
- Seamless experience for both user types
