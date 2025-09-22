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
    educationType: 'school',
    school: '',
    mentor: '',
    classId: '', 
  });

  // State for each dropdown's options
  const [availableSchools, setAvailableSchools] = useState([]);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);

  // Separate loading states for clarity
  const [mentorLoading, setMentorLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSchoolChange = (e) => {
    const schoolName = e.target.value;
    // Update the form data and CLEAR the dependent fields
    setFormData({
      ...formData,
      school: schoolName,
      mentor: '',
      classId: ''
    });
    setAvailableMentors([]);
    setAvailableClasses([]);

    // Now, fetch the mentors for the new school
    if (schoolName) {
      setMentorLoading(true);
      axios.get(`http://localhost:5000/api/teacher?schoolName=${encodeURIComponent(schoolName)}`)
        .then(res => setAvailableMentors(res.data))
        .catch(() => setError('Could not load teachers.'))
        .finally(() => setMentorLoading(false));
    }
  };

  const handleMentorChange = (e) => {
    const mentorId = e.target.value;
    // Update the form data and CLEAR the class field
    setFormData({
      ...formData,
      mentor: mentorId,
      classId: ''
    });
    setAvailableClasses([]);

    // Now, fetch the classes for the new mentor
    if (mentorId) {
      setClassLoading(true);
      axios.get(`http://localhost:5000/api/classes/teacher/${mentorId}`)
        .then(res => setAvailableClasses(res.data))
        .catch(() => setError('Could not load classes.'))
        .finally(() => setClassLoading(false));
    }
  };
  

  // 1. Fetch schools on initial component load
  useEffect(() => {
    axios.get('http://localhost:5000/api/schools')
      .then(response => {
        setAvailableSchools(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch schools:', error);
        setError('Could not load institution list.');
      });
  }, []);

  // 2. Fetch teachers when a school is selected
  useEffect(() => {
    if (!formData.school) {
      setAvailableMentors([]);
      setAvailableClasses([]);
      setFormData(prev => ({ ...prev, mentor: '', classId: '' }));
      return;
    }
    
    setMentorLoading(true);
    axios.get(`http://localhost:5000/api/teacher?schoolName=${encodeURIComponent(formData.school)}`)
      .then(response => {
        setAvailableMentors(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch mentors:', error);
        setError('Could not load teachers for this institution.');
        setAvailableMentors([]);
      })
      .finally(() => {
        setMentorLoading(false);
      });
  }, [formData.school]);

  // 3. Fetch classes when a teacher is selected
  useEffect(() => {
    if (!formData.mentor) {
      setAvailableClasses([]);
      setFormData(prev => ({ ...prev, classId: '' }));
      return;
    }
    
    setClassLoading(true);
    axios.get(`http://localhost:5000/api/classes/teacher/${formData.mentor}`)
      .then(response => {
        setAvailableClasses(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch classes:', error);
        setError('Could not load classes for this teacher.');
        setAvailableClasses([]);
      })
      .finally(() => {
        setClassLoading(false);
      });
  }, [formData.mentor]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // --- THIS IS THE FIX ---
  // Add '!formData.classId' to the validation check.
  if (!formData.school || !formData.mentor || !formData.classId) {
    alert('Please select your institution, mentor, and class before creating an account.');
    return;
  }
  console.log('Submitting form with this data:', formData);
  try {
    // The formData now correctly includes school, mentor, and classId
    await axios.post('http://localhost:5000/api/auth/register/student', formData);
    alert('Student account created successfully!');
    navigate('/login?role=student');
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    alert('Registration failed: ' + errorMessage);
  }
};


  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Student Sign Up</h2>
        <p className={styles.subtitle}>Create your EcoQuest Student Account</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* All input fields */}
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
            <select id="school" name="school" className={styles.formSelect} value={formData.school} onChange={handleSchoolChange} required>
              <option value="" disabled>-- Select your institution --</option>
              {availableSchools.map(schoolName => (
                <option key={schoolName} value={schoolName}>{schoolName}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="mentor">Teacher / Mentor Name</label>
            <select id="mentor" name="mentor" className={styles.formSelect} value={formData.mentor} onChange={handleMentorChange} required disabled={!formData.school || mentorLoading}>
              <option value="">{mentorLoading ? 'Loading teachers...' : 'Select a Teacher / Mentor'}</option>
              {availableMentors.map(mentor => (
                <option key={mentor._id} value={mentor._id}>{mentor.name}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="classId">Select Class</label>
            <select id="classId" name="classId" className={styles.formSelect} value={formData.classId} onChange={handleInputChange} required disabled={!formData.mentor || classLoading}>
                            <option value="">{classLoading ? 'Loading classes...' : 'Select a Class'}</option>
              {availableClasses.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}
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
