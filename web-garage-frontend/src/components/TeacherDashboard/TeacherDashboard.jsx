import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TeacherDashboard.module.css';

// --- Dummy Data (Updated Structure) ---
const dummyClasses = [
  {
    id: 1, name: "Class 10A",
    tasks: [{ id: 1, title: "Plant 5 trees", description: "Upload proof of planting trees.", assignedDate: "2025-09-10", dueDate: "2025-09-20", active: true }],
    students: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    submissions: [
      { id: 101, studentName: "Amit", content: "Photo of tree planting with GPS location.", status: "pending", submittedDate: "2025-09-15" },
      { id: 102, studentName: "Priya", content: "Tree planting report with photos.", status: "verified", score: 100, submittedDate: "2025-09-14" },
      { id: 103, studentName: "Sneha", content: "Video was blurry and didn't show the location.", status: "declined", submittedDate: "2025-09-16" }
    ]
  },
  // Add other classes here...
];

// --- Reusable Sub-Components ---

const Header = ({ onLogout }) => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <h1>Teacher Dashboard</h1>
      <button className={styles.logoutBtn} onClick={onLogout}>Logout</button>
    </div>
  </header>
);

const CurrentTask = ({ task }) => (
  <div className={`${styles.card} ${styles.currentTask}`}>
    <h3>Current Active Task</h3>
    {task ? (
      <>
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p><strong>Assigned:</strong> {new Date(task.assignedDate).toLocaleDateString()} | <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
      </>
    ) : <p>No active task assigned.</p>}
  </div>
);

const SubmissionModal = ({ submission, onClose, onUpdateStatus }) => {
  const [score, setScore] = useState('');
  if (!submission) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3>Submission: {submission.studentName}</h3>
        <div className={styles.submissionContent}><p>{submission.content}</p></div>
        <div className={styles.form} style={{marginTop: '1rem'}}>
          <input type="number" placeholder="Score (e.g., 100)" value={score} onChange={e => setScore(e.target.value)} />
        </div>
        <div className={styles.modalActions}>
          <button className={`${styles.actionButton} ${styles.scoreButton}`} onClick={() => onUpdateStatus(submission.id, 'verified', score)}>Verify & Add Score</button>
          <button className={`${styles.actionButton} ${styles.declineButton}`} onClick={() => onUpdateStatus(submission.id, 'declined')}>Decline</button>
          <button className={`${styles.actionButton} ${styles.cancelButton}`} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const PieChart = ({ submissions = [], students = [] }) => {
  const data = [
    { label: 'Verified', value: submissions.filter(s => s.status === 'verified').length, color: '#27ae60' },
    { label: 'Pending', value: submissions.filter(s => s.status === 'pending').length, color: '#f39c12' },
    { label: 'Declined', value: submissions.filter(s => s.status === 'declined').length, color: '#e74c3c' },
    { label: 'Not Submitted', value: students.length - submissions.length, color: '#7f8c8d' }
  ];
  const total = students.length;

  return (
    <div className={`${styles.card} ${styles.pieChartContainer}`}>
      <h3>Submission Status</h3>
      {/* A simple legend is often clearer than a complex SVG pie chart */}
      <div className={styles.legend}>
        {data.map(item => item.value > 0 && (
          <div key={item.label} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
            <span>{item.label}: {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>
      <div className={styles.stats}>
        <div><span>Total Students</span><p className={styles.statValue}>{total}</p></div>
        <div><span>Submitted</span><p className={styles.statValue}>{submissions.length}</p></div>
      </div>
    </div>
  );
};

// --- Main Teacher Dashboard Component ---

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState(dummyClasses);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalSubmission, setModalSubmission] = useState(null);

  useEffect(() => {
    // Auto-select the first class on initial load
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [classes, selectedClass]);

  const handleUpdateSubmissionStatus = (submissionId, status, score = null) => {
    const updatedClasses = classes.map(c => {
      if (c.id === selectedClass.id) {
        return {
          ...c,
          submissions: c.submissions.map(s => 
            s.id === submissionId ? { ...s, status, score: score || s.score } : s
          )
        };
      }
      return c;
    });
    setClasses(updatedClasses);
    setSelectedClass(updatedClasses.find(c => c.id === selectedClass.id));
    setModalSubmission(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const currentTask = selectedClass?.tasks.find(task => task.active);

  return (
    <div className={styles.dashboard}>
      <Header onLogout={handleLogout} />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.classSelector}>
            <label htmlFor="class-select"><h3>Select Class:</h3></label>
            <select id="class-select" className={styles.select} value={selectedClass?.id || ''} onChange={(e) => setSelectedClass(classes.find(c => c.id === parseInt(e.target.value)))}>
              <option value="" disabled>Choose a class...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {selectedClass ? (
          <>
            <CurrentTask task={currentTask} />
            <div className={styles.contentGrid}>
              <div className={styles.card}>
                <h3>Submissions</h3>
                {['pending', 'verified', 'declined'].map(status => (
                  <div key={status} style={{ marginTop: '1.5rem' }}>
                    <h4 className={styles.sectionTitle}>{status.charAt(0).toUpperCase() + status.slice(1)} ({selectedClass.submissions.filter(s => s.status === status).length})</h4>
                    {selectedClass.submissions.filter(s => s.status === status).length === 0 ? <p>No {status} submissions.</p> :
                      selectedClass.submissions.filter(s => s.status === status).map(s => (
                        <div key={s.id} className={`${styles.item} ${styles[s.status] || ''}`}>
                          <strong>{s.studentName}</strong>
                          {status === 'pending' ?
                            <button onClick={() => setModalSubmission(s)}>Review</button> :
                            <span>{s.status === 'verified' ? `✓ Verified (${s.score || 'N/A'})` : '✗ Declined'}</span>
                          }
                        </div>
                      ))}
                  </div>
                ))}
              </div>
              <PieChart submissions={selectedClass.submissions} students={selectedClass.students} />
            </div>
          </>
        ) : (
          <div className={styles.placeholder}><h3>Please select a class to view details.</h3></div>
        )}
      </main>
      <SubmissionModal submission={modalSubmission} onClose={() => setModalSubmission(null)} onUpdateStatus={handleUpdateSubmissionStatus} />
    </div>
  );
};

export default TeacherDashboard;
