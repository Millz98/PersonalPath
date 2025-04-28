// src/App.js
import React from 'react';
// Import routing components
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page/layout components
import Register from './components/Register';
import ProfileForm from './components/ProfileForm';
import Login from './components/Login';         // Ensure this component exists
import ProtectedRoute from './components/ProtectedRoute'; // Import the wrapper

// Import authentication context hook - Only need isLoggedIn for routing
import { useAuth } from './context/AuthContext'; // Adjust path if needed

// Optional global styles
import './App.css';

function App() {
  // Get authentication status for conditional routing logic
  // We no longer need the logout function directly in App.js
  const { isLoggedIn } = useAuth();

  // handleLogout function is REMOVED from App.js

  return (
    // Assuming Router wraps AuthProvider and App in index.js is common.
    // If not, ensure <Router> is placed appropriately.
    <Router>
      <div className="App">
        {/* Header - Logout button is removed */}
        <header
          className="App-header"
          style={{
            display: 'flex',
            // Changed justify content to center since only title is here now
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #eee',
            marginBottom: '20px'
          }}
        >
          {/* Title */}
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            Welcome to PersonalPath
          </h1>

          {/* Logout button is REMOVED from the header */}

        </header>

        {/* Main content area where routed components will render */}
        <main>
          <Routes>
            {/* --- Public Routes --- */}
            {/* If logged in, redirect away from login page to profile */}
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate replace to="/profile" /> : <Login />}
            />
            {/* If logged in, redirect away from register page to profile */}
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate replace to="/profile" /> : <Register />}
            />

            {/* --- Protected Routes --- */}
            {/* Profile route is protected */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute> {/* Ensures user is logged in */}
                  <ProfileForm /> {/* Renders the form (which now contains logout button) */}
                </ProtectedRoute>
              }
            />
            {/* Add other protected routes later */}
            {/* e.g., <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}

            {/* --- Default Route --- */}
            {/* Redirects based on login status */}
            <Route
              path="/"
              element={
                isLoggedIn
                  ? <Navigate replace to="/profile" /> // Logged in -> Profile
                  : <Navigate replace to="/login" />   // Logged out -> Login
              }
            />

            {/* --- Catch-all 404 Route --- */}
            <Route path="*" element={
              <div>
                <h2>404 - Page Not Found</h2>
                <p>Sorry, the page you are looking for does not exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;