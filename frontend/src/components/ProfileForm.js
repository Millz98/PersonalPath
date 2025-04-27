// src/components/ProfileForm.js
import React, { useState } from 'react';
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
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const totalSteps = 13;

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
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      // TODO: Add authentication header
      // const token = localStorage.getItem('token'); // Example
      // const response = await axios.post('/api/users/profile/', formData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      const response = await axios.post('/api/users/profile/', formData); // Using placeholder endpoint for now
      console.log('Profile updated:', response.data);
      setSuccessMessage('Profile updated successfully!');
      // Optionally reset form or redirect user
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error.response ? error.response.data : error.message);
    }
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <div className={`form-step ${step === 1 ? 'active' : ''}`}>
            <div>
              <label htmlFor="age">Age:</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
            </div>
          </div>
        );
      case 2:
        return (
          <div className={`form-step ${step === 2 ? 'active' : ''}`}>
            <div>
              <label htmlFor="height_cm">Height (cm):</label>
              <input type="number" id="height_cm" name="height_cm" value={formData.height_cm} onChange={handleChange} required />
            </div>
          </div>
        );
      case 3:
        return (
          <div className={`form-step ${step === 3 ? 'active' : ''}`}>
            <div>
              <label htmlFor="current_weight_kg">Current Weight (kg):</label>
              <input type="number" id="current_weight_kg" name="current_weight_kg" value={formData.current_weight_kg} onChange={handleChange} required />
            </div>
          </div>
        );
      case 4:
        return (
          <div className={`form-step ${step === 4 ? 'active' : ''}`}>
            <div>
              <label htmlFor="country">Country:</label>
              <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} required />
            </div>
          </div>
        );
      case 5:
        return (
          <div className={`form-step ${step === 5 ? 'active' : ''}`}>
            <div>
              <label htmlFor="province">Province:</label>
              <input type="text" id="province" name="province" value={formData.province} onChange={handleChange} required />
            </div>
          </div>
        );
      case 6:
        return (
          <div className={`form-step ${step === 6 ? 'active' : ''}`}>
            <div>
              <label htmlFor="physical_issues">Any physical issues, injuries, or limitations? (e.g., bad knees, back pain)</label>
              <textarea id="physical_issues" name="physical_issues" value={formData.physical_issues} onChange={handleChange} />
            </div>
          </div>
        );
      case 7:
        return (
          <div className={`form-step ${step === 7 ? 'active' : ''}`}>
            <div>
              <label htmlFor="has_gym_membership">Do you have a gym membership?</label>
              <input type="checkbox" id="has_gym_membership" name="has_gym_membership" checked={formData.has_gym_membership} onChange={handleChange} />
            </div>
          </div>
        );
      case 8:
        return (
          <div className={`form-step ${step === 8 ? 'active' : ''}`}>
            <div>
              <label htmlFor="home_equipment">What fitness equipment do you have available at home? (e.g., dumbbells, resistance bands, treadmill)</label>
              <textarea id="home_equipment" name="home_equipment" value={formData.home_equipment} onChange={handleChange} />
            </div>
          </div>
        );
      case 9:
        return (
          <div className={`form-step ${step === 9 ? 'active' : ''}`}>
            <div>
              <label htmlFor="dietary_preferences">Dietary Preferences (e.g., vegetarian, vegan, keto, low-carb, allergies):</label>
              <input type="text" id="dietary_preferences" name="dietary_preferences" value={formData.dietary_preferences} onChange={handleChange} />
            </div>
          </div>
        );
      case 10:
        return (
          <div className={`form-step ${step === 10 ? 'active' : ''}`}>
            <div>
              <label htmlFor="food_allergies">Food Allergies:</label>
              <textarea id="food_allergies" name="food_allergies" value={formData.food_allergies} onChange={handleChange} />
            </div>
          </div>
        );
      case 11:
        return (
          <div className={`form-step ${step === 11 ? 'active' : ''}`}>
            <div>
              <label htmlFor="disliked_foods">Any specific foods you dislike or prefer not to eat?</label>
              <textarea id="disliked_foods" name="disliked_foods" value={formData.disliked_foods} onChange={handleChange} />
            </div>
          </div>
        );
      case 12:
        return (
          <div className={`form-step ${step === 12 ? 'active' : ''}`}>
            <div>
              <label htmlFor="activity_level">Describe your typical daily activity level (excluding planned exercise):</label>
              <select name="activity_level" value={formData.activity_level} onChange={handleChange}>
                <option value="sedentary">Sedentary (little to no activity, desk job)</option>
                <option value="lightly_active">Lightly Active (light exercise/sports 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise/sports 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise/sports 6-7 days a week)</option>
                <option value="extra_active">Extra Active (very hard exercise/sports & physical job or 2x training)</option>
              </select>
            </div>
          </div>
        );
      case 13:
        return (
          <div className={`form-step ${step === 13 ? 'active' : ''}`}>
            <div>
              <label htmlFor="weight_loss_goal_kg">What is your target weight loss goal (in kg)?</label>
              <input type="number" id="weight_loss_goal_kg" name="weight_loss_goal_kg" value={formData.weight_loss_goal_kg} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="desired_loss_rate">What is your desired rate of weight loss per week? (e.g., 0.5 kg, 1 kg)</label>
              {/* Consider making this a dropdown for common rates */}
              <input type="text" id="desired_loss_rate" name="desired_loss_rate" value={formData.desired_loss_rate} onChange={handleChange} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const progressPercentage = totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0; // Avoid division by zero if totalSteps is 1

  return (
    <div className="profile-form-container">
      <h2>Your Profile</h2>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        <span>Step {step} of {totalSteps}</span>
      </div>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="form-content-wrapper">
        {/* Use onSubmit on the form itself, not a button */}
        <form onSubmit={handleSubmit} className={`step-${step}`}>
          {renderForm()}
          <div className="navigation-buttons">
            {step > 1 && ( // Corrected conditional rendering for Previous button
              <button type="button" onClick={prevStep} className="btn-prev">
                Previous
              </button>
            )}
            {step < totalSteps && ( // Show Next button if not the last step
              <button type="button" onClick={nextStep} className="btn-next">
                Next
              </button>
            )}
            {step === totalSteps && ( // Show Submit button only on the last step
              <button type="submit" className="btn-submit">
                Submit Profile
              </button>
            )}
          </div>
        </form> {/* Added closing form tag */}
      </div> {/* Added closing div tag for form-content-wrapper */}
    </div> // Added closing div tag for profile-form-container
  );
};

export default ProfileForm;