// src/App.js
import React from 'react';
// Import routing components
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page/layout components
import Register from './components/Register';
import ProfileForm from './components/ProfileForm';
import Login from './components/Login';         // Ensure this component exists
import ProtectedRoute from './components/ProtectedRoute'; // Import the wrapper

// Import authentication context hook
import { useAuth } from './context/AuthContext'; // Adjust path if needed

// Optional global styles
import './App.css';

function App() {
  // Get authentication status and logout function from the context
  const { isLoggedIn, logout } = useAuth();

  // Handler for the logout button
  const handleLogout = () => {
    logout();
    // Navigation after logout is usually handled by ProtectedRoute checks
    // or could be explicitly done here using useNavigate() if needed.
  };

  return (
    // Assuming Router wraps AuthProvider and App in index.js is common.
    // If not, ensure <Router> is placed appropriately (e.g., here or in index.js).
    // For this example, we include Router here.
    <Router>
      <div className="App">
        {/* Header with Flexbox for layout */}
        <header
          className="App-header"
          style={{
            display: 'flex',            // Use flexbox for layout
            justifyContent: 'space-between', // Pushes title left, button right
            alignItems: 'center',       // Vertically aligns title and button
            padding: '1rem 1.5rem',       // Add some padding around header content
            borderBottom: '1px solid #eee',
            marginBottom: '20px'
          }}
        >
          {/* Title - Remove default margin for better flex alignment */}
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            Welcome to PersonalPath
          </h1>

          {/* Conditionally render Logout button if logged in */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              style={{
                // Style for button within flex container (no absolute positioning)
                padding: '8px 12px',        // Adjust padding as needed
                fontSize: '0.9rem',         // Adjust font size as needed
                backgroundColor: '#f44336', // Example logout button color
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '1rem'         // Space between title and button
              }}
            >
              Logout
            </button>
          )}
        </header>

        {/* Main content area where routed components will render */}
        <main>
          <Routes>
            {/* --- Public Routes --- */}
            {/* Redirect logged-in users away from login/register */}
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate replace to="/profile" /> : <Login />}
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate replace to="/profile" /> : <Register />}
            />

            {/* --- Protected Routes --- */}
            {/* Use ProtectedRoute to guard access */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileForm />
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