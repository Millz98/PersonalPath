// src/App.js
import React from 'react';
// Import routing components
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page/layout components
import Register from './components/Register';
import ProfileForm from './components/ProfileForm';
import Login from './components/Login'; // Ensure this component exists
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
  };

  return (
    // Assuming Router is here. If it's in index.js, remove <Router> and </Router> from this file.
    <Router>
      <div className="App">
        {/* Use header for title and conditional logout button */}
        <header className="App-header" style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee', position: 'relative', minHeight: '50px' /* Ensure header has height */ }}>
          <h1>Welcome to PersonalPath</h1>

          {/* Display Logout button only if user is logged in */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              style={{ /* Basic styling, replace with proper CSS later */
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '8px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
               }}
            >
              Logout
            </button>
          )}
        </header> {/* <<< Closing </header> tag */}

        {/* Use main for the routed page content */}
        <main>
          <Routes>
            {/* --- Public Routes --- */}
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate replace to="/profile" /> : <Login />}
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate replace to="/profile" /> : <Register />}
            />

            {/* --- Protected Routes --- */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileForm />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}

            {/* --- Default Route --- */}
            <Route
              path="/"
              element={
                isLoggedIn
                  ? <Navigate replace to="/profile" />
                  : <Navigate replace to="/login" />
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
      </div> {/* <<< Closing </div> tag for className="App" */}
    </Router> // Closing </Router> tag
  ); // End of return statement
} // End of App function

export default App;