import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Import useNavigate
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); // Initialize navigate
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student'; // Default to student if no role is specified

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${role} with data:`, formData);
    alert(`Login successful for ${formData.email}!`);
    // In a real app, you would redirect after successful login: navigate('/dashboard');
  };

  // This function redirects the user to the correct sign-up page
  const handleSignUpRedirect = () => {
    const signUpPath = role === 'teacher' ? '/signup/school' : '/signup/student';
    navigate(signUpPath);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Log In</h2>
        <p className={styles.subtitle}>Welcome back to EcoQuest</p>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className={styles.formInput} value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className={styles.formInput} value={formData.password} onChange={handleInputChange} required />
          </div>
          <button type="submit" className={styles.submitButton}>Log In</button>
        </form>

        {/* Separator */}
        <div className={styles.separator}>
          <span>OR</span>
        </div>

        {/* Button to redirect to the correct Sign-Up page */}
        <button
          type="button" // Important: prevents form submission
          className={styles.secondaryButton}
          onClick={handleSignUpRedirect}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
