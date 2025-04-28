# PersonalPath

A sophisticated full-stack fitness application that delivers personalized weight loss and workout plans based on individual user circumstances, preferences, and location. Built with Django REST Framework and React, PersonalPath creates a truly customized fitness journey for each user.

## Project Overview

PersonalPath is an intelligent fitness platform that combines comprehensive user profiling with advanced algorithms to create personalized weight loss solutions. The application features:

### 1. Personalized Profile Creation
- **Demographic Data**: Capture age, height, weight, and gender
- **Location-Based Customization**: Tailored recommendations based on user's country/province
- **Physical Assessment**: 
  - Existing conditions or limitations
  - Current fitness level
  - Available fitness equipment
  - Gym membership status
- **Dietary Preferences**: 
  - Dietary restrictions (vegetarian, vegan, keto, etc.)
  - Food allergies
  - Food preferences/dislikes
- **Goal Setting**: Target weight and preferred loss rate
- **Modern UI/UX**: 
  - Sleek dark theme with fitness-inspired accents
  - Animated step-by-step profile creation
  - Interactive progress tracking

### 2. Intelligent Workout Planning
- **Algorithm-Driven Routines**: Customized based on user profile
- **Adaptive Programming**: 
  - Accommodates physical limitations
  - Scales with user progress
  - Equipment-aware workout selection
- **Balanced Training**: 
  - Combined cardiovascular and strength elements
  - Progressive difficulty scaling
  - Injury-prevention focused

### 3. Location-Aware Nutrition Planning
- **Regional Food Integration**: 
  - Local food availability consideration
  - Region-specific healthy alternatives
- **Personalized Meal Plans**:
  - Dietary preference compliance
  - Allergen exclusion
  - Caloric and macronutrient optimization
- **Workout-Synchronized**: Nutrition timing and content aligned with exercise schedule

### Tech Stack

**Backend:**
- Django 4.2+
- Django REST Framework
- SimpleJWT for secure authentication
- SQLite database (default)
- CORS headers for frontend communication

**Frontend:**
- React
- React Router for navigation
- Context API for state management
- Modern CSS for sophisticated, responsive design
- Interactive form components
- Progress visualization tools

## Project Structure

```
personalpath_project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components (Profile, Workouts, Nutrition)
│   │   ├── context/         # Application state management
│   │   ├── algorithms/      # Workout and nutrition planning logic
│   │   └── App.js          # Main React component
├── users/                   # Django users app
│   ├── models.py           # User, Profile, and Preference models
│   ├── views.py            # API views for user data
│   ├── urls.py             # API endpoints
│   └── serializers.py      # Data serializers
├── personalpath_project/    # Django project settings
├── manage.py               # Django management script
└── requirements.txt        # Python dependencies
```

## Features

### Current Implementation
- **Comprehensive User Profiling**: Detailed personal information collection
- **Secure Authentication**: Protected user data and sessions
- **Profile Management**: Update and maintain fitness profiles
- **Location-Based Customization**: Regional food and activity recommendations

### Planned Features
- **Intelligent Plan Generation**: Algorithm-driven workout and nutrition planning
- **Progress Tracking**: Weight, measurements, and workout logging
- **Adaptive Programming**: Plan adjustments based on user progress
- **Notification System**: Workout and meal reminders
- **Feedback Integration**: Plan refinement based on user feedback

## Setup Instructions

### Prerequisites

- Python 3.x
- Node.js and npm/yarn
- Git

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Millz98/PersonalPath.git
   cd PersonalPath
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   .\venv\Scripts\Activate.ps1 (if you are on windows)
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   # Using yarn (recommended)
   yarn install

   # Or using npm
   npm install
   ```

3. Start the React development server:
   ```bash
   # Using yarn
   yarn start

   # Or using npm
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## API Endpoints

- `/api/users/register/` - User registration
- `/api/users/login/` - User authentication (JWT token)
- `/api/users/profile/` - Comprehensive user profile management
- `/api/users/preferences/` - Dietary and workout preferences
- `/api/workouts/generate/` - Personalized workout plan generation
- `/api/nutrition/generate/` - Customized meal plan creation
- `/api/progress/` - Progress tracking and logging

## Development

### Backend Development
- Models for user profiles, preferences, and progress tracking
- Algorithms for workout and nutrition plan generation
- API endpoints for data management and plan generation
- Location-based data integration

### Frontend Development
- Interactive profile creation wizard
- Dynamic workout and nutrition plan displays
- Progress tracking visualizations
- Location-aware components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 
