// src/components/ProfileForm.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getData as getCountryData } from 'country-list'; // For the country dropdown
// --- Import RegionDropdown component ---
import { State } from 'country-state-city';

// --- Import Chakra UI Components ---
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,           // Used for Country (Step 4) and Activity Level (Step 12)
  Textarea,
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

// Import CSS for styling RegionDropdown if needed
import './ProfileForm.css';

const ProfileForm = () => {
  const { logout } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    height_cm: '',
    current_weight_kg: '',
    country: 'CA', // Default country code
    province: '',  // Province/State name
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

  // Prepare Country List for Chakra Select dropdown
  const countryOptions = useMemo(() => {
    const countries = getCountryData();
    countries.sort((a, b) => a.name.localeCompare(b.name));
    return countries.map(country => ({
      value: country.code, // Use code 'CA', 'US' as value
      label: country.name  // Use name 'Canada', 'United States' as label
    }));
  }, []);

  // Fetch Profile Data useEffect
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
             if (backendValue !== null) {
                 // Ensure country uses CODE if backend returns it
                 if (key === 'country' && backendValue.length > 3) { // Simple check if it's name vs code
                     // If backend sent name, try to find code (needs robust lookup)
                     // For now, assume backend sends code or default 'CA' is okay
                     console.warn("Backend might be sending country name, expected code.");
                     updatedFormData[key] = backendValue; // Or attempt lookup
                 } else {
                     updatedFormData[key] = backendValue;
                 }
            } else if (typeof updatedFormData[key] === 'boolean') {
                updatedFormData[key] = false;
            } else if (key !== 'country'){ // Don't overwrite country default if null
                updatedFormData[key] = '';
            }
          }
        }
         // Ensure country code is set (either from backend or default 'CA')
         if (!updatedFormData.country || updatedFormData.country.length > 3) {
             updatedFormData.country = 'CA';
         }

        setFormData(updatedFormData);
      } catch (error) { /* ... error handling ... */ }
        finally { setIsFetching(false); }
    };
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep dependency array empty to run once

  // --- Handlers ---
  const nextStep = () => setStep(prevStep => prevStep < totalSteps ? prevStep + 1 : prevStep);
  const prevStep = () => setStep(prevStep => prevStep > 1 ? prevStep - 1 : prevStep);

  // Generic handler for most Chakra inputs/selects/textareas
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => {
        const newState = {
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        };
        // If country SELECT changed, clear province
        if (name === 'country') {
            console.log("Country changed, clearing province");
            newState.province = '';
        }
        return newState;
    });
  };

  // Specific handler for RegionDropdown component (passes value directly)
  const handleRegionChange = (val) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      province: val // val is the region name (e.g., 'Saskatchewan')
    }));
  };

  // Form Submission Handler
   const handleSubmit = async (event) => { /* ... remains the same ... */ };


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
      case 4: // Country (Chakra Select)
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="country">Country:</FormLabel>
              <Select
                id="country"
                name="country"
                value={formData.country} // Expects country CODE ('CA')
                onChange={handleChange} // Use generic handler (clears province)
                isDisabled={isDisabled}
                placeholder="Select country"
                bg="black"
                color="white"
                sx={{
                  option: {
                    bg: "white",
                    color: "black",
                    _hover: {
                      bg: "gray.100"
                    }
                  }
                }}
              >
                {countryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        );
      // --- Step 5: Province/State (Using react-country-region-selector) ---
      case 5:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="province-select">Province / State:</FormLabel>
              <Select
                id="province-select"
                value={formData.province}
                onChange={(e) => handleRegionChange(e.target.value)}
                isDisabled={isDisabled || !formData.country}
                placeholder="Select Region"
                bg="black"
                color="white"
                sx={{
                  option: {
                    bg: "white",
                    color: "black",
                    _hover: {
                      bg: "gray.100"
                    }
                  }
                }}
              >
                {State.getStatesOfCountry(formData.country).map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        );
      // --- End Step 5 ---

      // --- TODO: Add Cases 6 through 13 using appropriate Chakra components ---
      // Remember: Use Textarea for multi-line, Checkbox for boolean, Select for Activity Level

      default:
        return <Box>Step {step} rendering not implemented yet (Chakra UI).</Box>;
    }
  };
  // --- End Refactored Rendering Logic ---


  // --- Main Component Return ---
  if (isFetching) { return <Box p={5} textAlign="center">Loading your profile...</Box>; }
  // Added fetch error display back
  if (fetchError) { return ( <Box className="profile-form-container" maxW="600px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="base"><Alert status="error"><AlertIcon />{fetchError}</Alert></Box> ); }


  return (
    <Box className="profile-form-container" maxW="600px" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="base">
       <Heading as="h2" size="lg" textAlign="center" mb={6}>Your Profile</Heading>
       {submitError && ( <Alert status="error" mb={4} borderRadius="md"><AlertIcon /><AlertDescription>{submitError}</AlertDescription></Alert> )}
       {successMessage && ( <Alert status="success" mb={4} borderRadius="md"><AlertIcon /><AlertDescription>{successMessage}</AlertDescription></Alert> )}
       <Progress value={((step - 1) / (totalSteps - 1)) * 100} size="sm" colorScheme="teal" mb={6} hasStripe isAnimated={isSubmitting} />

       {!fetchError && ( // Should always be true if we return early on fetchError above
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
};

export default ProfileForm;