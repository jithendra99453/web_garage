import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginForm.module.css'; // Renamed to match folder

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginUrl = role === 'student' ? 'http://localhost:5000/api/login/student' : 'http://localhost:5000/api/login/school';
    
    try {
      const response = await axios.post(loginUrl, formData);

      // --- Store the JWT in local storage ---
      localStorage.setItem('token', response.data.token);
      
      alert('Login successful!');
      
      // Redirect to the appropriate dashboard
      navigate(role === 'student' ? '/student-dashboard' : '/school-dashboard');

    } catch (error) {
      console.error('Login failed:', error.response?.data.message || error.message);
      alert('Login failed: ' + (error.response?.data.message || 'Please check your credentials.'));
    }
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
