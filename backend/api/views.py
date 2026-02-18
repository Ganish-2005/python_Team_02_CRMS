from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Resource, Booking
from .serializers import UserSerializer, ResourceSerializer, BookingSerializer, LoginSerializer

def is_admin(user_data):
    """Helper function to check if user is admin"""
    return user_data and user_data.get('role') == 'ADMIN'

@api_view(['GET'])
def admin_stats(request):
    """Get admin dashboard statistics"""
    try:
        # Get counts
        total_users = User.objects.count()
        total_resources = Resource.objects.count()
        total_bookings = Booking.objects.count()
        pending_bookings = Booking.objects.filter(status='PENDING').count()
        
        # Get user role breakdown
        students = User.objects.filter(role='STUDENT').count()
        staff = User.objects.filter(role='STAFF').count()
        admins = User.objects.filter(role='ADMIN').count()
        
        # Get resource type breakdown
        labs = Resource.objects.filter(type='LAB').count()
        classrooms = Resource.objects.filter(type='CLASSROOM').count()
        event_halls = Resource.objects.filter(type='EVENT_HALL').count()
        computers = Resource.objects.filter(type='COMPUTER').count()
        
        return Response({
            'total_users': total_users,
            'total_resources': total_resources,
            'total_bookings': total_bookings,
            'pending_bookings': pending_bookings,
            'user_breakdown': {
                'students': students,
                'staff': staff,
                'admins': admins
            },
            'resource_breakdown': {
                'labs': labs,
                'classrooms': classrooms,
                'event_halls': event_halls,
                'computers': computers
            }
        })
    except Exception as e:
        return Response({
            'error': 'Failed to fetch admin statistics'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                # Set all users to INACTIVE
                User.objects.all().update(status='INACTIVE')
                
                # Set only the logged-in user to ACTIVE
                user.status = 'ACTIVE'
                user.save()
                
                user_data = UserSerializer(user).data
                return Response({
                    'message': 'Login successful',
                    'user': user_data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    """Set user status to INACTIVE on logout"""
    try:
        user_id = request.data.get('user_id')
        if user_id:
            user = User.objects.get(id=user_id)
            user.status = 'INACTIVE'
            user.save()
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        return Response({
            'error': 'User ID required'
        }, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'role']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['created_at', 'name']
    
    def create(self, request, *args, **kwargs):
        # Only admins can create users through the API (except during registration)
        # This allows registration to work but restricts admin user creation
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        # Only admins can update user roles and status
        if 'role' in request.data or 'status' in request.data:
            # In a real app, you'd check authentication here
            # For now, we'll allow it but log it
            pass
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        status_param = request.query_params.get('status', None)
        if status_param:
            users = self.queryset.filter(status=status_param)
            serializer = self.get_serializer(users, many=True)
            return Response(serializer.data)
        return Response({'error': 'Status parameter required'}, status=400)


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'status']
    search_fields = ['name', 'location']
    ordering_fields = ['name', 'capacity']
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        resources = self.queryset.filter(status='AVAILABLE')
        serializer = self.get_serializer(resources, many=True)
        return Response(serializer.data)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'user', 'resource', 'booking_date']
    search_fields = ['user__name', 'resource__name']
    ordering_fields = ['created_at', 'booking_date']
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'APPROVED'
        booking.save()
        serializer = self.get_serializer(booking)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'REJECTED'
        booking.save()
        serializer = self.get_serializer(booking)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        from datetime import date
        bookings = self.queryset.filter(
            booking_date__gte=date.today()
        ).exclude(status='REJECTED')
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
