// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';

// Import Chakra UI components
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Alert,
  AlertDescription,
  Link,
  Text
} from '@chakra-ui/react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const parseApiErrors = (apiError) => {
    setFieldErrors({});
    if (apiError.response && apiError.response.data) {
      const data = apiError.response.data;
      if (typeof data === 'object' && data !== null) {
        const fieldSpecificErrors = {};
        let generalErrorMessage = '';
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'detail') {
            generalErrorMessage = Array.isArray(value) ? value.join(' ') : value;
          } else if (key === 'non_field_errors') {
            generalErrorMessage = Array.isArray(value) ? value.join(' ') : value;
          } else {
            fieldSpecificErrors[key] = Array.isArray(value) ? value : [value];
          }
        });

        if (Object.keys(fieldSpecificErrors).length > 0) {
          setFieldErrors(fieldSpecificErrors);
          if (!generalErrorMessage) {
            generalErrorMessage = "Please correct the errors below.";
          }
          return generalErrorMessage;
        } else if (generalErrorMessage) {
          return generalErrorMessage;
        }
      } else if (typeof data === 'string') {
        return data;
      }
    }
    return 'Registration failed. An unknown error occurred.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    try {
      await axios.post('/api/users/register/', {
        username,
        password,
        email,
      });
      console.log('Registration successful');
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
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Register for PersonalPath
      </Heading>

      {error && (
        <Box bg="red.50" p={4} borderRadius="md" mb={4} borderWidth="1px" borderColor="red.200">
          <Text color="red.500">{error}</Text>
        </Box>
      )}

      <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
        <Box>
          <Text as="label" htmlFor="reg-username" display="block" mb={2} fontWeight="medium">
            Username
          </Text>
          <Input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isDisabled={isLoading}
            borderColor={fieldErrors.username ? 'red.500' : undefined}
          />
          {fieldErrors.username && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {fieldErrors.username.join(', ')}
            </Text>
          )}
        </Box>

        <Box>
          <Text as="label" htmlFor="reg-password" display="block" mb={2} fontWeight="medium">
            Password
          </Text>
          <Input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isLoading}
            borderColor={fieldErrors.password ? 'red.500' : undefined}
          />
          {fieldErrors.password && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {fieldErrors.password.join(', ')}
            </Text>
          )}
        </Box>

        <Box>
          <Text as="label" htmlFor="reg-email" display="block" mb={2} fontWeight="medium">
            Email
          </Text>
          <Input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isLoading}
            borderColor={fieldErrors.email ? 'red.500' : undefined}
            placeholder="Optional"
          />
          {fieldErrors.email && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {fieldErrors.email.join(', ')}
            </Text>
          )}
        </Box>

        <Button
          type="submit"
          colorScheme="teal"
          isLoading={isLoading}
          loadingText="Registering..."
          width="full"
          mt={4}
        >
          Register
        </Button>
      </VStack>

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