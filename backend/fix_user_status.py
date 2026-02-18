"""
Script to set all users to INACTIVE except the admin
Run this once to fix existing user statuses
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_rms.settings')
django.setup()

from api.models import User

# Set all users to INACTIVE
User.objects.all().update(status='INACTIVE')

print("All users have been set to INACTIVE")
print("When a user logs in, they will be set to ACTIVE automatically")
