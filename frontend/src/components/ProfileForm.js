// src/components/ProfileForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileForm.css';

const ProfileForm = () => {
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

  // State for data fetching
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  // --- Add state for submission loading ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- End state for submission loading ---

  // Fetch Profile Data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsFetching(true);
      setFetchError('');
      setSuccessMessage('');
      setSubmitError('');

      try {
        console.log("Fetching profile data...");
        const response = await axios.get('/api/users/profile/');
        const profileData = response.data;
        console.log("Profile data received:", profileData);

        let updatedFormData = { ...formData };
        for (const key in updatedFormData) {
          if (profileData.hasOwnProperty(key)) {
            const backendValue = profileData[key];
            if (backendValue === null) {
              updatedFormData[key] = typeof updatedFormData[key] === 'boolean' ? false : '';
            } else {
              updatedFormData[key] = backendValue;
            }
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

  // Form Navigation
  const nextStep = () => setStep(prevStep => prevStep < totalSteps ? prevStep + 1 : prevStep);
  const prevStep = () => setStep(prevStep => prevStep > 1 ? prevStep - 1 : prevStep);

  // Form Input Change Handler
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
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
    setIsSubmitting(true); // <<< Set submitting state TRUE

    try {
      console.log("Submitting profile data:", formData);
      // --- Use PATCH request for updating profile ---
      const response = await axios.patch('/api/users/profile/', formData);
      // ---------------------------------------------
      console.log('Profile update response:', response.data);
      setSuccessMessage('Profile updated successfully!');
      // Optional: Update local state if backend returns updated object
      // setFormData(response.data);

    } catch (error) { // --- Improved Error Handling ---
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
      // --- End Improved Error Handling ---
    } finally {
      setIsSubmitting(false); // <<< Set submitting state FALSE
    }
  };
  // --- End Updated Form Submission Handler ---

  // --- Rendering Logic for Form Steps ---
  const renderForm = () => {
    // Make sure all inputs inside the steps are disabled when fetching or submitting
    const isDisabled = isFetching || isSubmitting;

    switch (step) {
      // --- Example: Step 1 ---
      case 1:
        return (
          <div className={`form-step ${step === 1 ? 'active' : ''}`}>
            <div>
              <label htmlFor="age">Age:</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required disabled={isDisabled} />
            </div>
          </div>
        );
      // --- Example: Step 7 (Checkbox) ---
       case 7:
         return (
           <div className={`form-step ${step === 7 ? 'active' : ''}`}>
             <div>
               {/* Checkbox labels often wrap the input */}
               <label htmlFor="has_gym_membership">
                 <input type="checkbox" id="has_gym_membership" name="has_gym_membership" checked={formData.has_gym_membership} onChange={handleChange} disabled={isDisabled} />
                 Do you have a gym membership?
               </label>
             </div>
           </div>
         );
       // --- Example: Step 12 (Select) ---
       case 12:
         return (
           <div className={`form-step ${step === 12 ? 'active' : ''}`}>
             <div>
               <label htmlFor="activity_level">Activity Level:</label>
               <select id="activity_level" name="activity_level" value={formData.activity_level} onChange={handleChange} disabled={isDisabled}>
                 <option value="sedentary">Sedentary</option>
                 <option value="lightly_active">Lightly Active</option>
                 <option value="moderately_active">Moderately Active</option>
                 <option value="very_active">Very Active</option>
                 {/* Ensure options match backend model choices */}
               </select>
             </div>
           </div>
         );

      // --- Add Cases for steps 2-6, 8-11, 13 ---
      // Ensure each input/textarea/select uses:
      // - name="fieldName"
      // - value={formData.fieldName} (or checked for checkbox)
      // - onChange={handleChange}
      // - disabled={isDisabled}

      // --- Default case ---
      default:
        // Handle invalid step or provide a default view if not using multi-step
        return <div>Step {step} rendering not implemented yet.</div>;
    }
  };
  // --- End Rendering Logic ---


  // --- Main Component Return ---
  // Show loading indicator while fetching initial data
  if (isFetching) {
    return <div>Loading your profile...</div>;
  }

  // Show error message if initial fetch failed
  if (fetchError) {
    return <div className="profile-form-container"><p className="error-message">{fetchError}</p></div>;
  }

  // Render the form
  return (
    <div className="profile-form-container">
      <h2>Your Profile</h2>
      {/* Display submission status messages */}
      {submitError && <p className="error-message">{submitError}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="form-content-wrapper">
        {/* Optional: Progress bar */}
        {/* ... */}

        <form onSubmit={handleSubmit} className={`step-${step}`}>
          {renderForm()} {/* Render current step's inputs */}

          {/* Navigation/Submit Buttons */}
          <div className="navigation-buttons">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn-prev" disabled={isSubmitting}> {/* Only disable during submit */}
                Previous
              </button>
            )}
            {step < totalSteps && (
              <button type="button" onClick={nextStep} className="btn-next" disabled={isSubmitting}> {/* Only disable during submit */}
                Next
              </button>
            )}
            {step === totalSteps && (
              <button type="submit" className="btn-submit" disabled={isFetching || isSubmitting}> {/* Disable if fetching OR submitting */}
                 {isSubmitting ? 'Updating...' : 'Update Profile'} {/* Change text when submitting */}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;