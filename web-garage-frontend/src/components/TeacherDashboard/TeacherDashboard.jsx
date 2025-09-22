import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import all your components
import styles from './TeacherDashboard.module.css';
import TaskForm from '../TaskForm/TaskForm';
import SubmissionModal from '../SubmissionModal/SubmissionModal';
import AnalyticsChart from '../AnalyticsChart/AnalyticsChart';
import TeacherProfile from '../TeacherProfile/TeacherProfile';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI State
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [modalSubmission, setModalSubmission] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        // Fetch the teacher's profile and their associated classes
        const profileRes = await axios.get('http://localhost:5000/api/profile', {
          headers: { 'x-auth-token': token }
        });
        setTeacher(profileRes.data);
        const teacherSchool = profileRes.data.school;

        const classesRes = await axios.get(`http://localhost:5000/api/classes?school=${teacherSchool}`, {
          headers: { 'x-auth-token': token }
        });
        setClasses(classesRes.data);

        // Auto-select the first class if any exist
        if (classesRes.data.length > 0) {
          setSelectedClass(classesRes.data[0]);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Could not load dashboard data. Your session may have expired.");
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // --- HANDLER FUNCTIONS ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleClassChange = (classId) => {
    const newClass = classes.find(c => c._id === classId); // Use _id to match MongoDB
    setSelectedClass(newClass);
  };

  const handleCreateTask = async (taskData) => {
    if (!selectedClass) {
      alert("Please select a class first.");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const payload = { ...taskData, classId: selectedClass._id };
      const res = await axios.post('http://localhost:5000/api/tasks', payload, {
        headers: { 'x-auth-token': token }
      });
      const savedTask = res.data;

      const updatedClasses = classes.map(c => {
        if (c._id === selectedClass._id) {
          return { ...c, tasks: [...c.tasks, savedTask] };
        }
        return c;
      });
      setClasses(updatedClasses);
      setSelectedClass(updatedClasses.find(c => c._id === selectedClass._id));
      setShowTaskForm(false);
      alert('Task created successfully!');
    } catch (error) {
      alert('Failed to create task. Please try again.');
    }
  };

  const handleAddClass = async (classData) => {
    if (!classData || !classData.name) {
      alert("Please provide a name for the new class.");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      const payload = { name: classData.name };
      const response = await axios.post('http://localhost:5000/api/classes', payload, config);
      const newClassFromServer = response.data;

      setClasses(prevClasses => [...prevClasses, newClassFromServer]);
      alert(`Class '${classData.name}' created successfully!`);
    } catch (error) {
      alert('Failed to create class. Please try again.');
    }
  };
  
  const handleUpdateSubmission = (submissionId, status, score = null, feedback = '') => { /* ... */ };
  const handleUpdateTeacher = (updatedTeacher) => { /* ... */ };
  const openLeaderboard = () => { /* ... */ };

  // --- DERIVED STATE (SAFE GUARDS) ---
  const pendingSubmissions = (selectedClass?.submissions || []).filter(s => s.status === 'pending');
  const reviewedSubmissions = (selectedClass?.submissions || []).filter(s => s.status === 'reviewed');
  const tasks = selectedClass?.tasks || [];
  const badges = selectedClass?.badges || [];

  // --- RENDER LOGIC ---

  if (loading) {
    return <div className={styles.placeholder}>Loading Dashboard...</div>;
  }
  if (error) {
    return <div className={styles.placeholder} style={{ color: 'red' }}>{error}</div>;
  }
  if (!teacher) {
    return <div className={styles.placeholder}>Could not load teacher data. Please log in again.</div>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Teacher Dashboard</h1>
          <div className={styles.headerActions}>
            <button className={styles.profileBtn} onClick={() => setShowProfile(true)} title="Profile & Settings">
              <span className={styles.profileIcon}>{teacher.name.charAt(0)}</span>
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
              <svg className={styles.logoutIcon} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.classSelector}>
          <label htmlFor="class-select">Select Class:</label>
          <select id="class-select" className={styles.select} value={selectedClass?._id || ''} onChange={(e) => handleClassChange(e.target.value)}>
            <option value="" disabled>Choose a class...</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {selectedClass ? (
          <>
            <div className={styles.gamificationSection}>
              {/* ... Your gamification JSX ... */}
            </div>

            <div className={styles.tabs}>
              <button className={`${styles.tab} ${activeTab === 'tasks' ? styles.activeTab : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
              <button className={`${styles.tab} ${activeTab === 'submissions' ? styles.activeTab : ''}`} onClick={() => setActiveTab('submissions')}>Submissions</button>
              <button className={`${styles.tab} ${activeTab === 'analytics' ? styles.activeTab : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
            </div>

            {activeTab === 'tasks' && (
              <div className={styles.tabContent}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Active Tasks ({tasks.length})</h3>
                    <button className={styles.primaryBtn} onClick={() => setShowTaskForm(true)}>Create New Task</button>
                  </div>
                  <div className={styles.tasksList}>
                    {tasks.length === 0 ? <p>No tasks assigned yet.</p> : tasks.map(task => (
                      <div key={task._id} className={styles.taskItem}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span>Points: {task.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className={styles.tabContent}>
                {/* ... Your JSX for pending and reviewed submissions ... */}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className={styles.tabContent}>
                <AnalyticsChart submissions={selectedClass.submissions || []} students={selectedClass.students || []} tasks={tasks} />
              </div>
            )}
          </>
        ) : (
          <div className={styles.placeholder}>
            <h3>Please select a class to view details.</h3>
            <p>If you don't have any classes, you can add one from your profile.</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {showTaskForm && (
        <TaskForm onSubmit={handleCreateTask} onClose={() => setShowTaskForm(false)} students={selectedClass?.students || []} />
      )}
      {modalSubmission && (
        <SubmissionModal submission={modalSubmission} onClose={() => setModalSubmission(null)} onUpdate={handleUpdateSubmission} />
      )}
      {showProfile && (
        <TeacherProfile teacher={teacher} onClose={() => setShowProfile(false)} onUpdate={handleUpdateTeacher} onAddClass={handleAddClass} />
      )}
    </div>
  );
};

export default TeacherDashboard;
