// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // For specific field errors
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize navigate

  // Helper to parse backend errors
  const parseApiErrors = (apiError) => {
    if (apiError.response && apiError.response.data) {
      const data = apiError.response.data;
      if (typeof data === 'object' && data !== null) {
          // Handle DRF field errors (e.g., {username: ['msg'], password: ['msg']})
          setFieldErrors(data);
          // Create a general message from field errors
          const generalMessage = Object.entries(data)
             .map(([field, messages]) => `${field}: ${messages.join(' ')}`)
             .join('; ');
          return `Registration failed. Please check errors: ${generalMessage}`;
      } else if (typeof data === 'string') {
          // Handle simple string errors
          return data;
      }
    }
    return 'Registration failed. An unknown error occurred.'; // Fallback
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({}); // Clear previous field errors
    setIsLoading(true);

    try {
      const response = await axios.post('/api/users/register/', {
        username,
        password,
        email,
      });
      console.log('Registration successful:', response.data);
      // Redirect to login page after successful registration
      // Optionally: show a success message first (e.g., using a toast)
      navigate('/login');

    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      const errorMessage = parseApiErrors(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {/* Display general error message if no field errors were parsed */}
      {error && Object.keys(fieldErrors).length === 0 && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-invalid={!!fieldErrors.username}
          />
          {fieldErrors.username && <p style={{ color: 'red', fontSize: '0.8em' }}>{fieldErrors.username.join(' ')}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && <p style={{ color: 'red', fontSize: '0.8em' }}>{fieldErrors.password.join(' ')}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             aria-invalid={!!fieldErrors.email}
          />
           {fieldErrors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{fieldErrors.email.join(' ')}</p>}
        </div>
        {/* Display non-field errors if provided by DRF */}
        {fieldErrors.non_field_errors && <p style={{ color: 'red' }}>{fieldErrors.non_field_errors.join(' ')}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;