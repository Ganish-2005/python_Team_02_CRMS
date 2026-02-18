# How to Apply Phone Uniqueness Migration

## Problem
You're getting a 400 Bad Request error when trying to create users because the database hasn't been updated with the phone uniqueness constraint yet.

## Solution

Follow these steps to apply the migration:

### Step 1: Stop the Django Server
1. Go to the terminal where Django is running
2. Press `CTRL+C` to stop the server

### Step 2: Apply the Migration

**Option A: Using the batch script (Windows)**
```bash
cd backend
apply_phone_migration.bat
```

**Option B: Manual command**
```bash
cd backend
python manage.py migrate
```

### Step 3: Restart the Django Server
```bash
python manage.py runserver
```

## What This Migration Does

The migration adds a unique constraint to the `phone` field in the users table, ensuring that:
- No two users can have the same phone number
- Email addresses remain unique (already enforced)
- Names can be duplicated (multiple users can have the same name)

## After Migration

Once the migration is applied, the registration and user creation will work with these rules:
- ✅ Same name is allowed
- ❌ Same email is blocked with error: "A user with this email already exists."
- ❌ Same phone is blocked with error: "A user with this phone number already exists."

## Troubleshooting

### If you get "duplicate key" error during migration
This means you already have users with duplicate phone numbers in the database. You'll need to:

1. Check for duplicates:
```bash
python manage.py shell
```
```python
from api.models import User
from django.db.models import Count

# Find duplicate phone numbers
duplicates = User.objects.values('phone').annotate(count=Count('phone')).filter(count__gt=1)
for dup in duplicates:
    print(f"Phone {dup['phone']} appears {dup['count']} times")
    users = User.objects.filter(phone=dup['phone'])
    for user in users:
        print(f"  - {user.name} ({user.email})")
```

2. Update duplicate phone numbers manually before running the migration
