import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios
import styles from './SchoolSignUp.module.css';

// Data and initial component setup remains the same...
const allInstitutions = [
  'Greenwood High', 'Oakridge International', 'Delhi Public School',
  "St. Xavier's College", 'Loyola College', 'Christ University',
  'IIT Bombay', 'University of Hyderabad', 'BITS Pilani',
  'IIM Ahmedabad', 'Jawaharlal Nehru University', 'Tata Institute of Social Sciences'
];

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

  // 2. Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the form data to the backend
      const response = await axios.post('http://localhost:5000/api/register/school', formData);

      console.log('Server response:', response.data.message);
      alert('School account created successfully!');

      // Redirect to the login page on success
      navigate('/login?role=teacher');

    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data.message : error.message);
      alert('Registration failed: ' + (error.response ? error.response.data.message : 'Please try again later.'));
    }
  };


  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>School & Teacher Onboarding</h2>
        <p className={styles.subtitle}>Register your institution with EcoQuest</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">Official Email Address</label>
            <input type="email" id="email" name="email" className={styles.formInput} value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">Create a Password</label>
            <input type="password" id="password" name="password" className={styles.formInput} value={formData.password} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="school">Select Institution</label>
            <select id="school" name="school" className={styles.formSelect} value={formData.school} onChange={handleInputChange} required>
              <option value="" disabled>-- Select your institution --</option>
              {allInstitutions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
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