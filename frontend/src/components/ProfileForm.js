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
  Spacer,
  Text,
  Radio,
  RadioGroup,
  HStack 
} from '@chakra-ui/react';
// --- End Chakra UI Imports ---

// Import CSS for styling RegionDropdown if needed
import './ProfileForm.css';

const ProfileForm = () => {
  const { logout } = useAuth();
  const [step, setStep] = useState(1);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [formData, setFormData] = useState({
    age: '',
    height_cm: '',
    current_weight_kg: '',
    country: 'CA', // Default country code
    province: '',  // Province/State name
    city: '',
    physical_issues: '',
    has_gym_membership: false,
    gym_details: '',
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
  const totalSteps = 15;
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

  // --- useEffect to update Provinces when Country changes ---
  useEffect(() => {
    // Check if formData.country has a value (a 2-letter code like 'CA')
    if (formData.country && formData.country.length === 2) {
      console.log(`Fetching states for country code: ${formData.country}`);
      // Get states for the selected country code
      const states = State.getStatesOfCountry(formData.country); // Uses 'State' import
      // Format for Chakra Select options: value=name, label=name
      const options = states.map(state => ({
        value: state.name, // Storing full name for simplicity
        label: state.name
      }));
      setProvinceOptions(options); // Uses 'setProvinceOptions'
      console.log(`Found ${options.length} states/provinces for ${formData.country}.`);
    } else {
      // Clear options if no valid country code is selected
      console.log("Clearing province options due to invalid/missing country code.");
      setProvinceOptions([]); // Uses 'setProvinceOptions'
    }
  }, [formData.country]); // Rerun ONLY when the country code changes

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
        // If country SELECT changed, clear province state AND options
        if (name === 'country') {
            console.log("Country changed via handleChange, clearing province and options.");
            newState.province = '';
            setProvinceOptions([]); // <<< Uses 'setProvinceOptions'
        }
        return newState;
    });
  };
  
  const handleRadioChange = (name, nextValue) => {
    const booleanValue = nextValue === 'true';
    setFormData(prevFormData => {
      const newState = {
        ...prevFormData,
        [name]: booleanValue
      };
      if (name === 'has_gym_membership' && !booleanValue) {
        newState.gym_details = ''; // Clear gym details if "No"
      }
      return newState;
    });
  };
  // --- Form Submission Handler ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');
    setIsSubmitting(true); // Set loading state

    try {
      console.log("Submitting profile data:", formData);
      // Use PATCH request
      const response = await axios.patch('/api/users/profile/', formData);
      // Use the response variable (e.g., for logging)
      console.log('Profile update response:', response.data);
      setSuccessMessage('Profile updated successfully!');

    } catch (error) { // Use the full error handling block
      console.error('Profile update error:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
          const errors = error.response.data;
          // Handle DRF object errors
          if (typeof errors === 'object' && errors !== null) {
              const fieldErrorMessages = Object.entries(errors)
                  .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
                  .join('; ');
              setSubmitError(`Update failed: ${fieldErrorMessages}`);
          // Handle simple string errors
          } else if (typeof errors === 'string') {
              setSubmitError(`Update failed: ${errors}`);
          // Handle other unexpected formats
          } else {
              setSubmitError('Update failed. An unexpected error format was received.');
          }
      } else {
          // Handle network errors etc.
          setSubmitError('Update failed. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false); // Ensure loading state is turned off
    }
  };
  // --- End Form Submission Handler ---


  // --- Refactored Rendering Logic ---
  const renderForm = () => {
    const isDisabled = isFetching || isSubmitting;
    switch (step) {
      case 1: // Age
        return ( <VStack spacing={4} align="stretch"><FormControl isRequired><FormLabel htmlFor="age">Age:</FormLabel><Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} isDisabled={isDisabled} placeholder="Enter your age" /* bg="black" color="white" etc. if desired */ /></FormControl></VStack> );
      case 2: // Height
        return ( <VStack spacing={4} align="stretch"><FormControl isRequired><FormLabel htmlFor="height_cm">Height (cm):</FormLabel><Input id="height_cm" name="height_cm" type="number" value={formData.height_cm} onChange={handleChange} isDisabled={isDisabled} placeholder="Enter height in centimeters" /* bg="black" color="white" etc. if desired */ /></FormControl></VStack> );
      case 3: // Weight
        return ( <VStack spacing={4} align="stretch"><FormControl isRequired><FormLabel htmlFor="current_weight_kg">Current Weight (kg):</FormLabel><Input id="current_weight_kg" name="current_weight_kg" type="number" value={formData.current_weight_kg} onChange={handleChange} isDisabled={isDisabled} placeholder="Enter current weight" step="0.1" /* bg="black" color="white" etc. if desired */ /></FormControl></VStack> );
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
                bg="black" // Your style
                color="white" // Your style
                sx={{
                  option: {
                    bg: "white", // Options light for readability
                    color: "black",
                    _hover: { bg: "gray.100" }
                  },
                  // Ensure dark mode options are also readable if you implement dark mode
                  '[data-chakra-ui-color-mode=dark] & option': {
                     bg: "gray.700", // Dark mode option background
                     color: "whiteAlpha.900"  // Dark mode option text
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
        case 5:
          return (
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel htmlFor="province">Province / State:</FormLabel> {/* Use name "province" for label */}
                <Select
                  id="province" // Match name
                  name="province" // For handleChange
                  value={formData.province}
                  onChange={handleChange} // Use generic handleChange
                  isDisabled={isDisabled || !formData.country || provinceOptions.length === 0}
                  placeholder={!formData.country ? "Select a country first" : (provinceOptions.length > 0 ? "Select province/state" : "N/A for selected country")}
                  sx={{
                    'option': { backgroundColor: 'white', color: '#1A202C'}, // For light mode
                    '[data-chakra-ui-color-mode=dark] & option': { backgroundColor: 'gray.700', color: 'whiteAlpha.900'} // Or your dark mode colors
                  }}
                >
                  {/* Map over the dynamically generated provinceOptions state */}
                  {provinceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {provinceOptions.length === 0 && formData.country && !isFetching && !isSubmitting &&
                  <Text fontSize="sm" color="gray.500" mt={1}>No provinces/states listed for this country.</Text>
                }
              </FormControl>
            </VStack>
          );
        // --- End Step 5 ---
      case 6: // City/Town (Chakra UI Input)
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="city">City / Town:</FormLabel>
              <Input
                id="city" name="city" type="text"
                value={formData.city} onChange={handleChange}
                isDisabled={isDisabled || !formData.province}
                placeholder="Enter your city or town"
                // Add your styling props if desired
                // bg="black" color="white" borderColor="gray.600" ...
              />
            </FormControl>
          </VStack>
        );
      case 7: // Physical Issues (Textarea)
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel htmlFor="physical_issues">Physical Issues / Limitations:</FormLabel>
              <Textarea
                id="physical_issues" name="physical_issues"
                value={formData.physical_issues} onChange={handleChange}
                isDisabled={isDisabled}
                placeholder="e.g., Bad knees, lower back pain..."
                // Add your styling props if desired
                // bg="black" color="white" borderColor="gray.600" ...
              />
            </FormControl>
          </VStack>
        );
      // --- Step 8 (Previously 7): Gym Membership (Using Chakra UI RadioGroup) ---
      case 8:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl as="fieldset"> {/* Use as="fieldset" for radio groups for accessibility */}
              <FormLabel as="legend"> {/* Use as="legend" for the label of a radio group */}
                Do you have a gym membership?
              </FormLabel>
              <RadioGroup
                name="has_gym_membership"
                // Pass the string version of the boolean state
                value={String(formData.has_gym_membership)}
                // Use the specific handler
                onChange={(nextValue) => handleRadioChange("has_gym_membership", nextValue)}
                isDisabled={isDisabled}
              >
                <HStack spacing={5}> {/* Layout radio buttons horizontally */}
                  <Radio value="true" colorScheme="teal"> {/* String value "true" */}
                    Yes
                  </Radio>
                  <Radio value="false" colorScheme="red"> {/* String value "false" */}
                    No
                  </Radio>
                </HStack>
              </RadioGroup>
              {/* <FormHelperText>Select one option.</FormHelperText> */}
            </FormControl>
          </VStack>
        );
      // --- End Step 8 ---

      // --- Step 9 (Previously 8): Home Equipment (Using Chakra UI Textarea) ---
      case 9:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl> {/* Optional field */}
              <FormLabel htmlFor="home_equipment">
                Home Fitness Equipment:
              </FormLabel>
              <Textarea
                id="home_equipment"
                name="home_equipment"
                value={formData.home_equipment}
                onChange={handleChange}
                isDisabled={isDisabled}
                placeholder="e.g., Dumbbells, resistance bands, yoga mat, treadmill..."
                size="md"
                // --- Add your styling props to match other inputs ---
                // Example:
                // bg="black"
                // color="white"
                // borderColor="gray.600" // Example border for dark input on dark theme
                // _hover={{ borderColor: "gray.500" }}
                // _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                // --- End styling props ---
              />
            </FormControl>
          </VStack>
        );
      // --- End Step 9 ---

      // --- TODO: Add Cases 10 through 14 ---
      // Step 10 (Prev 9): dietary_preferences (Input)
      // Step 11 (Prev 10): food_allergies (Textarea)
      // Step 12 (Prev 11): disliked_foods (Textarea)
      // Step 13 (Prev 12): activity_level (Select)
      // Step 14 (Prev 13): weight_loss_goal_kg (Input), desired_loss_rate (Input)

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
               {step > 1 && ( <Button onClick={prevStep} variant="outline" colorScheme="teal" isDisabled={isSubmitting}>Previous</Button> )}
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