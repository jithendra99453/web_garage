import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginForm.module.css';

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
    
    // --- UPDATED LOGIC ---
    // Use relative paths that will work with your Vite proxy.
    // The endpoint for teacher login is now /login/teacher.
    const loginUrl = role === 'student' 
      ? '/api/auth/login/student' 
      : '/api/auth/login/teacher'; // Corrected from /login/school
    
    try {
      const response = await axios.post(loginUrl, formData);
      
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      
      // Redirect to the appropriate dashboard
      navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Please check your credentials.';
      console.error('Login failed:', errorMessage);
      alert('Login failed: ' + errorMessage);
    }
  };

  const handleSignUpRedirect = () => {
    // --- UPDATED LOGIC ---
    // Redirect to the new teacher signup route
    const signUpPath = role === 'teacher' ? '/signup/teacher' : '/signup/student';
    navigate(signUpPath);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Log In</h2>
        <p className={styles.subtitle}>Welcome back to EcoQuest</p>
        
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

        <div className={styles.separator}>
          <span>OR</span>
        </div>

        <button
          type="button"
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
