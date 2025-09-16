import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios
import styles from './StudentSignUp.module.css';

// Data and initial component setup remains the same...
const schoolData = {
  school: ['Greenwood High', 'Oakridge International', 'Delhi Public School'],
  college: ["St. Xavier's College", 'Loyola College', 'Christ University'],
  ug: ['IIT Bombay', 'University of Hyderabad', 'BITS Pilani'],
  pg: ['IIM Ahmedabad', 'Jawaharlal Nehru University', 'Tata Institute of Social Sciences'],
};

const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    address: '',
    educationType: 'school',
    school: '',
    mentor: '',
  });

  const [availableSchools, setAvailableSchools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAvailableSchools(schoolData[formData.educationType] || []);
    setFormData(prev => ({ ...prev, school: '' }));
  }, [formData.educationType]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 2. Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Send the form data to the backend
      const response = await axios.post('http://localhost:5000/api/register/student', formData);

      console.log('Server response:', response.data.message);
      alert('Student account created successfully!');

      // Redirect to the login page on success
      navigate('/login?role=student');

    } catch (error) {
      // Handle errors (e.g., email already exists, server is down)
      console.error('Registration failed:', error.response ? error.response.data.message : error.message);
      alert('Registration failed: ' + (error.response ? error.response.data.message : 'Please try again later.'));
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
              {availableSchools.map(s => <option key={s} value={s}>{s}</option>)}
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