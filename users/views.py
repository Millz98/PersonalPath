# users/views.py

from django.contrib.auth.models import User
# Import get_object_or_404 for potentially cleaner object fetching if needed elsewhere
# from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status # Added status for potential custom responses
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer

# View for creating (registering) a new user
class UserCreate(generics.CreateAPIView):
    """
    API endpoint that allows users to be created (registration).
    Uses the UserSerializer which handles password hashing and profile creation.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # Allow any user (authenticated or not) to access this endpoint to register
    permission_classes = [permissions.AllowAny]

# View for retrieving and updating the profile of the currently authenticated user
class UserProfileDetailView(generics.RetrieveUpdateAPIView): # Renamed for clarity
    """
    API endpoint that allows the authenticated user's profile to be retrieved or updated.
    Handles GET (retrieve) and PUT/PATCH (update) requests.
    Ensures a profile exists by using get_or_create with defaults.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    # Ensure only authenticated users can access this endpoint
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Override get_object to return the UserProfile associated with the
        currently authenticated user (self.request.user).
        Uses get_or_create with defaults to handle cases where a profile
        might not exist yet (e.g., for users created before profile logic).
        """
        user = self.request.user

        # --- Define default values for REQUIRED UserProfile fields ---
        # These values are used ONLY if a new profile needs to be created.
        # List all fields in UserProfile model that are NOT NULL and don't have a model default.
        defaults_for_create = {
            'age': 0, # Using 0 as a placeholder - consider making model field nullable instead
            'height_cm': 0,
            'current_weight_kg': 0.0,
            'country': 'Not Set', # Placeholder string
            'province': 'Not Set', # Placeholder string
            # Add any other REQUIRED fields from your UserProfile model here
            # e.g., 'activity_level': 'sedentary', if it didn't have a model default
        }
        # --- End defaults ---

        # Attempt to get the profile, or create it using the user and defaults
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults=defaults_for_create # Pass the defaults dictionary
        )

        # Log if a profile was created on the fly (useful for debugging)
        if created:
            print(f"UserProfile created automatically with defaults for {user.username}")

        # Return the retrieved or newly created profile instance
        return profile

    # Optional: Override update methods if you need custom logic during update
    # def update(self, request, *args, **kwargs):
    #     # Standard update logic is usually sufficient
    #     return super().update(request, *args, **kwargs)
    #
    # def partial_update(self, request, *args, **kwargs):
    #     # Standard partial update logic is usually sufficient
    #     return super().partial_update(request, *args, **kwargs)