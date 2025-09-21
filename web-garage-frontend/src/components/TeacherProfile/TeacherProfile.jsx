import React, { useState } from 'react';
import styles from './TeacherProfile.module.css';

const TeacherProfile = ({ teacher, onClose, onUpdate, onAddClass }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: teacher.name || '',
    email: teacher.email || '',
    phone: teacher.phone || '',
    school: teacher.school || '',
    subject: teacher.subject || '',
    experience: teacher.experience || '',
    bio: teacher.bio || ''
  });

  const [newClass, setNewClass] = useState({
    name: '',
    grade: '',
    section: '',
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    maxStudents: 40
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleClassChange = (field, value) => {
    setNewClass(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (profileData.phone && !/^\d{10}$/.test(profileData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number should be 10 digits';
    }

    if (!profileData.school.trim()) {
      newErrors.school = 'School name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateClass = () => {
    const newErrors = {};

    if (!newClass.name.trim()) {
      newErrors.name = 'Class name is required';
    }

    if (!newClass.grade.trim()) {
      newErrors.grade = 'Grade is required';
    }

    if (!newClass.section.trim()) {
      newErrors.section = 'Section is required';
    }

    if (!newClass.maxStudents || newClass.maxStudents < 1 || newClass.maxStudents > 100) {
      newErrors.maxStudents = 'Max students must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateProfile()) {
      onUpdate(profileData);
      setIsEditing(false);
    }
  };

  const handleAddClass = () => {
    if (validateClass()) {
      const classData = {
        ...newClass,
        id: Date.now(),
        teacherId: teacher.id,
        createdDate: new Date().toISOString().split('T')[0],
        students: [],
        tasks: [],
        submissions: [],
        ecoPoints: 0,
        badges: []
      };
      
      onAddClass(classData);
      
      // Reset form
      setNewClass({
        name: '',
        grade: '',
        section: '',
        academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        maxStudents: 40
      });
      
      alert('Class added successfully!');
    }
  };

  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Teacher Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Profile Tabs */}
        <div className={styles.profileTabs}>
          <button
            className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'classes' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            Add New Class
          </button>
        </div>

        <div className={styles.modalContent}>
          {activeTab === 'profile' && (
            <div className={styles.profileSection}>
              {/* Profile Header */}
              <div className={styles.profileHeader}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatar}>
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.profileInfo}>
                    <h3>{profileData.name || 'Teacher Name'}</h3>
                    <p>{profileData.email}</p>
                    <span className={styles.schoolBadge}>{profileData.school}</span>
                  </div>
                </div>
                <button
                  className={styles.editBtn}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Profile Form */}
              <div className={styles.profileForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      disabled={!isEditing}
                      className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={!isEditing}
                      className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
                      placeholder="10-digit phone number"
                    />
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>School Name *</label>
                    <input
                      type="text"
                      value={profileData.school}
                      onChange={(e) => handleProfileChange('school', e.target.value)}
                      disabled={!isEditing}
                      className={`${styles.input} ${errors.school ? styles.errorInput : ''}`}
                    />
                    {errors.school && <span className={styles.errorText}>{errors.school}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Primary Subject</label>
                    <select
                      value={profileData.subject}
                      onChange={(e) => handleProfileChange('subject', e.target.value)}
                      disabled={!isEditing}
                      className={styles.input}
                    >
                      <option value="">Select Subject</option>
                      <option value="Environmental Science">Environmental Science</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                      <option value="Geography">Geography</option>
                      <option value="General Science">General Science</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Years of Experience</label>
                    <input
                      type="number"
                      value={profileData.experience}
                      onChange={(e) => handleProfileChange('experience', e.target.value)}
                      disabled={!isEditing}
                      className={styles.input}
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    disabled={!isEditing}
                    className={styles.textarea}
                    rows={3}
                    placeholder="Tell us about yourself and your teaching philosophy..."
                  />
                </div>

                {isEditing && (
                  <div className={styles.formActions}>
                    <button
                      className={styles.saveBtn}
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className={styles.classSection}>
              <h3>Add New Class</h3>
              <p className={styles.sectionDescription}>
                Create a new class to manage students and assignments for environmental education.
              </p>

              <div className={styles.classForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Class Name *</label>
                    <input
                      type="text"
                      value={newClass.name}
                      onChange={(e) => handleClassChange('name', e.target.value)}
                      className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                      placeholder="e.g., Class 10A, Grade 9 Science"
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Academic Year</label>
                    <select
                      value={newClass.academicYear}
                      onChange={(e) => handleClassChange('academicYear', e.target.value)}
                      className={styles.input}
                    >
                      {academicYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Grade *</label>
                    <select
                      value={newClass.grade}
                      onChange={(e) => handleClassChange('grade', e.target.value)}
                      className={`${styles.input} ${errors.grade ? styles.errorInput : ''}`}
                    >
                      <option value="">Select Grade</option>
                      {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                    {errors.grade && <span className={styles.errorText}>{errors.grade}</span>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Section *</label>
                    <input
                      type="text"
                      value={newClass.section}
                      onChange={(e) => handleClassChange('section', e.target.value)}
                      className={`${styles.input} ${errors.section ? styles.errorInput : ''}`}
                      placeholder="e.g., A, B, C"
                      maxLength="2"
                    />
                    {errors.section && <span className={styles.errorText}>{errors.section}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Maximum Students</label>
                  <input
                    type="number"
                    value={newClass.maxStudents}
                    onChange={(e) => handleClassChange('maxStudents', parseInt(e.target.value))}
                    className={`${styles.input} ${errors.maxStudents ? styles.errorInput : ''}`}
                    min="1"
                    max="100"
                  />
                  {errors.maxStudents && <span className={styles.errorText}>{errors.maxStudents}</span>}
                </div>

                <div className={styles.formActions}>
                  <button
                    className={styles.addClassBtn}
                    onClick={handleAddClass}
                  >
                    Add Class
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;