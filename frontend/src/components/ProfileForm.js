// src/components/ProfileForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Keep if needed for logout later

// --- Import Chakra UI Components ---
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage, // If using backend field validation display
  Input,
  Select,
  Textarea,
  VStack, // For stacking elements within steps
  Heading,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress, // For step progress indicator
  Flex,     // For button layout
  Spacer   // For button layout
} from '@chakra-ui/react';
// --- End Chakra UI Imports ---

// Keep custom CSS for potentially the container if needed, but minimize
// import './ProfileForm.css';

const ProfileForm = () => {
  const { logout } = useAuth(); // Get logout if button remains here
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
    // ... fetchProfileData logic remains the same ...
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
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
     // ... handleSubmit logic using axios.patch remains the same ...
     event.preventDefault(); setSubmitError(''); setSuccessMessage(''); setIsSubmitting(true);
     try {
       const response = await axios.patch('/api/users/profile/', formData);
       setSuccessMessage('Profile updated successfully!');
     } catch (error) { /*... improved error handling ...*/
        console.error('Profile update error:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data) { /* ... parse errors ... */ setSubmitError('Update failed: ...');} else { setSubmitError('Update failed...'); }
     } finally { setIsSubmitting(false); }
  };


  // --- Refactored Rendering Logic ---
  const renderForm = () => {
    const isDisabled = isFetching || isSubmitting;

    switch (step) {
      // --- Step 1: Age (Using Chakra UI) ---
      case 1:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={/* Add field error check if needed */ false}>
              <FormLabel htmlFor="age">Age:</FormLabel>
              <Input
                id="age"
                name="age"
                type="number" // Use type="number"
                value={formData.age}
                onChange={handleChange}
                isDisabled={isDisabled}
                // variant="outline" // Default variant
                placeholder="Enter your age"
              />
              {/* <FormErrorMessage>Age is required.</FormErrorMessage> */}
            </FormControl>
          </VStack>
        );
      // --- End Step 1 ---

      // --- TODO: Add Cases 2 through 13 using Chakra components ---
      // Example Structure for Text Input (e.g., Country - Step 4)
      // case 4:
      //   return (
      //     <VStack spacing={4} align="stretch">
      //       <FormControl isRequired>
      //         <FormLabel htmlFor="country">Country:</FormLabel>
      //         <Input id="country" name="country" value={formData.country} onChange={handleChange} isDisabled={isDisabled} />
      //       </FormControl>
      //     </VStack>
      //   );

       // Example Structure for Select (e.g., Activity Level - Step 12)
       // case 12:
       //  return (
       //    <VStack spacing={4} align="stretch">
       //      <FormControl>
       //        <FormLabel htmlFor="activity_level">Activity Level:</FormLabel>
       //        <Select id="activity_level" name="activity_level" value={formData.activity_level} onChange={handleChange} isDisabled={isDisabled}>
       //          <option value="sedentary">Sedentary</option>
       //          <option value="lightly_active">Lightly Active</option>
       //          <option value="moderately_active">Moderately Active</option>
       //          <option value="very_active">Very Active</option>
       //          {/* Add extra_active if added to model */}
       //        </Select>
       //      </FormControl>
       //    </VStack>
       //  );

       // Example for Checkbox (Step 7)
       // case 7:
       //  return (
       //    <VStack spacing={4} align="stretch">
       //      <FormControl>
       //        {/* Note: Checkbox doesn't use FormLabel typically */}
       //        <Checkbox
       //           id="has_gym_membership"
       //           name="has_gym_membership"
       //           isChecked={formData.has_gym_membership} // Use isChecked
       //           onChange={handleChange}
       //           isDisabled={isDisabled}
       //         >
       //           Do you have a gym membership?
       //         </Checkbox>
       //      </FormControl>
       //    </VStack>
       //  );


      default:
        return <Box>Step {step} rendering not implemented yet (Chakra UI).</Box>;
    }
  };
  // --- End Refactored Rendering Logic ---

  // --- Main Component Return (Using Chakra UI) ---
  if (isFetching) {
    // Optionally use Chakra Spinner
    return <Box p={5} textAlign="center">Loading your profile...</Box>;
  }

  // Use Box as the main container
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
      <Progress value={((step - 1) / (totalSteps - 1)) * 100} size="sm" colorScheme="teal" mb={6} />

      {/* Form Content */}
      {!fetchError && (
         <Box as="form" onSubmit={handleSubmit}>
            {renderForm()} {/* Render current step's Chakra components */}

            {/* Navigation/Submit Buttons using Flex */}
            <Flex mt={8} pt={4} borderTopWidth="1px">
              {step > 1 && (
                <Button
                  onClick={prevStep}
                  variant="outline" // Example variant
                  isDisabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              <Spacer /> {/* Pushes buttons to edges */}
              {step < totalSteps && (
                <Button
                  onClick={nextStep}
                  colorScheme="teal" // Example color
                  isDisabled={isSubmitting}
                >
                  Next
                </Button>
              )}
              {step === totalSteps && (
                <Button
                  type="submit"
                  colorScheme="green" // Example color
                  isLoading={isSubmitting}
                  loadingText="Updating..."
                  isDisabled={isFetching} // Should already be false here, but safe check
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
           variant="ghost" // Example variant
           colorScheme="red" // Example color
         >
           Logout
         </Button>
       </Box>

    </Box> // End Main Container Box
  );
};

export default ProfileForm;