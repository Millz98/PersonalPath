// src/components/ProfileForm.js
import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getData as getCountryData } from 'country-list'; // <-- Import country list data getter

// --- Import Chakra UI Components ---
import {
  Box,
  Button,
  Checkbox,         // Keep for later steps
  FormControl,
  FormLabel,
  FormErrorMessage, // Keep for later steps
  Input,
  Select,           // Keep for later steps (Used in Step 4 now!)
  Textarea,         // Keep for later steps
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
  const { logout } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    height_cm: '',
    current_weight_kg: '',
    country: 'CA', // <-- Set default country to Canada code
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

  // --- Prepare Country List using useMemo ---
  const countryOptions = useMemo(() => {
    const countries = getCountryData(); // Get data like [{ code: 'CA', name: 'Canada' }, ...]
    // Sort alphabetically by name for better UX
    countries.sort((a, b) => a.name.localeCompare(b.name));
    // Map to the format needed for select options { value: code, label: name }
    return countries.map(country => ({
      value: country.code,
      label: country.name
    }));
  }, []); // Empty dependency array means this runs only once

  // --- Fetch Profile Data useEffect ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsFetching(true); setFetchError(''); setSuccessMessage(''); setSubmitError('');
      try {
        const response = await axios.get('/api/users/profile/');
        const profileData = response.data;
        let updatedFormData = { ...formData }; // Start with default structure (incl 'CA')

        // Overwrite defaults only if backend provides a value
        for (const key in updatedFormData) {
          if (profileData.hasOwnProperty(key) && profileData[key] !== null) {
              updatedFormData[key] = profileData[key];
          } else if (profileData.hasOwnProperty(key) && profileData[key] === null) {
              // If backend explicitly sends null, map to empty string/false,
              // EXCEPT for country where we want to keep 'CA' if null/not set
              if (key !== 'country') {
                 updatedFormData[key] = typeof updatedFormData[key] === 'boolean' ? false : '';
              }
              // If key is 'country' and backend sent null, updatedFormData.country remains 'CA' from initial state
          }
        }
        // Ensure country has *some* value (default 'CA' or fetched value)
        if (!updatedFormData.country) updatedFormData.country = 'CA';

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

  // --- Handlers ---
  const nextStep = () => setStep(prevStep => prevStep < totalSteps ? prevStep + 1 : prevStep);
  const prevStep = () => setStep(prevStep => prevStep > 1 ? prevStep - 1 : prevStep);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (event) => {
    event.preventDefault(); setSubmitError(''); setSuccessMessage(''); setIsSubmitting(true);
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
    } finally { setIsSubmitting(false); }
  };


  // --- Refactored Rendering Logic ---
  const renderForm = () => {
    const isDisabled = isFetching || isSubmitting;
    switch (step) {
      case 1: // Age
        return ( <VStack spacing={4} align="stretch"><FormControl isRequired><FormLabel htmlFor="age">Age:</FormLabel><Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} isDisabled={isDisabled} placeholder="Enter your age" /></FormControl></VStack> );
      case 2: // Height
        return ( <VStack spacing={4} align="stretch"><FormControl isRequired><FormLabel htmlFor="height_cm">Height (cm):</FormLabel><Input id="height_cm" name="height_cm" type="number" value={formData.height_cm} onChange={handleChange} isDisabled={isDisabled} placeholder="Enter height in centimeters" /></FormControl></VStack> );
      case 3: // Weight
        return ( <VStack spacing={4} align="stretch"><FormControl isRequired><FormLabel htmlFor="current_weight_kg">Current Weight (kg):</FormLabel><Input id="current_weight_kg" name="current_weight_kg" type="number" value={formData.current_weight_kg} onChange={handleChange} isDisabled={isDisabled} placeholder="Enter current weight" step="0.1" /></FormControl></VStack> );
      case 4: // Country (Dropdown)
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="country">Country:</FormLabel>
              <Select
                id="country"
                name="country"
                value={formData.country} // Bound to state ('CA', 'US', etc.)
                onChange={handleChange}
                isDisabled={isDisabled}
                placeholder="Select country"
              >
                {/* Map over the prepared country list */}
                {countryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        );

      // --- TODO: Add Cases 5 through 13 ---

      default:
        return <Box>Step {step} rendering not implemented yet (Chakra UI).</Box>;
    }
  };
  // --- End Refactored Rendering Logic ---


  // --- Main Component Return (Using Chakra UI) ---
  if (isFetching) { return <Box p={5} textAlign="center">Loading your profile...</Box>; }

  return (
    <Box maxW="600px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="base">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>Your Profile</Heading>

      {fetchError && ( <Alert status="error" mb={4} borderRadius="md"><AlertIcon /><AlertDescription>{fetchError}</AlertDescription></Alert> )}
      {submitError && ( <Alert status="error" mb={4} borderRadius="md"><AlertIcon /><AlertDescription>{submitError}</AlertDescription></Alert> )}
      {successMessage && ( <Alert status="success" mb={4} borderRadius="md"><AlertIcon /><AlertDescription>{successMessage}</AlertDescription></Alert> )}

      <Progress value={((step - 1) / (totalSteps - 1)) * 100} size="sm" colorScheme="teal" mb={6} hasStripe isAnimated={isSubmitting} />

      {!fetchError && (
         <Box as="form" onSubmit={handleSubmit}>
            {renderForm()}
            <Flex mt={8} pt={4} borderTopWidth="1px">
              {step > 1 && ( <Button onClick={prevStep} variant="outline" isDisabled={isSubmitting}>Previous</Button> )}
              <Spacer />
              {step < totalSteps && ( <Button onClick={nextStep} colorScheme="teal" isDisabled={isSubmitting}>Next</Button> )}
              {step === totalSteps && ( <Button type="submit" colorScheme="green" isLoading={isSubmitting} loadingText="Updating..." isDisabled={isFetching || isSubmitting}>Update Profile</Button> )}
            </Flex>
         </Box>
      )}

       <Box mt={8} pt={4} borderTopWidth="1px" textAlign="center">
         <Button onClick={logout} variant="outline" colorScheme="red"> Logout </Button>
       </Box>

    </Box>
  );
}; // <<< Closing brace for ProfileForm component

export default ProfileForm; // Export statement