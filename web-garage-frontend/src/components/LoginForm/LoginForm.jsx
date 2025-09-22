import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api'; // Use the centralized api instance
import UserContext from '../../context/UserContext'; // Import the context
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';

  // Get the refresh function from the context
  const { refreshStudentData } = useContext(UserContext);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginUrl = role === 'student' 
      ? '/auth/login/student' 
      : '/auth/login/teacher';
    
    try {
      const response = await api.post(loginUrl, formData); // Use 'api' instance
      
      // 1. Save the token to local storage
      localStorage.setItem('token', response.data.token);
      
      // 2. CRUCIAL: Await the user data refresh
      await refreshStudentData();
      
      // 3. Now navigate to the dashboard
      alert('Login successful!');
      navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Please check your credentials.';
      console.error('Login failed:', errorMessage);
      alert('Login failed: ' + errorMessage);
    }
  };

  // ... (the rest of your component's JSX remains the same)
  // handleSignUpRedirect function also remains the same

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Log In</h2>
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
      </div>
    </div>
  );
};

export default LoginForm;
