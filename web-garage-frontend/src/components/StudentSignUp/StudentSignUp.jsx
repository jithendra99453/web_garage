import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './StudentSignUp.module.css';

const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    address: '',
    educationType: 'school', // This will be the default value for the dropdown
    school: '',
    mentor: '',
  });

  const [availableSchools, setAvailableSchools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schools');
        setAvailableSchools(response.data);
      } catch (error) {
        console.error('Failed to fetch schools:', error);
      }
    };
    fetchSchools();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register/student', formData);
      alert('Student account created successfully!');
      navigate('/login?role=student');
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Please try again.';
      console.error('Registration failed:', errorMessage);
      alert('Registration failed: ' + errorMessage);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Student Sign Up</h2>
        <p className={styles.subtitle}>Create your EcoQuest Student Account</p>
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
            <label className={styles.formLabel} htmlFor="age">Age</label>
            <input type="number" id="age" name="age" className={styles.formInput} value={formData.age} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="address">Address</label>
            <input type="text" id="address" name="address" className={styles.formInput} value={formData.address} onChange={handleInputChange} required />
          </div>

          {/* --- EDUCATION LEVEL DROPDOWN --- */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="educationType">Education Level</label>
            <select id="educationType" name="educationType" className={styles.formSelect} value={formData.educationType} onChange={handleInputChange}>
              <option value="school">School (K-12)</option>
              <option value="college">College</option>
              <option value="ug">Undergraduate (UG)</option>
              <option value="pg">Postgraduate (PG)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="school">Select Institution</label>
            <select id="school" name="school" className={styles.formSelect} value={formData.school} onChange={handleInputChange} required>
              <option value="" disabled>-- Select your institution --</option>
              {availableSchools.map(schoolName => (
                <option key={schoolName} value={schoolName}>{schoolName}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="mentor">Teacher / Mentor Name</label>
            <input type="text" id="mentor" name="mentor" className={styles.formInput} value={formData.mentor} onChange={handleInputChange} required />
          </div>
          <button type="submit" className={styles.submitButton}>Create Account</button>
        </form>
        <p className={styles.switchLink}>
          Already have an account? <Link to="/login?role=student">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentSignUp;
