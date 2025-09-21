import React, { useState, useEffect } from 'react';
import { User, Users, Award, LogOut, Menu, X, Mail, Lock, School, MapPin, Eye, EyeOff, Settings, Edit2, Save, UserCircle } from 'lucide-react';
import axios from 'axios';
// Enhanced CSS Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  
  formContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)'
  },
  
  formCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '28rem'
  },
  
  formHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  
  formTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  
  formSubtitle: {
    color: '#6b7280'
  },
  
  inputGroup: {
    marginBottom: '1rem'
  },
  
  inputWrapper: {
    position: 'relative'
  },
  
  inputIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    zIndex: 10
  },
  
  input: {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  
  inputFocus: {
    borderColor: '#16a34a'
  },
  
  inputError: {
    borderColor: '#ef4444'
  },
  
  errorText: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  },
  
  button: {
    width: '100%',
    backgroundColor: '#16a34a',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '1rem'
  },
  
  buttonHover: {
    backgroundColor: '#15803d'
  },
  
  link: {
    color: '#16a34a',
    textDecoration: 'none',
    fontWeight: '500'
  },
  
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  
  sidebar: {
    width: '280px',
    backgroundColor: '#1e293b',
    color: 'white',
    transition: 'all 0.3s ease-in-out',
    position: 'fixed',
    height: '100vh',
    zIndex: 50,
    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto'
  },
  
  sidebarMobile: {
    transform: 'translateX(-100%)'
  },
  
  sidebarOpen: {
    transform: 'translateX(0)'
  },
  
  sidebarHeader: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid #334155',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  },
  
  sidebarTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  
  sidebarSubtitle: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    fontWeight: '400'
  },
  
  sidebarNav: {
    padding: '1.5rem 0'
  },
  
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    color: '#cbd5e1',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderLeft: '4px solid transparent',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  
  navItemActive: {
    backgroundColor: '#334155',
    borderLeftColor: '#22c55e',
    color: 'white',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
  },
  
  navItemHover: {
    backgroundColor: '#334155',
    color: 'white',
    transform: 'translateX(4px)'
  },
  
  navIcon: {
    marginRight: '1rem',
    width: '1.25rem',
    height: '1.25rem',
    flexShrink: 0
  },
  
  mainContent: {
    marginLeft: '280px',
    flex: 1,
    padding: '0',
    width: 'calc(100% - 280px)',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  
  mainContentMobile: {
    marginLeft: 0,
    width: '100%'
  },
  
  topBar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 30,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  headerTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  
  menuButton: {
    display: 'none',
    padding: '0.75rem',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  
  profileDropdown: {
    position: 'relative'
  },
  
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#64748b'
  },
  
  profileButtonHover: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1'
  },
  
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '0.5rem',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    zIndex: 50
  },
  
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.875rem'
  },
  
  dropdownItemHover: {
    backgroundColor: '#f9fafb',
    color: '#16a34a'
  },
  
  contentArea: {
    padding: '2rem',
    maxWidth: '100%',
    overflow: 'hidden'
  },
  
  welcomeCard: {
    background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
    borderRadius: '1rem',
    padding: '2.5rem',
    color: 'white',
    marginBottom: '2rem',
    boxShadow: '0 10px 25px rgba(22, 163, 74, 0.2)',
    position: 'relative',
    overflow: 'hidden'
  },
  
  welcomeCardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(50%, -50%)'
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  
  statCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid #f1f5f9',
    position: 'relative',
    overflow: 'hidden'
  },
  
  statCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '0.5rem',
    lineHeight: 1
  },
  
  statLabel: {
    color: '#64748b',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '600'
  },
  
  section: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
    border: '1px solid #f1f5f9'
  },
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  
  profileForm: {
    display: 'grid',
    gap: '1.5rem',
    maxWidth: '600px'
  },
  
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    borderRadius: '0.5rem',
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  },
  
  tableHeader: {
    backgroundColor: '#f8fafc'
  },
  
  tableHeaderCell: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  
  tableCell: {
    padding: '1rem',
    borderTop: '1px solid #e2e8f0',
    color: '#374151'
  },
  
  addButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '1.5rem',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  actionButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.875rem',
    marginRight: '0.5rem',
    transition: 'all 0.2s'
  },
  
  editButton: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white'
  },
  
  saveButton: {
    backgroundColor: '#16a34a',
    color: 'white'
  },
  
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white'
  }
};

// Enhanced Input Component
const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  error, 
  showPasswordToggle = false,
  onTogglePassword,
  disabled = false,
  label
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={styles.inputGroup}>
      {label && (
        <label style={{ 
          display: 'block', 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          {label}
        </label>
      )}
      <div style={styles.inputWrapper}>
        {Icon && <Icon style={styles.inputIcon} size={20} />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...styles.input,
            ...(focused ? styles.inputFocus : {}),
            ...(error ? styles.inputError : {}),
            ...(disabled ? { backgroundColor: '#f9fafb', cursor: 'not-allowed' } : {})
          }}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#9ca3af'
            }}
          >
            {type === 'password' ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

// Enhanced Button Component
const Button = ({ children, onClick, type = 'button', disabled = false, variant = 'primary' }) => {
  const [hovered, setHovered] = useState(false);
  
  const getButtonStyles = () => {
    const baseStyles = {
      ...styles.button,
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer'
    };
    
    if (variant === 'secondary') {
      return {
        ...baseStyles,
        backgroundColor: '#6b7280',
        ...(hovered && !disabled ? { backgroundColor: '#4b5563' } : {})
      };
    }
    
    return {
      ...baseStyles,
      ...(hovered && !disabled ? styles.buttonHover : {})
    };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={getButtonStyles()}
    >
      {children}
    </button>
  );
};

// Profile Component
const ProfileSection = ({ schoolData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(schoolData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Invalid email format';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(schoolData);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={styles.sectionTitle}>
          <UserCircle size={24} />
          School Profile
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              ...styles.actionButton,
              ...styles.editButton,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              style={{
                ...styles.actionButton,
                ...styles.saveButton,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                ...styles.actionButton,
                ...styles.cancelButton
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div style={styles.profileForm}>
        <Input
          label="School Name"
          placeholder="School Name"
          value={formData.schoolName}
          onChange={(e) => handleChange('schoolName', e.target.value)}
          icon={School}
          disabled={!isEditing}
          error={errors.schoolName}
        />

        <Input
          label="School Address"
          placeholder="School Address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          icon={MapPin}
          disabled={!isEditing}
          error={errors.address}
        />

        <Input
          label="Admin Email"
          type="email"
          placeholder="Admin Email"
          value={formData.adminEmail}
          onChange={(e) => handleChange('adminEmail', e.target.value)}
          icon={Mail}
          disabled={!isEditing}
          error={errors.adminEmail}
        />

        {isEditing && (
          <Input
            label="New Password (optional)"
            type={showPassword ? 'text' : 'password'}
            placeholder="Leave blank to keep current password"
            value={formData.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            icon={Lock}
            error={errors.password}
            showPasswordToggle={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    </div>
  );
};

// Enhanced Sidebar Component
const Sidebar = ({ isOpen, currentPage, onPageChange, onLogout, onClose, schoolName }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: School },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'students', label: 'Students', icon: User },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  return (
    <div 
      style={{
        ...styles.sidebar,
        ...(window.innerWidth <= 768 && !isOpen ? styles.sidebarMobile : {}),
        ...(window.innerWidth <= 768 && isOpen ? styles.sidebarOpen : {})
      }}
    >
      <div style={styles.sidebarHeader}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 style={styles.sidebarTitle}>
              <School size={24} />
              {schoolName}
            </h2>
            <p style={styles.sidebarSubtitle}>Environmental Education Platform</p>
          </div>
          {window.innerWidth <= 768 && (
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '0.25rem',
                marginLeft: '0.5rem'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      <nav style={styles.sidebarNav}>
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onPageChange(item.id)}
            style={{
              ...styles.navItem,
              ...(currentPage === item.id ? styles.navItemActive : {})
            }}
            onMouseEnter={(e) => {
              if (currentPage !== item.id) {
                Object.assign(e.target.style, styles.navItemHover);
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== item.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#cbd5e1';
                e.target.style.transform = 'translateX(0)';
              }
            }}
          >
            <item.icon style={styles.navIcon} />
            {item.label}
          </div>
        ))}
        <div
          onClick={onLogout}
          style={{
            ...styles.navItem,
            marginTop: '2rem',
            borderTop: '1px solid #334155',
            paddingTop: '1.5rem'
          }}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, styles.navItemHover);
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#cbd5e1';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <LogOut style={styles.navIcon} />
          Logout
        </div>
      </nav>
    </div>
  );
};

// Enhanced Dashboard Content Component
const DashboardContent = ({ schoolName, stats, teachers, leaderboard }) => {
  return (
    <div>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome to {schoolName}
        </h2>
        <p style={{ opacity: 0.9 }}>Environmental Education Dashboard</p>
      </div>

      {/* Stats Grid (now uses live data) */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.teachers}</div>
          <div style={styles.statLabel}>Teachers</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.students}</div>
          <div style={styles.statLabel}>Students</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.ecoPoints.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Eco Points</div>
        </div>
      </div>

      {/* Teachers Section (now uses live data) */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Teachers</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeaderCell}>Name</th>
              <th style={styles.tableHeaderCell}>Email</th>
              <th style={styles.tableHeaderCell}>Subject</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td style={styles.tableCell}>{teacher.name}</td>
                <td style={styles.tableCell}>{teacher.email}</td>
                <td style={styles.tableCell}>{teacher.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leaderboard Section (now uses live data) */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Top Students - Eco Points</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeaderCell}>Rank</th>
              <th style={styles.tableHeaderCell}>Student</th>
              <th style={styles.tableHeaderCell}>Eco Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((student, index) => (
              <tr key={student._id}>
                <td style={styles.tableCell}>
                  <span>#{index + 1}</span>
                </td>
                <td style={styles.tableCell}>{student.name}</td>
                <td style={styles.tableCell}>{(student.totalPoints || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// School Sign Up Component
const SchoolSignUp = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    schoolName: '',
    address: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // 1. Make the login request
        const response = await axios.post('http://localhost:5000/api/auth/login/school', formData);
        console.log('Server Login Response:', response.data); 
        // 2. Check if the response and the token actually exist
        if (response.data && response.data.token) {
          // 3. Save the token and school name to localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('schoolName', response.data.schoolName);
          
          alert('Login successful!');
          
          // 4. Only navigate AFTER the token has been saved
          onSuccess('dashboard', response.data.schoolName);
        } else {
          // This handles cases where the server responds with success but no token
          alert('Login failed: No token received from server.');
        }

      } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An unknown error occurred.';
        console.error('Login failed:', error);
        alert(`Login failed: ${errorMessage}`);
      }
    }
  };
  return (
    <div style={styles.formContainer}>
      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>School Registration</h2>
          <p style={styles.formSubtitle}>Join our Environmental Education Platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="School Name"
            value={formData.schoolName}
            onChange={(e) => handleChange('schoolName', e.target.value)}
            icon={School}
            error={errors.schoolName}
          />

          <Input
            placeholder="School Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            icon={MapPin}
            error={errors.address}
          />

          <Input
            type="email"
            placeholder="Admin Email"
            value={formData.adminEmail}
            onChange={(e) => handleChange('adminEmail', e.target.value)}
            icon={Mail}
            error={errors.adminEmail}
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            icon={Lock}
            error={errors.password}
            showPasswordToggle={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            icon={Lock}
            error={errors.confirmPassword}
            showPasswordToggle={true}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <Button type="submit">
            Create School Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#6b7280' }}>Already have an account? </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSuccess('login');
            }}
            style={styles.link}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

// School Login Component
// --- CORRECTED SchoolLogin Component ---
// Replace your existing SchoolLogin component with this one.

const SchoolLogin = ({ onSuccess, onSignUp }) => {
  const [formData, setFormData] = useState({
    adminEmail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- THIS IS THE CORRECT LOGIN LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // 1. Make the actual login request to the backend
        const response = await axios.post('http://localhost:5000/api/auth/login/school', formData);
        
        console.log('Server Login Response:', response.data); // You will now see this in the console

        // 2. Check if the response contains the token
        if (response.data && response.data.token) {
          // 3. Save the token and school name to localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('schoolName', response.data.schoolName);
          
          alert('Login successful!');
          
          // 4. Navigate to the dashboard only AFTER the token is saved
          onSuccess('dashboard', response.data.schoolName);
        } else {
          alert('Login failed: No token was received from the server.');
        }

      } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An unknown error occurred.';
        console.error('Login failed:', error);
        alert(`Login failed: ${errorMessage}`);
      }
    }
  };

  // The JSX of the form remains the same
  return (
    <div style={styles.formContainer}>
      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>School Login</h2>
          <p style={styles.formSubtitle}>Access your environmental education dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Admin Email"
            value={formData.adminEmail}
            onChange={(e) => handleChange('adminEmail', e.target.value)}
            icon={Mail}
            error={errors.adminEmail}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            icon={Lock}
            error={errors.password}
            showPasswordToggle={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          <Button type="submit">
            Sign In
          </Button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#6b7280' }}>Don't have an account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); onSignUp(); }} style={styles.link}>
            Register School
          </a>
        </div>
      </div>
    </div>
  );
};

// Enhanced School Dashboard Component
const SchoolDashboard = ({ onLogout, schoolName }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [schoolData, setSchoolData] = useState({
    schoolName: schoolName,
    address: '123 Education Street, Learning City, LC 12345',
    adminEmail: 'admin@greenvalleyhigh.edu',
    password: ''
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get the token from localStorage
        const token = localStorage.getItem('token');

        // 2. If no token is found, don't even try to fetch
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        // 3. Make the API call WITH the Authorization header
        const response = await axios.get('http://localhost:5000/api/dashboard/school-data', {
          headers: {
            'Authorization': `Bearer ${token}` // This line is the fix
          }
        });

        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Your session may have expired.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolName) {
      fetchData();
    }
  }, [schoolName]);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
    };

    if (profileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileDropdownOpen]);
  
  const handleProfileUpdate = (updatedData) => {
    setSchoolData(updatedData);
    alert('Profile updated successfully!');
  };

  const renderContent = () => {
    if (loading) {
      return <p>Loading dashboard...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (!dashboardData) {
      return <p>No data available.</p>;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent 
                  schoolName={schoolName} 
                  stats={dashboardData.stats}
                  teachers={dashboardData.teachers}
                  leaderboard={dashboardData.leaderboard}

        />;
      case 'teachers':
        return (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <Users size={24} />
              Teachers Management
            </h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Comprehensive teacher management functionality will be implemented here. 
              This will include adding, editing, and managing teacher profiles, assignments, and performance tracking.
            </p>
          </div>
        );
      case 'students':
        return (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <User size={24} />
              Students Management
            </h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Advanced student management system will be available here.
              Features will include student enrollment, progress tracking, and eco-point management.
            </p>
          </div>
        );
      case 'leaderboard':
        return (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <Award size={24} />
              School Leaderboard
            </h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Detailed leaderboard with advanced filtering and analytics will be implemented here.
              This will show comprehensive student rankings and achievements.
            </p>
          </div>
        );
      case 'profile':
        return <ProfileSection schoolData={schoolData} onUpdate={handleProfileUpdate} />;
      default:
        return <DashboardContent 
                  schoolName={schoolName} 
                  stats={dashboardData.stats}
                  teachers={dashboardData.teachers}
                  leaderboard={dashboardData.leaderboard}
            />;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboardContainer}>
        <Sidebar
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            if (isMobile) setSidebarOpen(false);
          }}
          onLogout={onLogout}
          onClose={() => setSidebarOpen(false)}
          schoolName={schoolData.schoolName}
        />
        
        <div style={{
          ...styles.mainContent,
          ...(isMobile ? styles.mainContentMobile : {})
        }}>
          {/* Top Bar */}
          <div style={{
            ...styles.topBar,
            ...(isMobile ? { padding: '1rem' } : {})
          }}>
            <div style={styles.topBarLeft}>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{
                    ...styles.menuButton,
                    display: 'flex'
                  }}
                >
                  <Menu size={20} />
                </button>
              )}
              <h1 style={{
                ...styles.headerTitle,
                ...(isMobile ? { fontSize: '1.25rem' } : {})
              }}>
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
              </h1>
            </div>
            
            <div style={styles.topBarRight}>
              <div style={styles.profileDropdown}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  style={{
                    ...styles.profileButton,
                    ...(profileDropdownOpen ? styles.profileButtonHover : {})
                  }}
                >
                  <UserCircle size={20} />
                  <span style={{ fontWeight: '600' }}>Admin</span>
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '4px solid currentColor',
                    transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} />
                </button>
                
                {profileDropdownOpen && (
                  <div style={styles.dropdownMenu}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage('profile');
                        setProfileDropdownOpen(false);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => Object.assign(e.target.style, styles.dropdownItemHover)}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      <Settings size={16} />
                      Edit Profile
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogout();
                      }}
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => Object.assign(e.target.style, styles.dropdownItemHover)}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div style={{
            ...styles.contentArea,
            ...(isMobile ? { padding: '1rem' } : {})
          }}>
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Main App Component
const SchoolModule = () => {
  const [currentView, setCurrentView] = useState('login');
  const [schoolName, setSchoolName] = useState('');
  
  const handleSuccess = (view, name = '') => {
    setCurrentView(view);
    if (name) {
      setSchoolName(name);
    }
  };

  const handleLogout = () => {
    setSchoolName('');
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signup':
        return <SchoolSignUp onSuccess={handleSuccess} />;
      case 'login':
        return (
          <SchoolLogin
            onSuccess={handleSuccess}
            onSignUp={() => setCurrentView('signup')}
          />
        );
      case 'dashboard':
        return <SchoolDashboard onLogout={handleLogout} schoolName={schoolName} />;
      default:
        return <SchoolSignUp onSuccess={handleSuccess} />;
    }
  };

  return renderCurrentView();
};

export default SchoolModule;