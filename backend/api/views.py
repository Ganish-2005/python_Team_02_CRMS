from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Resource, Booking
from .serializers import UserSerializer, ResourceSerializer, BookingSerializer, LoginSerializer

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                if user.status == 'ACTIVE':
                    user_data = UserSerializer(user).data
                    return Response({
                        'message': 'Login successful',
                        'user': user_data
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'error': 'Account is inactive'
                    }, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'role']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['created_at', 'name']
    
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
