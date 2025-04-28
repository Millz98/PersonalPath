// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
// --- Import Link from react-router-dom ---
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from your AuthContext

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/users/login/', {
        username,
        password,
      });

      if (response.data && response.data.access && response.data.refresh) {
        const { access, refresh } = response.data;
        login(access, refresh);
        console.log('Login successful');
        navigate('/profile');
      } else {
        setError('Login failed: Invalid response from server.');
      }

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 401) {
        setError('Login failed: Invalid username or password.');
      } else if (err.response && err.response.data && err.response.data.detail) {
          setError(`Login failed: ${err.response.data.detail}`);
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-username">Username:</label>
          <input
            type="text"
            id="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>

      {/* --- Add Link to Register Page --- */}
      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
        <p>
          Don't have an account yet?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
      {/* --- End Link --- */}

    </div>
  );
};

export default Login;