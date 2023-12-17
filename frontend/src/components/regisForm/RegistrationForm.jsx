import React, { useState, useEffect } from 'react';

export const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    birthDate: '',
    selectedBatch: 'Select Your Batch',
    agreeTerms: false,
  });

  const [userAge, setUserAge] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    if (formData.birthDate) {
      setUserAge(calculateAge(formData.birthDate));
    }
  }, [formData.birthDate]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.birthDate) {
      errors.birthDate = 'Birth Date is required';
    } else if (userAge < 18 || userAge > 65) {
      errors.age = 'You must be between 18 and 65 years old to fill this form.';
    }

   
    if (formData.selectedBatch === 'Select Your Batch') {
      errors.selectedBatch = 'Please select your batch';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/submitForm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          setSubmissionStatus('success');
          // Optionally, update state to show a success message to the user
        } else {
          console.error('Form submission failed');
          setSubmissionStatus('error');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmissionStatus('error');
      }
    }
  };

  return (
    <div className="container-fluid">
      <form className="container w-50 mt-5 p-4 bg-light rounded shadow" onSubmit={handleFormSubmit}>
        <FormField
          label="Full Name"
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          error={formErrors.fullName}
        />

        <FormField
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={formErrors.email}
        />

        <FormField
          label="Birth Date"
          type="date"
          id="birthdate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          error={formErrors.birthDate || formErrors.age}
        />

        <FormField
          label="Select Your Batch"
          type="select"
          id="batch"
          name="selectedBatch"
          value={formData.selectedBatch}
          onChange={handleInputChange}
          options={['Select Your Batch', '6-7 AM', '7-8 AM', '8-9 AM', '5-6 PM']}
          error={formErrors.selectedBatch}
        />

        <div className="mb-4 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="agreeTerms">
            Check me out
          </label>
          {formErrors.agreeTerms && <div className="text-danger">{formErrors.agreeTerms}</div>}
        </div>

        {submissionStatus === 'success' && (
          <div className="alert alert-success" role="alert">
            Payment successful!
          </div>
        )}

        {submissionStatus === 'error' && (
          <div className="alert alert-danger" role="alert">
            Form submission failed. Please try again.
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={!formData.agreeTerms}>
          PAY ₹500/MONTH
        </button>
      </form>
    </div>
  );
};

const FormField = ({ label, type, id, name, value, onChange, options, error }) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label text-start">
        {label}
      </label>
      {type === 'select' ? (
        <select
          className={`form-select ${error ? 'is-invalid' : ''}`}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
        />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
