const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      active: true
    };

    const updatedClasses = classes.map(c => {
      if (c.id === selectedClass.id) {
        return {
          ...c,
          tasks: [...c.tasks, newTask]
        };
      }
      return c;
    });

    setClasses(updatedClasses);
    setSelectedClass(updatedClasses.find(c => c.id === selectedClass.id));
    setShowTaskForm(false);
  };

  const handleUpdateTeacher = (updatedTeacher) => {
    setTeacher(updatedTeacher);
    // Here you would normally save to backend
    alert('Profile updated successfully!');
  };

  const handleAddClass = (newClass) => {
    setClasses(prev => [...prev, newClass]);
    // Auto-select the newly created class
    setSelectedClass(newClass);
  };import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TeacherDashboard.module.css';
import TaskForm from '../TaskForm/TaskForm';
import SubmissionModal from '../SubmissionModal/SubmissionModal';
import AnalyticsChart from '../AnalyticsChart/AnalyticsChart';
import TeacherProfile from '../TeacherProfile/TeacherProfile';

// Dummy Data
const dummyTeacher = {
  id: 1,
  name: "Dr. Priya Sharma",
  email: "priya.sharma@school.edu",
  phone: "9876543210",
  school: "Green Valley International School",
  subject: "Environmental Science",
  experience: "8",
  bio: "Passionate educator dedicated to environmental awareness and sustainable living. I believe in hands-on learning and practical application of environmental concepts."
};

const dummyClasses = [
  {
    id: 1,
    name: "Class 10A",
    ecoPoints: 850,
    badges: ["Tree Planter", "Water Saver", "Recycling Hero"],
    tasks: [
      {
        id: 1,
        title: "Plant 5 Trees",
        description: "Plant 5 trees in your neighborhood and upload photos with location",
        dueDate: "2025-10-15",
        active: true,
        points: 100
      },
      {
        id: 2,
        title: "Water Conservation",
        description: "Track and reduce water usage for a week",
        dueDate: "2025-10-10",
        active: true,
        points: 75
      }
    ],
    students: [
      { id: 1, name: "Amit Kumar" },
      { id: 2, name: "Priya Sharma" },
      { id: 3, name: "Sneha Patel" },
      { id: 4, name: "Rahul Singh" },
      { id: 5, name: "Neha Gupta" }
    ],
    submissions: [
      {
        id: 101,
        taskId: 1,
        studentId: 1,
        studentName: "Amit Kumar",
        content: "I planted 5 mango trees near my home. Here are the photos with GPS coordinates.",
        imageUrl: "tree-planting-photo.jpg",
        status: "pending",
        submittedDate: "2025-09-20",
        score: null,
        feedback: ""
      },
      {
        id: 102,
        taskId: 1,
        studentId: 2,
        studentName: "Priya Sharma",
        content: "Planted 5 neem trees in the school garden with my friends.",
        imageUrl: "school-garden.jpg",
        status: "reviewed",
        submittedDate: "2025-09-18",
        score: 95,
        feedback: "Excellent work! Great choice of trees."
      },
      {
        id: 103,
        taskId: 2,
        studentId: 3,
        studentName: "Sneha Patel",
        content: "Water usage reduced by 30% this week by fixing leaks and shorter showers.",
        status: "pending",
        submittedDate: "2025-09-19",
        score: null,
        feedback: ""
      }
    ]
  },
  {
    id: 2,
    name: "Class 10B",
    ecoPoints: 720,
    badges: ["Eco Warrior", "Green Champion"],
    tasks: [
      {
        id: 3,
        title: "Waste Segregation",
        description: "Create a waste segregation system at home",
        dueDate: "2025-10-20",
        active: true,
        points: 80
      }
    ],
    students: [
      { id: 6, name: "Vikram Joshi" },
      { id: 7, name: "Ananya Roy" },
      { id: 8, name: "Arjun Mehta" }
    ],
    submissions: []
  }
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(dummyTeacher);
  const [classes, setClasses] = useState(dummyClasses);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [modalSubmission, setModalSubmission] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Auto-select the first class on initial load
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [classes, selectedClass]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleClassChange = (classId) => {
    const newClass = classes.find(c => c.id === parseInt(classId));
    setSelectedClass(newClass);
  };

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      active: true
    };

    const updatedClasses = classes.map(c => {
      if (c.id === selectedClass.id) {
        return {
          ...c,
          tasks: [...c.tasks, newTask]
        };
      }
      return c;
    });

    setClasses(updatedClasses);
    setSelectedClass(updatedClasses.find(c => c.id === selectedClass.id));
    setShowTaskForm(false);
  };

  const handleUpdateTeacher = (updatedTeacher) => {
    setTeacher(updatedTeacher);
    // Here you would normally save to backend
    alert('Profile updated successfully!');
  };

  const handleUpdateSubmission = (submissionId, status, score = null, feedback = '') => {
    const updatedClasses = classes.map(c => {
      if (c.id === selectedClass.id) {
        return {
          ...c,
          submissions: c.submissions.map(s =>
            s.id === submissionId
              ? { ...s, status, score, feedback }
              : s
          )
        };
      }
      return c;
    });

    setClasses(updatedClasses);
    setSelectedClass(updatedClasses.find(c => c.id === selectedClass.id));
    setModalSubmission(null);
  };

  const openLeaderboard = () => {
    navigate('/leaderboard');
  };

  const pendingSubmissions = selectedClass?.submissions.filter(s => s.status === 'pending') || [];
  const reviewedSubmissions = selectedClass?.submissions.filter(s => s.status === 'reviewed') || [];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Teacher Dashboard</h1>
          <div className={styles.headerActions}>
            <button 
              className={styles.profileBtn} 
              onClick={() => setShowProfile(true)}
              title="Profile & Settings"
            >
              <span className={styles.profileIcon}>{teacher.name.charAt(0)}</span>
            </button>
            <button 
              className={styles.logoutBtn} 
              onClick={handleLogout}
              title="Logout"
            >
              <svg className={styles.logoutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Class Selector */}
        <div className={styles.classSelector}>
          <label htmlFor="class-select">Select Class:</label>
          <select
            id="class-select"
            className={styles.select}
            value={selectedClass?.id || ''}
            onChange={(e) => handleClassChange(e.target.value)}
          >
            <option value="" disabled>Choose a class...</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {selectedClass ? (
          <>
            {/* Gamification Section */}
            <div className={styles.gamificationSection}>
              <div className={styles.card}>
                <h3>Class Progress</h3>
                <div className={styles.progressGrid}>
                  <div className={styles.progressItem}>
                    <span className={styles.progressLabel}>Eco Points</span>
                    <span className={styles.progressValue}>{selectedClass.ecoPoints}</span>
                  </div>
                  <div className={styles.progressItem}>
                    <span className={styles.progressLabel}>Badges Earned</span>
                    <div className={styles.badges}>
                      {selectedClass.badges.map((badge, index) => (
                        <span key={index} className={styles.badge}>{badge}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.progressItem}>
                    <button className={styles.leaderboardBtn} onClick={openLeaderboard}>
                      View Leaderboard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'tasks' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                Tasks
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'submissions' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('submissions')}
              >
                Submissions
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'tasks' && (
              <div className={styles.tabContent}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Active Tasks</h3>
                    <button
                      className={styles.primaryBtn}
                      onClick={() => setShowTaskForm(true)}
                    >
                      Create New Task
                    </button>
                  </div>
                  <div className={styles.tasksList}>
                    {selectedClass.tasks.length === 0 ? (
                      <p>No tasks assigned yet.</p>
                    ) : (
                      selectedClass.tasks.map(task => (
                        <div key={task.id} className={styles.taskItem}>
                          <div>
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <span className={styles.dueDate}>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span className={styles.points}>Points: {task.points}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className={styles.tabContent}>
                <div className={styles.submissionsGrid}>
                  <div className={styles.card}>
                    <h3>Pending Submissions ({pendingSubmissions.length})</h3>
                    {pendingSubmissions.length === 0 ? (
                      <p>No pending submissions.</p>
                    ) : (
                      pendingSubmissions.map(submission => (
                        <div key={submission.id} className={styles.submissionItem}>
                          <div>
                            <strong>{submission.studentName}</strong>
                            <p className={styles.submissionPreview}>
                              {submission.content.substring(0, 100)}...
                            </p>
                            <span className={styles.submissionDate}>
                              Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            className={styles.reviewBtn}
                            onClick={() => setModalSubmission(submission)}
                          >
                            Review
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className={styles.card}>
                    <h3>Reviewed Submissions ({reviewedSubmissions.length})</h3>
                    {reviewedSubmissions.length === 0 ? (
                      <p>No reviewed submissions yet.</p>
                    ) : (
                      reviewedSubmissions.map(submission => (
                        <div key={submission.id} className={styles.submissionItem}>
                          <div>
                            <strong>{submission.studentName}</strong>
                            <p className={styles.submissionPreview}>
                              {submission.content.substring(0, 100)}...
                            </p>
                            <span className={styles.submissionScore}>
                              Score: {submission.score}/100
                            </span>
                          </div>
                          <span className={styles.reviewedBadge}>✓ Reviewed</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className={styles.tabContent}>
                <AnalyticsChart
                  submissions={selectedClass.submissions}
                  students={selectedClass.students}
                  tasks={selectedClass.tasks}
                />
              </div>
            )}
          </>
        ) : (
          <div className={styles.placeholder}>
            <h3>Please select a class to view details.</h3>
          </div>
        )}
      </main>

      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {modalSubmission && (
        <SubmissionModal
          submission={modalSubmission}
          onClose={() => setModalSubmission(null)}
          onUpdate={handleUpdateSubmission}
        />
      )}

      {showProfile && (
        <TeacherProfile
          teacher={teacher}
          onClose={() => setShowProfile(false)}
          onUpdate={handleUpdateTeacher}
          onAddClass={handleAddClass}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;