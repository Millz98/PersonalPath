// src/components/Login.js
import React, { useState } from 'react'; // Remove useContext
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if necessary

const Login = () => {
  // State for form inputs, error messages, and loading status
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Get the login function from your authentication context
  const { login } = useAuth();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default browser form submission
    setError('');           // Clear previous errors
    setIsLoading(true);     // Set loading state to true

    try {
      // Make the API call to the backend login endpoint
      const response = await axios.post('/api/users/login/', {
        username,
        password,
      });

      // Check if the response includes the expected access and refresh tokens
      if (response.data && response.data.access && response.data.refresh) {
        const { access, refresh } = response.data;

        // Call the login function provided by AuthContext.
        // This function is responsible for storing tokens (e.g., in localStorage)
        // and updating the global application state (e.g., setting isLoggedIn = true).
        login(access, refresh);

        console.log('Login successful');
        // Navigate the user to their profile page (or dashboard) after successful login
        navigate('/profile');

      } else {
        // Handle cases where the server response is successful (status 2xx)
        // but doesn't contain the expected tokens.
        setError('Login failed: Invalid response from server.');
      }

    } catch (err) { // Handle errors during the API call
      console.error('Login error:', err.response ? err.response.data : err.message);

      // Provide specific feedback based on the error response
      if (err.response && err.response.status === 401) {
        // HTTP 401 Unauthorized usually means invalid credentials
        setError('Login failed: Invalid username or password.');
      } else if (err.response && err.response.data && err.response.data.detail) {
        // Handle specific error messages provided in the 'detail' field by DRF/SimpleJWT
        setError(`Login failed: ${err.response.data.detail}`);
      }
      // --- Fallback 'else' block for other errors ---
      else {
        // Generic error for network problems, server errors (5xx), etc.
        setError('Login failed. Please check your connection and try again.');
      }
      // --- End of fallback 'else' block ---

    } finally { // This block executes regardless of success or error
      setIsLoading(false); // Set loading state back to false
    }
  }; // <<< Closing brace for the handleSubmit async function


  // Render the login form
  return (
    <div>
      <h2>Login</h2>
      {/* Display error message if one exists */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-username">Username:</label>
          <input
            type="text"
            id="login-username" // Using a specific ID for the label's 'htmlFor'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // HTML5 basic validation
            disabled={isLoading} // Disable input when loading
          />
        </div>
        <div>
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password" // Using a specific ID
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // HTML5 basic validation
            disabled={isLoading} // Disable input when loading
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {/* Show different text on the button when loading */}
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );
}; // End of Login component function

export default Login;