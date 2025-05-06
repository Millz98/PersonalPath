// src/components/ProfileForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Keep if needed for logout later

// --- Import Chakra UI Components ---
import {
  Box,
  Button,
  Checkbox, // Keep for later steps
  FormControl,
  FormLabel,
  FormErrorMessage, // Keep for later steps
  Input,
  Select, // Keep for later steps
  Textarea, // Keep for later steps
  VStack,
  Heading,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress,
  Flex,
  Spacer
} from '@chakra-ui/react';
// --- End Chakra UI Imports ---

// import './ProfileForm.css'; // Can likely remove if not using custom overrides

const ProfileForm = () => {
  const { logout } = useAuth(); // Get logout function
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    height_cm: '',
    current_weight_kg: '',
    country: '',
    province: '',
    physical_issues: '',
    has_gym_membership: false,
    home_equipment: '',
    dietary_preferences: '',
    food_allergies: '',
    disliked_foods: '',
    activity_level: 'sedentary',
    weight_loss_goal_kg: '',
    desired_loss_rate: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const totalSteps = 13;
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Profile Data useEffect (Keep As Is) ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsFetching(true); setFetchError(''); setSuccessMessage(''); setSubmitError('');
      try {
        const response = await axios.get('/api/users/profile/');
        const profileData = response.data;
        let updatedFormData = { ...formData };
        for (const key in updatedFormData) {
          if (profileData.hasOwnProperty(key)) {
            const backendValue = profileData[key];
            updatedFormData[key] = backendValue === null ? (typeof updatedFormData[key] === 'boolean' ? false : '') : backendValue;
          }
        }
        setFormData(updatedFormData);
      } catch (error) {
        console.error('Failed to fetch profile data:', error.response ? error.response.data : error.message);
        setFetchError('Failed to load your profile information. Please try refreshing the page.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handlers (Keep As Is) ---
  const nextStep = () => setStep(prevStep => prevStep < totalSteps ? prevStep + 1 : prevStep);
  const prevStep = () => setStep(prevStep => prevStep > 1 ? prevStep - 1 : prevStep);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    // Special handling for Chakra Checkbox potentially needed if it doesn't use event.target.checked directly
    // But standard input/select/textarea works like this:
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // --- Updated Form Submission Handler ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      console.log("Submitting profile data:", formData);
      const response = await axios.patch('/api/users/profile/', formData); // Using PATCH
      console.log('Profile update response:', response.data); // Using response here
      setSuccessMessage('Profile updated successfully!');
    } catch (error) { // Full error handling
      console.error('Profile update error:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
          const errors = error.response.data;
          if (typeof errors === 'object' && errors !== null) {
              const fieldErrorMessages = Object.entries(errors)
                  .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
                  .join('; ');
              setSubmitError(`Update failed: ${fieldErrorMessages}`);
          } else if (typeof errors === 'string') {
              setSubmitError(`Update failed: ${errors}`);
          } else {
              setSubmitError('Update failed. An unexpected error format was received.');
          }
      } else {
          setSubmitError('Update failed. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- End Updated Form Submission Handler ---


  // --- Refactored Rendering Logic ---
  const renderForm = () => {
    const isDisabled = isFetching || isSubmitting;

    switch (step) {
      case 1:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={/* Add field error check if needed */ false}>
              <FormLabel htmlFor="age">Age:</FormLabel>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                isDisabled={isDisabled}
                placeholder="Enter your age"
              />
              {/* <FormErrorMessage>Age is required.</FormErrorMessage> */}
            </FormControl>
          </VStack>
        );
      case 2:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={/* Add field error check if needed */ false}>
              <FormLabel htmlFor="height_cm">Height (cm):</FormLabel>
              <Input
                id="height_cm"
                name="height_cm"
                type="number"
                value={formData.height_cm}
                onChange={handleChange}
                isDisabled={isDisabled}
                placeholder="Enter height in centimeters"
              />
              {/* <FormErrorMessage>Height is required.</FormErrorMessage> */}
            </FormControl>
          </VStack>
        );

      // --- Step 3: Current Weight (Using Chakra UI) ---
      case 3:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired> {/* Assuming weight is required */}
              <FormLabel htmlFor="current_weight_kg">Current Weight (kg):</FormLabel>
              <Input
                id="current_weight_kg"
                name="current_weight_kg"
                type="number"
                value={formData.current_weight_kg}
                onChange={handleChange}
                isDisabled={isDisabled}
                placeholder="Enter current weight"
                step="0.1" // Allow decimal input for weight
              />
              {/* Optional: Add validation message if needed */}
              {/* <FormErrorMessage>Weight is required.</FormErrorMessage> */}
            </FormControl>
          </VStack>
        );
      // --- End Step 3 ---

      // --- TODO: Add Cases 4 through 13 using Chakra components ---

      default:
        return <Box>Step {step} rendering not implemented yet (Chakra UI).</Box>;
    } // <<< Closing brace for switch
  }; // <<< Closing brace for renderForm function
  // --- End Refactored Rendering Logic ---

  // --- **** REMOVED THE DUPLICATE EXAMPLE CODE BLOCK THAT WAS HERE **** ---


  // --- Main Component Return (Using Chakra UI) ---
  if (isFetching) {
    return <Box p={5} textAlign="center">Loading your profile...</Box>;
  }

  return (
    <Box maxW="600px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="base">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Your Profile
      </Heading>

      {/* Display Fetch Error */}
      {fetchError && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}
      {/* Display Submission Error */}
      {submitError && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      {/* Display Success Message */}
      {successMessage && (
        <Alert status="success" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Progress Indicator */}
      <Progress value={((step - 1) / (totalSteps - 1)) * 100} size="sm" colorScheme="teal" mb={6} hasStripe isAnimated={isSubmitting} />

      {/* Form Content */}
      {!fetchError && (
         <Box as="form" onSubmit={handleSubmit}>
            {renderForm()} {/* Render current step's Chakra components */}

            {/* Navigation/Submit Buttons using Flex */}
            <Flex mt={8} pt={4} borderTopWidth="1px">
              {step > 1 && (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  isDisabled={isSubmitting} // Only disable during submit
                >
                  Previous
                </Button>
              )}
              <Spacer /> {/* Pushes buttons to edges */}
              {step < totalSteps && (
                <Button
                  onClick={nextStep}
                  colorScheme="teal"
                  isDisabled={isSubmitting} // Only disable during submit
                >
                  Next
                </Button>
              )}
              {step === totalSteps && (
                <Button
                  type="submit"
                  colorScheme="green"
                  isLoading={isSubmitting}
                  loadingText="Updating..."
                  // Disable submit if fetching (shouldn't happen) or submitting
                  isDisabled={isFetching || isSubmitting}
                >
                  Update Profile
                </Button>
              )}
            </Flex>
         </Box> // End Form Box
      )}

      {/* Logout Button - Moved here previously */}
       <Box mt={8} pt={4} borderTopWidth="1px" textAlign="center">
         <Button
           onClick={logout}
           variant="outline" // Changed variant for less emphasis
           colorScheme="red"
         >
           Logout
         </Button>
       </Box>

    </Box> // End Main Container Box
  );
}; // <<< Closing brace for ProfileForm component

export default ProfileForm; // Export statement