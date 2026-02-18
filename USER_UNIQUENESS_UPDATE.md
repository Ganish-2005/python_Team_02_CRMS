# User Registration Uniqueness Rules Update

## Changes Made

Updated the user registration validation to allow duplicate names but enforce uniqueness for email and phone numbers.

## Validation Rules

### Name Field
- **Allows duplicates**: Multiple users can have the same name
- **Validation**: Only checks that name is not empty

### Email Field
- **Must be unique**: No two users can have the same email address
- **Case-insensitive**: Email comparison ignores case (e.g., "user@example.com" and "USER@example.com" are considered the same)
- **Error message**: "A user with this email already exists."

### Phone Number Field
- **Must be unique**: No two users can have the same phone number
- **Error message**: "A user with this phone number already exists."

## Files Modified

### Backend Changes

1. **backend/api/models.py**
   - Added `unique=True` constraint to the `phone` field in the User model
   - Email field already had `unique=True`

2. **backend/api/serializers.py**
   - Removed name uniqueness validation (now allows duplicate names)
   - Kept email uniqueness validation (case-insensitive)
   - Added phone number uniqueness validation

3. **backend/api/migrations/0003_add_phone_unique_constraint.py**
   - New migration to add unique constraint to phone field in database

## How to Apply Changes

1. Stop the Django development server if running
2. Run the migration:
   ```bash
   cd backend
   python manage.py migrate
   ```
3. Restart the Django server:
   ```bash
   python manage.py runserver
   ```

## Testing

### Allowed Scenarios
- ✅ Two users with the same name but different email and phone
- ✅ Updating a user without changing their email or phone

### Blocked Scenarios
- ❌ Registering with an email that already exists
- ❌ Registering with a phone number that already exists
- ❌ Updating a user to use another user's email
- ❌ Updating a user to use another user's phone number

## Error Messages

When attempting to register or update with duplicate values:

- **Duplicate Email**: "A user with this email already exists."
- **Duplicate Phone**: "A user with this phone number already exists."

These error messages will appear on the registration/edit page without popup alerts.
