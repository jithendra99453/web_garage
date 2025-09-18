import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TeacherDashboard.module.css';

// Dummy Data
const dummyClasses = [
  {
    id: 1,
    name: "Class 10A",
    tasks: [
      { id: 1, title: "Plant 5 trees", description: "Upload proof of planting trees", dueDate: "2025-09-20", active: true }
    ],
    students: [
      { id: 1, name: "Amit" },
      { id: 2, name: "Priya" },
      { id: 3, name: "Rahul" },
      { id: 4, name: "Sneha" },
      { id: 5, name: "Vikash" }
    ],
    submissions: [
      { id: 101, taskId: 1, studentId: 1, studentName: "Amit", content: "Photo of tree planting with GPS location", status: "pending", submittedDate: "2025-09-15" },
      { id: 102, taskId: 1, studentId: 2, studentName: "Priya", content: "Tree planting report with photos", status: "verified", submittedDate: "2025-09-14" },
      { id: 103, taskId: 1, studentId: 4, studentName: "Sneha", content: "Video of tree planting process", status: "pending", submittedDate: "2025-09-16" }
    ]
  },
  {
    id: 2,
    name: "Class 10B",
    tasks: [
      { id: 2, title: "Water conservation project", description: "Document water saving methods", dueDate: "2025-09-25", active: true }
    ],
    students: [
      { id: 6, name: "Arjun" },
      { id: 7, name: "Kavya" }
    ],
    submissions: [
      { id: 201, taskId: 2, studentId: 6, studentName: "Arjun", content: "Water conservation report", status: "verified", submittedDate: "2025-09-12" }
    ]
  }
];

// Header
const Header = ({ teacherName, onLogout }) => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <h1 className={styles.headerTitle}>Teacher Dashboard</h1>
      <div className={styles.userSection}>
        <span className={styles.teacherName}>Welcome, {teacherName}</span>
        <button className={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </div>
    </div>
  </header>
);

// Class Selector
const ClassSelector = ({ classes, selectedClass, onClassChange }) => (
  <div className={styles.classSelector}>
    <label className={styles.label}>Select Class:</label>
    <select
      className={styles.select}
      value={selectedClass?.id || ''}
      onChange={(e) => {
        const classId = parseInt(e.target.value);
        const chosen = classes.find(c => c.id === classId);
        onClassChange(chosen);
      }}
    >
      <option value="">Choose a class...</option>
      {classes.map(classItem => (
        <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
      ))}
    </select>
  </div>
);

// Current Task
const CurrentTask = ({ task }) => {
  if (!task) {
    return (
      <div className={styles.currentTask}>
        <h3>No Active Task</h3>
        <p className={styles.noTask}>No active task assigned to this class.</p>
      </div>
    );
  }

  return (
    <div className={styles.currentTask}>
      <h3>Current Active Task</h3>
      <div className={styles.taskCard}>
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

// Add Task
const AddTask = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      active: true
    };
    onAddTask(newTask);
    setTaskTitle('');
    setTaskDescription('');
    setDueDate('');
  };

  return (
    <div className={styles.addTask}>
      <h3>Add New Task</h3>
      <div className={styles.form}>
        <input type="text" placeholder="Task title..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        <input type="text" placeholder="Task description..." value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button onClick={handleSubmit}>Add Task</button>
      </div>
    </div>
  );
};

// Submission Modal
const SubmissionModal = ({ submission, onClose, onVerify }) => {
  if (!submission) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Submission Details</h3>
        <div>
          <p><strong>Student:</strong> {submission.studentName}</p>
          <p><strong>Submitted:</strong> {new Date(submission.submittedDate).toLocaleDateString()}</p>
          <div className={styles.submissionContent}>
            <strong>Content:</strong>
            <p>{submission.content}</p>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.verifyButton} onClick={() => onVerify(submission.id)}>Mark as Verified</button>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Submission List
const SubmissionList = ({ submissions, onVerifyClick }) => {
  const pending = submissions.filter(s => s.status === 'pending');
  const verified = submissions.filter(s => s.status === 'verified');

  return (
    <div className={styles.submissionList}>
      <h3>Submissions</h3>

      <div>
        <h4>Pending Submissions ({pending.length})</h4>
        {pending.length === 0 ? <p>No pending submissions</p> :
          pending.map(s => (
            <div key={s.id} className={styles.item}>
              <div>
                <strong>{s.studentName}</strong>
                <p>Submitted: {new Date(s.submittedDate).toLocaleDateString()}</p>
              </div>
              <button onClick={() => onVerifyClick(s)}>Verify</button>
            </div>
          ))}
      </div>

      <div>
        <h4>Verified Submissions ({verified.length})</h4>
        {verified.length === 0 ? <p>No verified submissions</p> :
          verified.map(s => (
            <div key={s.id} className={`${styles.item} ${styles.verified}`}>
              <div>
                <strong>{s.studentName}</strong>
                <p>Verified: {new Date(s.submittedDate).toLocaleDateString()}</p>
              </div>
              <span className={styles.verifiedBadge}>✓ Verified</span>
            </div>
          ))}
      </div>
    </div>
  );
};

// Pie Chart (simplified)
const PieChart = ({ submissions, students }) => {
  const total = students.length;
  const verified = submissions.filter(s => s.status === 'verified').length;
  const pending = submissions.filter(s => s.status === 'pending').length;
  const submitted = submissions.length;
  const notSubmitted = total - submitted;

  return (
    <div className={styles.pieChart}>
      <h3>Submission Status</h3>
      <p>Verified: {verified} | Pending: {pending} | Not Submitted: {notSubmitted}</p>
      <p>Total Students: {total}, Submitted: {submitted}</p>
    </div>
  );
};

// Main Teacher Dashboard
const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState(dummyClasses);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalSubmission, setModalSubmission] = useState(null);

  const handleAddTask = (task) => {
    if (!selectedClass) return;
    setClasses(prev =>
      prev.map(c => c.id === selectedClass.id ? { ...c, tasks: [...c.tasks, task] } : c)
    );
    setSelectedClass(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const handleVerifySubmission = (id) => {
    setClasses(prev =>
      prev.map(c => c.id === selectedClass.id ? {
        ...c,
        submissions: c.submissions.map(s => s.id === id ? { ...s, status: 'verified' } : s)
      } : c)
    );
    setSelectedClass(prev => ({ ...prev, submissions: prev.submissions.map(s => s.id === id ? { ...s, status: 'verified' } : s) }));
    setModalSubmission(null);
  };

  const currentTask = selectedClass?.tasks.find(t => t.active);

  return (
    <div className={styles.dashboard}>
      <Header teacherName="Mr. Sharma" onLogout={() => { localStorage.removeItem('token'); navigate('/login'); }} />
      <main className={styles.main}>
        <ClassSelector classes={classes} selectedClass={selectedClass} onClassChange={setSelectedClass} />

        {selectedClass ? (
          <>
            <CurrentTask task={currentTask} />
            <AddTask onAddTask={handleAddTask} />
            <div className={styles.grid}>
              <SubmissionList submissions={selectedClass.submissions} onVerifyClick={setModalSubmission} />
              <PieChart submissions={selectedClass.submissions} students={selectedClass.students} />
            </div>
          </>
        ) : (
          <div className={styles.placeholder}>
            <h3>Please select a class to get started</h3>
            <p>Choose a class from the dropdown above to view tasks and submissions.</p>
          </div>
        )}
      </main>
      <SubmissionModal submission={modalSubmission} onClose={() => setModalSubmission(null)} onVerify={handleVerifySubmission} />
    </div>
  );
};

export default TeacherDashboard;
