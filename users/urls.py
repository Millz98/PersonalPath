# users/urls.py

from django.urls import path
# --- Import the CORRECT view name ---
from .views import UserCreate, UserProfileDetailView
# --- Import the JWT view ---
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    # --- Use the CORRECT view name here too ---
    path('profile/', UserProfileDetailView.as_view(), name='profile'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]