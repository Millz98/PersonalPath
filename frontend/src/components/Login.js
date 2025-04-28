// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom'; // Use alias for React Router Link
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

// Import Chakra UI components
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage, // To display field-specific errors if needed
  Input,
  VStack, // Vertical Stack for layout
  Heading,
  Alert,
  AlertIcon,
  AlertDescription,
  Link,  // Chakra UI Link
  Text   // Chakra UI Text
} from '@chakra-ui/react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For general errors (like invalid credentials)
  const [fieldErrors, setFieldErrors] = useState({}); // For potential future field-specific errors
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({}); // Clear previous errors
    setIsLoading(true);

    try {
      const response = await axios.post('/api/users/login/', {
        username,
        password,
      });

      if (response.data && response.data.access && response.data.refresh) {
        const { access, refresh } = response.data;
        login(access, refresh); // Call context login function
        console.log('Login successful');
        navigate('/profile'); // Redirect after successful login
      } else {
        // Should not happen with standard JWT views but handle just in case
        setError('Login failed: Invalid response from server.');
      }

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      // Reset field errors on new submission attempt
      setFieldErrors({});

      // Handle different error types
      if (err.response && err.response.status === 401) {
        // Specific error for invalid credentials (Unauthorized) - Show as general error
        setError('Login failed: Invalid username or password.');
      } else if (err.response && err.response.data) {
          const data = err.response.data;
          // Handle DRF 'detail' or 'non_field_errors' as general error
          if (data.detail) {
              setError(`Login failed: ${data.detail}`);
          } else if (data.non_field_errors) {
              // Join if it's an array, otherwise display as string
              setError(`Login failed: ${Array.isArray(data.non_field_errors) ? data.non_field_errors.join(' ') : data.non_field_errors}`);
          }
          // Handle potential field errors (less common for login)
          else if (typeof data === 'object' && data !== null) {
             setFieldErrors(data); // Store field errors if backend sends them {username: [...], password: [...]}
             setError("Login failed. Please check the errors below."); // General message when specific field errors exist
          } else if (typeof data === 'string'){
              setError(`Login failed: ${data}`); // Handle simple string error response
          } else {
              setError('Login failed. An unexpected error format was received.');
          }
      } else {
        // Generic error for network issues or other problems where response might not exist
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false); // Ensure loading is turned off
    }
  };

  return (
    // Use Box as a container, center it, add padding, border, shadow etc.
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Login to PersonalPath
      </Heading>

      {/* Display general errors using Chakra Alert */}
      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Use VStack for vertical spacing of form elements */}
      <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">

        {/* Username Field */}
        {/* Use isInvalid prop to highlight field if backend flags it */}
        <FormControl isInvalid={!!fieldErrors.username} isRequired>
          <FormLabel htmlFor="login-username">Username</FormLabel>
          <Input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isDisabled={isLoading}
            // variant="outline" // Default variant usually has border
            // Add placeholder if desired
          />
          {/* Display field-specific error message if provided */}
          <FormErrorMessage>{fieldErrors.username?.join(', ')}</FormErrorMessage>
        </FormControl>

        {/* Password Field */}
        <FormControl isInvalid={!!fieldErrors.password} isRequired>
          <FormLabel htmlFor="login-password">Password</FormLabel>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isLoading}
            // variant="outline"
          />
          <FormErrorMessage>{fieldErrors.password?.join(', ')}</FormErrorMessage>
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          colorScheme="teal" // Or your theme's primary color
          isLoading={isLoading} // Handles spinner automatically
          loadingText="Logging In..."
          width="full"
          mt={4}
        >
          Login
        </Button>
      </VStack>

       {/* Link to Register Page */}
       <Text mt={6} textAlign="center"> {/* Increased margin-top */}
           Don't have an account yet?{' '}
           {/* Use Chakra Link component, but make it behave like React Router Link */}
           <Link as={ReactRouterLink} to="/register" color="teal.500" fontWeight="bold">
               Register here
           </Link>
       </Text>
    </Box>
  );
};

export default Login;