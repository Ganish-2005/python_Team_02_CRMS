# Booking Logic Rules

## Implemented Validation Rules

### Rule 1: No Double-Booking of Resources
**Description:** One resource cannot be booked twice for the same date and time slot.

**Example:**
- ❌ INVALID: User A books "Physics Lab 101" for "2024-03-15" at "09:00 - 10:00"
- ❌ INVALID: User B tries to book "Physics Lab 101" for "2024-03-15" at "09:00 - 10:00"
- ✅ VALID: User B can book "Physics Lab 101" for "2024-03-15" at "10:00 - 11:00" (different time)
- ✅ VALID: User B can book "Chemistry Lab 202" for "2024-03-15" at "09:00 - 10:00" (different resource)

**Error Message:**
```
This resource is already booked for the selected date and time slot.
```

### Rule 2: No Simultaneous Bookings for Same User
**Description:** One user cannot make two bookings at the same time slot.

**Example:**
- ❌ INVALID: User A books "Physics Lab 101" for "2024-03-15" at "09:00 - 10:00"
- ❌ INVALID: User A tries to book "Chemistry Lab 202" for "2024-03-15" at "09:00 - 10:00"
- ✅ VALID: User A can book "Chemistry Lab 202" for "2024-03-15" at "10:00 - 11:00" (different time)
- ✅ VALID: User B can book "Chemistry Lab 202" for "2024-03-15" at "09:00 - 10:00" (different user)

**Error Message:**
```
You already have a booking at this time slot. One user cannot make two bookings at the same time.
```

## Implementation Details

### Backend (Django)
Location: `backend/api/serializers.py` - `BookingSerializer.validate()`

The validation checks:
1. Filters existing bookings by resource, date, and time slot (excluding REJECTED bookings)
2. Filters existing bookings by user, date, and time slot (excluding REJECTED bookings)
3. Raises validation error if conflicts are found

### Frontend (React)
Location: `frontend/src/pages/AddBookingPage.jsx`

The error handling:
1. Catches validation errors from the API
2. Displays user-friendly error messages
3. Scrolls to top to show the error
4. Allows user to modify their booking and try again

## Testing the Logic

### Test Case 1: Resource Double-Booking
1. Create a booking: User "John" books "Physics Lab 101" on "2024-03-20" at "09:00 - 10:00"
2. Try to create: User "Jane" books "Physics Lab 101" on "2024-03-20" at "09:00 - 10:00"
3. Expected: Error message about resource already being booked

### Test Case 2: User Simultaneous Bookings
1. Create a booking: User "John" books "Physics Lab 101" on "2024-03-20" at "09:00 - 10:00"
2. Try to create: User "John" books "Chemistry Lab 202" on "2024-03-20" at "09:00 - 10:00"
3. Expected: Error message about user already having a booking at that time

### Test Case 3: Valid Booking (Different Time)
1. Create a booking: User "John" books "Physics Lab 101" on "2024-03-20" at "09:00 - 10:00"
2. Try to create: User "John" books "Chemistry Lab 202" on "2024-03-20" at "10:00 - 11:00"
3. Expected: Booking created successfully

### Test Case 4: Valid Booking (Different User)
1. Create a booking: User "John" books "Physics Lab 101" on "2024-03-20" at "09:00 - 10:00"
2. Try to create: User "Jane" books "Chemistry Lab 202" on "2024-03-20" at "09:00 - 10:00"
3. Expected: Booking created successfully

## Notes

- Rejected bookings (status='REJECTED') are excluded from conflict checks
- This allows users to rebook resources/times that were previously rejected
- The validation only applies to new bookings, not updates to existing bookings
