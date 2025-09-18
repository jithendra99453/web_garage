import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SchoolSignUp.module.css';

const SchoolSignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    school: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/register/school', formData);

      console.log('Server response:', response.data.message);
      alert('School account created successfully!');

      navigate('/login?role=teacher');

    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data.message : error.message);
      alert('Registration failed: ' + (error.response ? error.response.data.message : 'Please try again later.'));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Teacher / School Sign Up</h2>
        <p className={styles.subtitle}>Create your EcoQuest Teacher Account</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className={styles.formInput} value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className={styles.formInput} value={formData.password} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="school">School Name</label>
            <input type="text" id="school" name="school" className={styles.formInput} value={formData.school} onChange={handleInputChange} required />
          </div>
          <button type="submit" className={styles.submitButton}>Create Account</button>
        </form>
        <p className={styles.switchLink}>
          Already have an account? <Link to="/login?role=teacher">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SchoolSignUp;
