# users/urls.py

from django.urls import path
from .views import UserCreate, UserProfileCreateUpdate
from rest_framework_simplejwt.views import TokenObtainPairView # Import

urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    path('profile/', UserProfileCreateUpdate.as_view(), name='profile'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]