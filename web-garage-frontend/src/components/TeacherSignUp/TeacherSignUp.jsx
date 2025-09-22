import React, { useState, useEffect } from 'react'; // Import useEffect
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TeacherSignUp.module.css';

const TeacherSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    school: '',  // Changed 'school' to 'schoolName' to match the backend model
  });

  // New state for storing the list of schools and any errors
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // --- NEW: Fetch the list of schools when the component loads ---
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        // This route is already working in your schoolRoutes.js
        const response = await axios.get('http://localhost:5000/api/schools');
        setSchools(response.data);
      } catch (err) {
        console.error("Failed to fetch schools:", err);
        setError("Could not load the list of schools. Please try again.");
      }
    };

    fetchSchools();
  }, []); // The empty array ensures this runs only once on mount

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // This check now correctly reads the 'school' property from the state.
    if (!formData.school) {
        alert('Please select a school from the list.');
        return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register/teacher', formData);
      alert(response.data.message);
      navigate('/login?role=teacher');
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An unknown error occurred.';
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
            <input type="password" id="password" name="password" className={styles.formInput} value={formData.password} onChange={handleInputChange} minLength="6" required />
          </div>
          
          {/* --- THIS IS THE UPDATED PART --- */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="school">School</label>
            <select
              id="school"
              // --- FIX #2: This 'name' attribute MUST match the state key from FIX #1. ---
              name="school" 
              className={styles.formInput}
              value={formData.school}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select your school</option>
              {schools.map((schoolName) => (
                <option key={schoolName} value={schoolName}>{schoolName}</option>
              ))}
            </select>
          </div>
          {/* Display an error if schools could not be fetched */}
          {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

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
