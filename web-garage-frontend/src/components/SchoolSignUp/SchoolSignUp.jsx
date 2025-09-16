import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SchoolSignUp.module.css';
// Mock data for all institutions
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting School/Teacher Data:", formData);
    alert(`School account for ${formData.email} submitted!`);
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