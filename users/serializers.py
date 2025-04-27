# users/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email') # Include email if you want
        # You might want to add more fields during registration later

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) # To see user details (read-only)

    class Meta:
        model = UserProfile
        fields = '__all__' # Include all fields from the UserProfile model
        read_only_fields = ('user',) # User should not be updated here