# User Registration Validation Rules

## Implemented Validation Rules

### Rule 1: Unique Name (Case-Insensitive)
**Description:** Each user must have a unique name. The system checks for duplicates regardless of letter casing.

**Examples:**
- ❌ INVALID: User "John Doe" exists, trying to create "john doe"
- ❌ INVALID: User "John Doe" exists, trying to create "JOHN DOE"
- ✅ VALID: User "John Doe" exists, creating "Jane Doe"

**Error Message:**
```
A user with this name already exists.
```

### Rule 2: Unique Email (Case-Insensitive)
**Description:** Each user must have a unique email address. The system checks for duplicates regardless of letter casing.

**Examples:**
- ❌ INVALID: User with "john@example.com" exists, trying to create "JOHN@EXAMPLE.COM"
- ❌ INVALID: User with "john@example.com" exists, trying to create "John@Example.com"
- ✅ VALID: User with "john@example.com" exists, creating "jane@example.com"

**Error Message:**
```
A user with this email already exists.
```

### Rule 3: Strong Password Requirements
**Description:** Password must meet all of the following criteria:

1. **Minimum Length**: At least 8 characters
2. **Uppercase Letter**: At least one uppercase letter (A-Z)
3. **Lowercase Letter**: At least one lowercase letter (a-z)
4. **Number**: At least one digit (0-9)
5. **Special Character**: At least one special character (!@#$%^&*(),.?":{}|<>)

**Examples:**
- ❌ INVALID: "password" (no uppercase, no number, no special char)
- ❌ INVALID: "Password" (no number, no special char)
- ❌ INVALID: "Password1" (no special char)
- ❌ INVALID: "Pass1!" (less than 8 characters)
- ✅ VALID: "Password1!"
- ✅ VALID: "MyP@ssw0rd"
- ✅ VALID: "Secure#123"

**Error Messages:**
```
Password must be at least 8 characters long.
Password must contain at least one uppercase letter (A-Z).
Password must contain at least one lowercase letter (a-z).
Password must contain at least one number (0-9).
Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).
```

## Implementation Details

### Backend Validation (Django)
Location: `backend/api/serializers.py` - `UserSerializer`

**Methods:**
1. `validate_name()` - Checks for duplicate names (case-insensitive)
2. `validate_email()` - Checks for duplicate emails (case-insensitive)
3. `validate_password()` - Validates password strength using regex patterns

**Features:**
- Uses `__iexact` lookup for case-insensitive comparison
- Excludes current instance when updating (allows keeping same name/email)
- Uses Python `re` module for pattern matching
- Returns specific error messages for each validation failure

### Frontend Validation (React)
Locations:
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/pages/AddUserPage.jsx`

**Features:**
- Real-time password strength indicator
- Visual feedback with checkmarks (✓) and crosses (✗)
- Color-coded messages (green for valid, red for invalid)
- Client-side validation before API call
- Displays all password requirements dynamically

## User Experience

### Password Strength Indicator
When a user types a password, they see:
- A blue box with password requirements
- Red ✗ marks for unmet requirements
- Green ✓ checkmark when all requirements are met
- Real-time updates as they type

### Error Handling
- Backend validation errors are caught and displayed
- User-friendly error messages
- Form stays filled (user doesn't lose their input)
- Clear indication of what needs to be fixed

## Testing the Validation

### Test Case 1: Duplicate Name
1. Create user: Name "John Doe", Email "john@example.com"
2. Try to create: Name "john doe", Email "jane@example.com"
3. Expected: Error "A user with this name already exists."

### Test Case 2: Duplicate Email
1. Create user: Name "John Doe", Email "john@example.com"
2. Try to create: Name "Jane Doe", Email "JOHN@EXAMPLE.COM"
3. Expected: Error "A user with this email already exists."

### Test Case 3: Weak Password (No Uppercase)
1. Try to register with password: "password123!"
2. Expected: Error "Password must contain at least one uppercase letter (A-Z)."

### Test Case 4: Weak Password (Too Short)
1. Try to register with password: "Pass1!"
2. Expected: Error "Password must be at least 8 characters long."

### Test Case 5: Strong Password
1. Register with password: "MyP@ssw0rd123"
2. Expected: Success - all requirements met

### Test Case 6: Valid Registration
1. Register with:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "SecurePass123!"
2. Expected: Registration successful

## Security Benefits

1. **Prevents Duplicate Accounts**: Users can't create multiple accounts with same name/email
2. **Strong Passwords**: Reduces risk of brute-force attacks
3. **Case-Insensitive Checks**: Prevents bypass attempts using different casing
4. **Client + Server Validation**: Double layer of protection
5. **Clear Feedback**: Users know exactly what's required

## Notes

- Password validation happens on both client and server side
- Name and email uniqueness is enforced at database level (unique constraint on email)
- Passwords are hashed using Django's built-in password hashers before storage
- Validation applies to both registration and user creation by admins
