// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom'; // Import React Router Link

// Import Chakra UI components
import {
  Box,
  Button,
  Input,
  VStack, // Vertical Stack for layout
  Heading,
  Alert,
  AlertDescription,
  Link,  // Chakra UI Link
  Text   // Chakra UI Text
} from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage
} from '@chakra-ui/form-control';
import { WarningIcon } from '@chakra-ui/icons'; // Import WarningIcon for alerts

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); // General non-field errors
  const [fieldErrors, setFieldErrors] = useState({}); // Field-specific errors {username: ['msg'], ...}
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to parse backend errors (can be moved to a utility file later)
   const parseApiErrors = (apiError) => {
     setFieldErrors({}); // Clear previous field errors first
     if (apiError.response && apiError.response.data) {
       const data = apiError.response.data;
       if (typeof data === 'object' && data !== null) {
         // Check for standard DRF field errors
         const fieldSpecificErrors = {};
         let generalErrorMessage = '';
         Object.entries(data).forEach(([key, value]) => {
             if (key === 'detail') {
                 generalErrorMessage = Array.isArray(value) ? value.join(' ') : value;
             } else if (key === 'non_field_errors') {
                 generalErrorMessage = Array.isArray(value) ? value.join(' ') : value;
             }
              else {
                 // Assume other keys are field names
                 fieldSpecificErrors[key] = Array.isArray(value) ? value : [value];
             }
         });

         if (Object.keys(fieldSpecificErrors).length > 0) {
             setFieldErrors(fieldSpecificErrors);
             // Combine field errors for a general message *if* no other general message exists
             if (!generalErrorMessage) {
                generalErrorMessage = "Please correct the errors below.";
             }
             return generalErrorMessage; // Return general message (or empty if only field errors)
         } else if (generalErrorMessage) {
             return generalErrorMessage; // Return detail or non_field_errors
         }

       } else if (typeof data === 'string') {
         return data; // Handle simple string error response
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
      await axios.post('/api/users/register/', {
        username,
        password,
        email,
      });
      console.log('Registration successful');
      // Consider showing a success toast message here before navigating
      // Example: toast({ title: 'Registration successful!', status: 'success', duration: 3000, isClosable: true });
      navigate('/login'); // Navigate to login page

    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      const errorMessage = parseApiErrors(err);
      setError(errorMessage); // Set the general error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use Box as a container, center it, add padding
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Register for PersonalPath
      </Heading>

      {/* Display general errors using Chakra Alert */}
      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <WarningIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Use VStack for vertical spacing of form elements */}
      <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
        {/* Username Field */}
        <FormControl isInvalid={!!fieldErrors.username} isRequired>
          <FormLabel htmlFor="reg-username">Username</FormLabel>
          <Input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isDisabled={isLoading}
          />
          {/* Show field-specific error message */}
          <FormErrorMessage>{fieldErrors.username?.join(', ')}</FormErrorMessage>
        </FormControl>

        {/* Password Field */}
        <FormControl isInvalid={!!fieldErrors.password} isRequired>
          <FormLabel htmlFor="reg-password">Password</FormLabel>
          <Input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isLoading}
          />
          <FormErrorMessage>{fieldErrors.password?.join(', ')}</FormErrorMessage>
           {/* TODO: Add password strength indicator later */}
        </FormControl>

        {/* Email Field (Optional based on backend validation) */}
        <FormControl isInvalid={!!fieldErrors.email}>
          {/* Add isRequired here if your backend requires email */}
          <FormLabel htmlFor="reg-email">Email</FormLabel>
          <Input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isLoading}
            placeholder="Optional"
          />
          <FormErrorMessage>{fieldErrors.email?.join(', ')}</FormErrorMessage>
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          colorScheme="teal" // Or another scheme fitting your theme (e.g., "blue", "green")
          isLoading={isLoading} // Shows spinner automatically
          loadingText="Registering..." // Text shown with spinner
          width="full" // Make button full width
          mt={4} // Margin top for spacing
        >
          Register
        </Button>
      </VStack>

       {/* Link to Login Page */}
       <Text mt={4} textAlign="center">
           Already have an account?{' '}
           <Link as={ReactRouterLink} to="/login" color="teal.500" fontWeight="bold">
               Login here
           </Link>
       </Text>
    </Box>
  );
};

export default Register;