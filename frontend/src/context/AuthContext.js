// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
// Optional: Install and use jwt-decode if you need to inspect token contents (e.g., expiry)
// import jwt_decode from 'jwt-decode';

// 1. Create the Context Object
const AuthContext = createContext(null);

// 2. Create the AuthProvider Component
export const AuthProvider = ({ children }) => {
  // --- State Variables ---
  // Initialize state by trying to read tokens from localStorage
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  // isLoggedIn is true if an access token exists initially
  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
  // Optional: Store basic user info (could be fetched after login)
  const [user, setUser] = useState(null);
  // Optional: Loading state for context-related async operations
  const [authLoading, setAuthLoading] = useState(false);

  // Ref to store the Axios interceptor ID
  const interceptorId = useRef(null);

  // --- Axios Interceptor Setup ---
  useEffect(() => {
    // Eject any existing interceptor before setting a new one
    // Prevents duplicates if component re-renders unexpectedly
    if (interceptorId.current !== null) {
      axios.interceptors.request.eject(interceptorId.current);
    }

    // Add a request interceptor to automatically add the Authorization header
    interceptorId.current = axios.interceptors.request.use(
      (config) => {
        // Get the current token from localStorage *at the time of the request*
        const currentToken = localStorage.getItem('access_token');
        if (currentToken) {
          config.headers['Authorization'] = `Bearer ${currentToken}`;
        }
        // --- TODO: Token Refresh Logic ---
        // You would typically check token expiry here (using jwt-decode perhaps).
        // If expired, you'd initiate a token refresh request using the refreshToken
        // *before* letting the original request proceed with a new token.
        // This often involves response interceptors as well (catching 401s).
        // We'll defer this complexity for now.
        // --- End TODO ---
        return config; // Return the potentially modified config
      },
      (error) => {
        // Handle errors during request setup
        return Promise.reject(error);
      }
    );

    // Cleanup function: Eject the interceptor when the AuthProvider unmounts
    return () => {
      if (interceptorId.current !== null) {
        axios.interceptors.request.eject(interceptorId.current);
        interceptorId.current = null; // Clear the ref
      }
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  // --- Login Function ---
  const login = async (access, refresh) => {
    setAuthLoading(true);
    // Store tokens in localStorage for persistence
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    // Update React state
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsLoggedIn(true);
    // Optional: Decode token or fetch user profile data here
    // try {
    //   // Example: Fetch profile data after login
    //   // const response = await axios.get('/api/users/profile/'); // Interceptor adds token
    //   // setUser(response.data);
    // } catch (error) {
    //   console.error("Failed to fetch user data post-login:", error);
    //   // Decide how to handle this - maybe logout if critical data missing?
    // }
    setAuthLoading(false);
    console.log("AuthContext: User logged in.");
  };

  // --- Logout Function ---
  const logout = () => {
    // Optional: Call backend logout endpoint if it exists (e.g., to invalidate refresh token)
    // try {
    //   await axios.post('/api/users/logout/', { refresh: refreshToken });
    // } catch (error) {
    //   console.error("Backend logout failed:", error);
    // }

    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Clear React state
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
    setUser(null);
    console.log("AuthContext: User logged out.");
    // Note: The interceptor will stop adding the header automatically
    // because localStorage.getItem('access_token') will be null.
  };

  // --- Context Value ---
  // Memoize or define outside if performance becomes critical, but fine for now
  const value = {
    isLoggedIn,
    accessToken,
    refreshToken, // Needed for refresh logic
    user,
    authLoading,
    login,
    logout,
  };

  // 3. Return the Provider wrapping the children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create and Export the Custom Hook for easy context consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Ensure the hook is used within a component wrapped by AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};