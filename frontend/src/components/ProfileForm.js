// src/components/ProfileForm.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import axios from 'axios';
// We assume ProtectedRoute handles ensuring user is logged in
// and AuthContext interceptor handles adding the token.
import './ProfileForm.css';

const ProfileForm = () => {
  const [step, setStep] = useState(1); // Assuming multi-step structure remains
  const [formData, setFormData] = useState({
    // Initialize with default structure and empty/default values
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
    activity_level: 'sedentary', // Ensure this matches a valid <option> value
    weight_loss_goal_kg: '',
    desired_loss_rate: '',
  });
  // Renamed original 'error' to be specific to submission errors
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const totalSteps = 13; // Keep if using multi-step

  // --- State for data fetching ---
  const [isFetching, setIsFetching] = useState(true); // Start loading initially
  const [fetchError, setFetchError] = useState('');
  // --- End state for data fetching ---

  // --- useEffect to Fetch Profile Data ---
  useEffect(() => {
    // Define the async function to fetch data
    const fetchProfileData = async () => {
      setIsFetching(true); // Start loading
      setFetchError('');    // Clear previous fetch errors
      setSuccessMessage('');// Clear previous success messages
      setSubmitError(''); // Clear previous submit errors

      try {
        console.log("Fetching profile data...");
        // Make GET request to the protected profile endpoint.
        // The Axios interceptor from AuthContext should add the Auth header.
        const response = await axios.get('/api/users/profile/');
        const profileData = response.data;
        console.log("Profile data received:", profileData);

        // Update local form state with fetched data, handling nulls
        // Create a copy of the current state structure
        let updatedFormData = { ...formData };
        // Iterate over the keys defined in the initial formData state
        for (const key in updatedFormData) {
          // Check if the fetched data has this key
          if (profileData.hasOwnProperty(key)) {
            const backendValue = profileData[key];
            // Handle null values from backend: map to empty string or boolean default
            if (backendValue === null) {
              updatedFormData[key] = typeof updatedFormData[key] === 'boolean' ? false : '';
            } else {
              // Otherwise, use the value from the backend
              updatedFormData[key] = backendValue;
            }
          }
          // If key exists in formData but not profileData, it keeps its default initial value
        }

        setFormData(updatedFormData); // Update the state

      } catch (error) {
        console.error('Failed to fetch profile data:', error.response ? error.response.data : error.message);
        setFetchError('Failed to load your profile information. Please try refreshing the page or contact support if the problem persists.');
        // You might want specific checks here, e.g., if error is 401, trigger logout via context?
      } finally {
        setIsFetching(false); // Stop loading regardless of success/error
      }
    };

    fetchProfileData(); // Call the fetch function

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this effect runs only once when component mounts
  // --- End useEffect ---

  // --- Form Navigation and Change Handling (Keep as is for now) ---
  const nextStep = () => setStep(prevStep => prevStep < totalSteps ? prevStep + 1 : prevStep);
  const prevStep = () => setStep(prevStep => prevStep > 1 ? prevStep - 1 : prevStep);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  // --- End Form Navigation ---

  // --- Form Submission ---
  // TODO: Update this function to use axios.patch or axios.put
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');
    // Add submitting state maybe: const [isSubmitting, setIsSubmitting] = useState(false);
    // setIsSubmitting(true);

    try {
      // IMPORTANT: Change this to PATCH or PUT for updates!
      console.log("Submitting profile data:", formData);
      // const response = await axios.patch('/api/users/profile/', formData); // Use PATCH for partial updates
      const response = await axios.post('/api/users/profile/', formData); // Placeholder - MUST CHANGE
      console.log('Profile update response:', response.data);
      setSuccessMessage('Profile updated successfully!');

    } catch (error) {
      console.error('Profile update error:', error.response ? error.response.data : error.message);
      // TODO: Improve error parsing for submission errors
      setSubmitError('Failed to update profile. Please check your inputs and try again.');

    } finally {
      // setIsSubmitting(false);
    }
  };
  // --- End Form Submission ---


  // --- Rendering Logic ---
  const renderForm = () => {
    // If keeping multi-step, ensure each input uses the correct formData field
    // Example for step 1 (Age) - Add disabled={isFetching} to inputs
    switch (step) {
         case 1:
           return (
             <div className={`form-step ${step === 1 ? 'active' : ''}`}>
               <div>
                 <label htmlFor="age">Age:</label>
                 <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required disabled={isFetching} />
               </div>
             </div>
           );
        // ... other cases for steps 2-13, ensuring 'value={formData.fieldName}' and 'disabled={isFetching}'
        // Default case or handling for single-step form needed if not multi-step
        default:
             // Placeholder: Render all fields if not using steps or step is invalid
             // You'll need to structure this properly if removing steps
            return <div>Implement form rendering here (or use multi-step cases)</div>;
       }
  };

  // --- Main Component Return ---
  // Display loading indicator while fetching
  if (isFetching) {
    return <div>Loading your profile...</div>;
  }

  // Display error if fetching failed
  if (fetchError) {
    return <div className="profile-form-container"><p className="error-message">{fetchError}</p></div>;
  }

  // Render the form if fetching succeeded
  return (
    <div className="profile-form-container">
      <h2>Your Profile</h2>
      {/* Display submission status messages */}
      {submitError && <p className="error-message">{submitError}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="form-content-wrapper">
        {/* Optional: Add progress bar for multi-step */}
        {/* <div className="progress-bar-container">...</div> */}

        <form onSubmit={handleSubmit} className={`step-${step}`}>
          {renderForm()} {/* Renders the current step */}

          {/* Navigation/Submit Buttons */}
          <div className="navigation-buttons">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn-prev" disabled={isFetching /* Add || isSubmitting */}>
                Previous
              </button>
            )}
            {step < totalSteps && (
              <button type="button" onClick={nextStep} className="btn-next" disabled={isFetching /* Add || isSubmitting */}>
                Next
              </button>
            )}
            {step === totalSteps && (
              <button type="submit" className="btn-submit" disabled={isFetching /* Add || isSubmitting */}>
                 {/* {isSubmitting ? 'Updating...' : 'Update Profile'} */}
                 Update Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;