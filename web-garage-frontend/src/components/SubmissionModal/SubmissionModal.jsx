import React, { useState } from 'react';
import styles from './SubmissionModal.module.css';

const SubmissionModal = ({ submission, onClose, onUpdate }) => {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState({});

  if (!submission) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!score || score < 0 || score > 100) {
      newErrors.score = 'Score must be between 0 and 100';
    }

    if (!feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApprove = () => {
    if (validateForm()) {
      onUpdate(submission.id, 'reviewed', parseInt(score), feedback);
    }
  };

  const handleReject = () => {
    if (feedback.trim()) {
      onUpdate(submission.id, 'reviewed', 0, feedback);
    } else {
      setErrors({ feedback: 'Feedback is required when rejecting' });
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'score') {
      setScore(value);
    } else {
      setFeedback(value);
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Review Submission</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Student Information */}
          <div className={styles.studentInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Student:</span>
              <span className={styles.value}>{submission.studentName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Submitted:</span>
              <span className={styles.value}>
                {new Date(submission.submittedDate).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.status} ${styles[submission.status]}`}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Submission Content */}
          <div className={styles.submissionSection}>
            <h3>Submission Content</h3>
            <div className={styles.contentBox}>
              <p>{submission.content}</p>
              {submission.imageUrl && (
                <div className={styles.imageSection}>
                  <span className={styles.imageLabel}>📷 Attached Image:</span>
                  <span className={styles.imageName}>{submission.imageUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className={styles.reviewSection}>
            <h3>Review & Feedback</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="score" className={styles.inputLabel}>
                Score (0-100) *
              </label>
              <input
                type="number"
                id="score"
                min="0"
                max="100"
                value={score}
                onChange={(e) => handleInputChange('score', e.target.value)}
                className={`${styles.scoreInput} ${errors.score ? styles.errorInput : ''}`}
                placeholder="Enter score..."
              />
              {errors.score && <span className={styles.errorText}>{errors.score}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="feedback" className={styles.inputLabel}>
                Feedback *
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => handleInputChange('feedback', e.target.value)}
                className={`${styles.feedbackTextarea} ${errors.feedback ? styles.errorInput : ''}`}
                placeholder="Provide constructive feedback..."
                rows={4}
              />
              {errors.feedback && <span className={styles.errorText}>{errors.feedback}</span>}
            </div>

            {/* Quick Feedback Suggestions */}
            <div className={styles.suggestions}>
              <span className={styles.suggestionsLabel}>Quick feedback:</span>
              <div className={styles.suggestionButtons}>
                <button
                  type="button"
                  className={styles.suggestionBtn}
                  onClick={() => setFeedback("Excellent work! You've completed the task perfectly.")}
                >
                  Excellent
                </button>
                <button
                  type="button"
                  className={styles.suggestionBtn}
                  onClick={() => setFeedback("Good effort! Consider providing more detailed evidence next time.")}
                >
                  Good
                </button>
                <button
                  type="button"
                  className={styles.suggestionBtn}
                  onClick={() => setFeedback("The submission needs more work. Please provide clearer evidence.")}
                >
                  Needs Work
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.rejectBtn}
            onClick={handleReject}
          >
            Reject (0 points)
          </button>
          <button
            className={styles.approveBtn}
            onClick={handleApprove}
          >
            Approve & Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;