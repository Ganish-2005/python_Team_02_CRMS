from rest_framework import serializers
from .models import User, Resource, Booking
import re

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'phone', 'role', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate_password(self, value):
        """
        Validate password strength:
        - At least 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one number
        - At least one special character
        """
        if not value:
            return value
            
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )
        
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter (A-Z)."
            )
        
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter (a-z)."
            )
        
        if not re.search(r'\d', value):
            raise serializers.ValidationError(
                "Password must contain at least one number (0-9)."
            )
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError(
                "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)."
            )
        
        return value
    
    def validate_name(self, value):
        """
        Validate that name is unique (case-insensitive)
        """
        # For updates, exclude the current instance
        queryset = User.objects.filter(name__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError(
                "A user with this name already exists."
            )
        
        return value
    
    def validate_email(self, value):
        """
        Validate that email is unique (case-insensitive)
        """
        # For updates, exclude the current instance
        queryset = User.objects.filter(email__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'name', 'type', 'capacity', 'status', 'location']
        read_only_fields = ['id']


class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    resource_name = serializers.CharField(source='resource.name', read_only=True)
    resource_type = serializers.CharField(source='resource.type', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'user', 'user_name', 'resource', 'resource_name', 
                  'resource_type', 'booking_date', 'time_slot', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate(self, data):
        # Only validate for new bookings (not updates)
        if self.instance is None:
            # Rule 1: Check if resource is already booked for this time slot
            resource_conflict = Booking.objects.filter(
                resource=data['resource'],
                booking_date=data['booking_date'],
                time_slot=data['time_slot']
            ).exclude(status='REJECTED').first()
            
            if resource_conflict:
                raise serializers.ValidationError({
                    'resource': 'This resource is already booked for the selected date and time slot.'
                })
            
            # Rule 2: Check if user already has a booking at the same time
            user_conflict = Booking.objects.filter(
                user=data['user'],
                booking_date=data['booking_date'],
                time_slot=data['time_slot']
            ).exclude(status='REJECTED').first()
            
            if user_conflict:
                raise serializers.ValidationError({
                    'user': 'You already have a booking at this time slot. One user cannot make two bookings at the same time.'
                })
        
        return data
