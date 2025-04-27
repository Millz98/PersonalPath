// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const ProtectedRoute = ({ children }) => {
  // Get the authentication status and any loading state from your AuthContext
  // Ensure your AuthContext provides 'isLoggedIn' and optionally 'authLoading'
  const { isLoggedIn, authLoading } = useAuth();

  // Get the current location object
  const location = useLocation();

  // 1. Show a loading indicator while checking authentication status (Optional but Recommended)
  // This prevents flickering or brief redirects if the initial state check takes time.
  // Your AuthContext needs to provide an 'authLoading' state for this.
  // If you don't have/need authLoading, you can remove this 'if' block.
  if (authLoading) {
    // You can replace this with a spinner component or any loading UI
    return <div>Loading...</div>;
  }

  // 2. Check if the user is logged in *after* loading is complete
  if (!isLoggedIn) {
    // If not logged in, redirect the user to the /login page
    // - `replace`: Replaces the current entry in the history stack, so the user
    //   doesn't get stuck in a loop if they press the back button after login.
    // - `state={{ from: location }}`: Passes the current location (the page
    //   they were trying to access) to the login page. The login page can
    //   then use this information to redirect the user back where they
    //   originally wanted to go after a successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If the user is logged in and loading is complete, render the child components
  // `children` represents whatever component(s) you wrapped with <ProtectedRoute> in App.js
  return children;
};

export default ProtectedRoute;