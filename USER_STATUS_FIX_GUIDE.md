# User Status Fix Guide

## Problem
All users are showing as ACTIVE because they were created with ACTIVE status by default. The new login logic will set only the logged-in user to ACTIVE, but existing users need to be updated first.

## Solution

### Option 1: Run the Fix Script (Recommended)

1. Open a terminal in the `backend` folder
2. Run the fix script:
   ```bash
   python fix_user_status.py
   ```
   
   Or on Windows, double-click:
   ```
   fix_user_status.bat
   ```

This will set all users to INACTIVE immediately.

### Option 2: Manual Database Update

If you prefer to do it manually:

1. Open a terminal in the `backend` folder
2. Run Django shell:
   ```bash
   python manage.py shell
   ```
3. Execute these commands:
   ```python
   from api.models import User
   User.objects.all().update(status='INACTIVE')
   exit()
   ```

## How It Works After Fix

1. **All users start as INACTIVE** (after running the fix script)
2. **When a user logs in:**
   - All users are set to INACTIVE
   - Only the logged-in user is set to ACTIVE
3. **When a user logs out:**
   - That user is set to INACTIVE
4. **Result:** Only one user can be ACTIVE at a time (the currently logged-in user)

## Verification

After running the fix script:

1. Go to the Users page in the admin panel
2. All users should show as INACTIVE
3. Log out and log back in as Admin
4. Admin should now show as ACTIVE, all others as INACTIVE
5. Log in as a different user
6. That user should be ACTIVE, Admin should become INACTIVE

## Important Notes

- This is a one-time fix for existing users
- New users created through registration will be ACTIVE by default, but will become INACTIVE when another user logs in
- The login system automatically manages user status from now on
- Only one user can be ACTIVE at any given time
