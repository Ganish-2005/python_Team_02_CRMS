from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ResourceViewSet, BookingViewSet, login, logout, admin_stats

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('admin/stats/', admin_stats, name='admin_stats'),
]
