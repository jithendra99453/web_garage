import React, { useState } from 'react';
import styles from './TaskForm.module.css';

const TaskForm = ({ onSubmit, onClose, students = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 100
  });
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStudentSelect = (studentId) => {
    setAssignedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (assignedStudents.length === students.length) {
      setAssignedStudents([]); // Deselect all
    } else {
      setAssignedStudents(students.map(s => s.id)); // Select all
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.description.trim()) newErrors.description = 'Task description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) newErrors.dueDate = 'Due date must be in the future';
    }
    if (!formData.points || formData.points < 1 || formData.points > 500) newErrors.points = 'Points must be between 1 and 500';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        points: parseInt(formData.points),
        assignedTo: assignedStudents
      });
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create New Task</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Form groups for title, description, dueDate, points remain the same */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Task Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={`${styles.input} ${errors.title ? styles.errorInput : ''}`} placeholder="e.g., Plant 5 Trees" />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${styles.textarea} ${errors.description ? styles.errorInput : ''}`} placeholder="Provide detailed instructions for the task..." rows={4} />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="dueDate" className={styles.label}>Due Date *</label>
              <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} min={getTomorrowDate()} className={`${styles.input} ${errors.dueDate ? styles.errorInput : ''}`} />
              {errors.dueDate && <span className={styles.errorText}>{errors.dueDate}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="points" className={styles.label}>Eco Points</label>
              <input type="number" id="points" name="points" value={formData.points} onChange={handleChange} min={1} max={500} className={`${styles.input} ${errors.points ? styles.errorInput : ''}`} />
              {errors.points && <span className={styles.errorText}>{errors.points}</span>}
            </div>
          </div>

          {/* --- NEW STUDENT SELECTOR SECTION --- */}
          <div className={styles.formGroup}>
            <div className={styles.studentSelectorHeader}>
              <label className={styles.label}>Assign to Students</label>
              <button type="button" onClick={handleSelectAll} className={styles.selectAllBtn}>
                {assignedStudents.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className={styles.studentList}>
              {students.length > 0 ? students.map(student => (
                <label key={student.id} className={styles.studentCheckbox}>
                  <input
                    type="checkbox"
                    checked={assignedStudents.includes(student.id)}
                    onChange={() => handleStudentSelect(student.id)}
                  />
                  {student.name}
                </label>
              )) : <p>No students in this class.</p>}
            </div>
          </div>
          {/* --- END OF NEW SECTION --- */}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
