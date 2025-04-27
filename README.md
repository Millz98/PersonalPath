# PersonalPath

A full-stack web application built with Django REST Framework and React, designed to help users manage their personal development path.

## Project Overview

PersonalPath is a web application that combines a Django backend with a React frontend to create a platform where users can:
- Register and authenticate
- Create and manage their user profiles
- Track their personal development goals
- Manage their learning path

### Tech Stack

**Backend:**
- Django 4.2+
- Django REST Framework
- SimpleJWT for authentication
- SQLite database (default)
- CORS headers for frontend communication

**Frontend:**
- React
- React Router for navigation
- Context API for state management
- Modern CSS for styling

## Project Structure

```
personalpath_project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context (auth)
│   │   └── App.js          # Main React component
├── users/                   # Django users app
│   ├── models.py           # User models
│   ├── views.py            # API views
│   ├── urls.py             # API endpoints
│   └── serializers.py      # Data serializers
├── personalpath_project/    # Django project settings
├── manage.py               # Django management script
└── requirements.txt        # Python dependencies
```

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
- `/api/users/profile/` - User profile management

## Development

### Backend Development

- Models are defined in `users/models.py`
- API views are in `users/views.py`
- URL routing is configured in `users/urls.py`
- Project settings are in `personalpath_project/settings.py`

### Frontend Development

- Components are in `frontend/src/components/`
- Authentication context is in `frontend/src/context/`
- Main application logic is in `frontend/src/App.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 