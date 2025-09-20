import React, { useState, useEffect, useRef } from 'react';
import { Edit, Save, X, Camera, User } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  // Styles object from your original code
  const styles = {
    profileContainer: { maxWidth: '600px', margin: '2rem auto', padding: '1rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    profileCard: { background: 'linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 32px rgba(46, 125, 50, 0.15)', border: '1px solid rgba(76, 175, 80, 0.2)', transition: 'all 0.3s ease' },
    header: { textAlign: 'center', marginBottom: '2rem', color: '#2e7d32' },
    title: { fontSize: '1.8rem', fontWeight: '600', margin: '0', background: 'linear-gradient(135deg, #2e7d32, #4caf50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
    profileImageSection: { display: 'flex', justifyContent: 'center', marginBottom: '2rem' },
    imageContainer: { position: 'relative', display: 'inline-block' },
    profileImage: { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #4caf50', boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)', transition: 'all 0.3s ease' },
    defaultAvatar: { width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#81c784', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #4caf50', boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)' },
    cameraButton: { position: 'absolute', bottom: '0', right: '0', background: '#4caf50', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)', transition: 'all 0.3s ease' },
    hiddenInput: { display: 'none' },
    formGrid: { display: 'grid', gap: '1.5rem' },
    fieldGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '0.9rem', fontWeight: '600', color: '#2e7d32', marginBottom: '0.5rem' },
    input: { padding: '0.75rem 1rem', border: '2px solid #c8e6c9', borderRadius: '10px', fontSize: '1rem', transition: 'all 0.3s ease', backgroundColor: 'white', outline: 'none' },
    inputFocus: { borderColor: '#4caf50', boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)' },
    select: { padding: '0.75rem 1rem', border: '2px solid #c8e6c9', borderRadius: '10px', fontSize: '1rem', backgroundColor: 'white', cursor: 'pointer', outline: 'none', transition: 'all 0.3s ease' },
    displayValue: { padding: '0.75rem 1rem', backgroundColor: '#f1f8e9', border: '2px solid transparent', borderRadius: '10px', fontSize: '1rem', color: '#2e7d32', minHeight: '1.25rem' },
    buttonGroup: { display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' },
    button: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', textTransform: 'none' },
    editButton: { background: 'linear-gradient(135deg, #4caf50, #66bb6a)', color: 'white', boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)' },
    saveButton: { background: 'linear-gradient(135deg, #2e7d32, #4caf50)', color: 'white', boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)' },
    cancelButton: { background: 'linear-gradient(135deg, #757575, #9e9e9e)', color: 'white', boxShadow: '0 4px 16px rgba(117, 117, 117, 0.3)' },
    buttonHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)' },
    // NECESSARY CHANGE: Style for centering the spinner
    spinnerContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
  };
  
  // NECESSARY CHANGE: Add spinner animation and styles within a style tag
  const componentStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinner {
      border: 5px solid #e8f5e8; /* Light green */
      border-top: 5px solid #4caf50; /* Dark green */
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }
    @media (max-width: 768px) {
      /* Your responsive styles */
    }
  `;

  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fileInputRef = useRef(null);
  const categories = ['School', 'College','UG','PG'];

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await axios.get('http://localhost:5000/api/profile');
          const userData = {
            ...res.data,
            category: res.data.educationType
          };
          setProfileData(userData);
          setEditData(userData);
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        }
      }
      setIsLoading(false);
    };
    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...editData, educationType: editData.category };
      const res = await axios.put('http://localhost:5000/api/profile', dataToSave);
      const updatedData = { ...res.data, category: res.data.educationType };
      setProfileData(updatedData);
      setEditData(updatedData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
    setFocusedInput(null);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({ ...prev, profilePicture: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // NECESSARY CHANGE: Display spinner while loading
  if (isLoading || !profileData) {
    return (
      <div style={styles.spinnerContainer}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  const currentData = isEditing ? editData : profileData;

  return (
    <>
      {/* NECESSARY CHANGE: Inject the styles into the document head */}
      <style>{componentStyles}</style>
      <div style={styles.profileContainer} className="profileContainer">
        <div style={styles.profileCard}>
          <div style={styles.header}>
            <h1 style={styles.title}>Student Profile</h1>
          </div>
          <div style={styles.profileImageSection}>
            <div style={styles.imageContainer}>
              {currentData.profilePicture ? (
                <img src={currentData.profilePicture} alt="Profile" style={styles.profileImage} />
              ) : (
                <div style={styles.defaultAvatar}><User size={48} color="white" /></div>
              )}
              {isEditing && (
                <>
                  <button style={styles.cameraButton} onClick={triggerImageUpload}>
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={styles.hiddenInput} />
                </>
              )}
            </div>
          </div>
          <div style={styles.formGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              {isEditing ? (
                <input type="text" value={editData.name} onChange={(e) => handleInputChange('name', e.target.value)} style={styles.input} />
              ) : (
                <div style={styles.displayValue}>{currentData.name}</div>
              )}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.displayValue}>{currentData.email}</div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>School/College Name</label>
              {isEditing ? (
                <input type="text" value={editData.school} onChange={(e) => handleInputChange('school', e.target.value)} style={styles.input} />
              ) : (
                <div style={styles.displayValue}>{currentData.school}</div>
              )}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Category</label>
              {isEditing ? (
                <select value={editData.category} onChange={(e) => handleInputChange('category', e.target.value)} style={styles.select}>
                  {categories.map(category => (<option key={category} value={category}>{category}</option>))}
                </select>
              ) : (
                <div style={styles.displayValue}>{currentData.category}</div>
              )}
            </div>
          </div>
          <div style={styles.buttonGroup}>
            {isEditing ? (
              <>
                <button style={{...styles.button, ...styles.saveButton}} onClick={handleSave}><Save size={18} /> Save Changes</button>
                <button style={{...styles.button, ...styles.cancelButton}} onClick={handleCancel}><X size={18} /> Cancel</button>
              </>
            ) : (
              <button style={{...styles.button, ...styles.editButton}} onClick={handleEdit}><Edit size={18} /> Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;