import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TeacherSignUp.module.css'; // You can rename this CSS file if you like

const TeacherSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await axios.post('http://localhost:5000/api/auth/register/teacher', formData);

      alert(response.data.message);
      navigate('/login?role=teacher');
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An unknown error occurred.';
      console.error('Registration failed:', errorMessage);
      alert('Registration failed: ' + errorMessage);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Teacher Sign Up</h2>
        <p className={styles.subtitle}>Create your EcoQuest Teacher Account</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" className={styles.formInput} value={formData.name} onChange={handleInputChange} required />
          </div>
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

export default TeacherSignUp;
