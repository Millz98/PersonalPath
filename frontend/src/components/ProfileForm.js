// src/components/ProfileForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth
import './ProfileForm.css';

const ProfileForm = () => {
  const { logout } = useAuth(); // <-- Get logout function from context
  const [step, setStep] = useState(1);
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
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const totalSteps = 13;

  // State for data fetching
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  // State for submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Form Submission Handler (Using PATCH)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      console.log("Submitting profile data:", formData);
      const response = await axios.patch('/api/users/profile/', formData); // Using PATCH
      console.log('Profile update response:', response.data);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
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

  // Rendering Logic for Form Steps
  const renderForm = () => {
    const isDisabled = isFetching || isSubmitting;
    // IMPORTANT: Add cases for ALL steps (2-13) here, similar to case 1
    // Make sure every input/select/textarea uses disabled={isDisabled}
    // and value={formData.fieldName} / checked={formData.fieldName}
    switch (step) {
      case 1:
        return (
          <div className={`form-step ${step === 1 ? 'active' : ''}`}>
            <div>
              <label htmlFor="age">Age:</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required disabled={isDisabled} />
            </div>
          </div>
        );
      // --- Add cases 2 through 13 here ---
      // --- Remember to implement the JSX for each step's fields ---
      // Example for Step 2 (Height):
      // case 2:
      //   return (
      //     <div className={`form-step ${step === 2 ? 'active' : ''}`}>
      //       <div>
      //         <label htmlFor="height_cm">Height (cm):</label>
      //         <input type="number" id="height_cm" name="height_cm" value={formData.height_cm} onChange={handleChange} required disabled={isDisabled} />
      //       </div>
      //     </div>
      //   );
      // ... etc for all steps ...

      default:
        return <div>Step {step} rendering not implemented yet. Please add case {step} to renderForm().</div>;
    }
  };

  // --- Main Component Return ---
  if (isFetching) {
    return <div>Loading your profile...</div>;
  }
  if (fetchError) {
    return <div className="profile-form-container"><p className="error-message">{fetchError}</p></div>;
  }

  return (
    <div className="profile-form-container">
      <h2>Your Profile</h2>
      {submitError && <p className="error-message">{submitError}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="form-content-wrapper">
        <form onSubmit={handleSubmit} className={`step-${step}`}>
          {renderForm()} {/* Render current step's inputs */}

          {/* Navigation/Submit Buttons */}
          <div className={`navigation-buttons ${step === 1 ? 'step-one-centering' : ''}`}>
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn-prev" disabled={isSubmitting}>
                Previous
              </button>
            )}
            {step < totalSteps && (
              <button type="button" onClick={nextStep} className="btn-next" disabled={isSubmitting}>
                Next
              </button>
            )}
            {step === totalSteps && (
              <button type="submit" className="btn-submit" disabled={isFetching || isSubmitting}>
                 {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
            )}
          </div>
        </form> {/* End of Form */}

        {/* === Add Logout Button Section Below Form === */}
        <div style={{
            marginTop: '30px',      // Space above the button section
            paddingTop: '20px',     // Space within the section above button
            borderTop: '1px solid #eee', // Optional separator line
            textAlign: 'center'     // Center the button horizontally
        }}>
          <button
            onClick={logout} // Call the logout function from context
            style={{ // Basic styling - replace with CSS class or Chakra Button later
              padding: '10px 25px', // Make it reasonably sized
              fontSize: '1em',
              backgroundColor: '#6c757d', // Secondary/neutral color
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
        {/* === End Logout Button Section === */}

      </div> {/* End form-content-wrapper */}
    </div> // End profile-form-container
  );
};

export default ProfileForm;