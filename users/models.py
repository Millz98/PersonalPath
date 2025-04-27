# users/models.py

from django.db import models
from django.contrib.auth.models import User  # Django's built-in user model

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    age = models.IntegerField()
    height_cm = models.IntegerField()
    current_weight_kg = models.FloatField()
    country = models.CharField(max_length=100)
    province = models.CharField(max_length=100)

    # Physical Considerations (using a TextField for flexibility, can be refined later)
    physical_issues = models.TextField(blank=True, null=True)

    # Fitness Resources
    has_gym_membership = models.BooleanField(default=False)
    home_equipment = models.TextField(blank=True, null=True) # e.g., "dumbbells, resistance bands"

    # Nutritional Preferences
    dietary_preferences = models.CharField(max_length=100, blank=True, null=True) # e.g., "vegetarian", "vegan", "keto"
    food_allergies = models.TextField(blank=True, null=True)
    disliked_foods = models.TextField(blank=True, null=True)

    activity_level = models.CharField(
        max_length=50,
        choices=[
            ('sedentary', 'Sedentary'),
            ('lightly_active', 'Lightly Active'),
            ('moderately_active', 'Moderately Active'),
            ('very_active', 'Very Active'),
        ],
        default='sedentary'
    )
    weight_loss_goal_kg = models.FloatField(blank=True, null=True)
    desired_loss_rate = models.CharField(max_length=50, blank=True, null=True) # e.g., "0.5 kg per week"

    def __str__(self):
        return self.user.username
