from django.contrib import admin
from .models import User, Resource, Booking

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'email', 'phone', 'role', 'status', 'created_at']
    list_filter = ['role', 'status', 'created_at']
    search_fields = ['name', 'email', 'phone']
    ordering = ['-created_at']

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type', 'capacity', 'status', 'location']
    list_filter = ['type', 'status']
    search_fields = ['name', 'location']
    ordering = ['name']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'resource', 'booking_date', 'time_slot', 'status', 'created_at']
    list_filter = ['status', 'booking_date', 'created_at']
    search_fields = ['user__name', 'resource__name']
    ordering = ['-created_at']
