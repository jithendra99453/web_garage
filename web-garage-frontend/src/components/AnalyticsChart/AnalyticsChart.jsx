import React from 'react';
import styles from './AnalyticsChart.module.css';

const AnalyticsChart = ({ submissions, students, tasks }) => {
  // Calculate statistics
  const totalStudents = students.length;
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
  const reviewedSubmissions = submissions.filter(s => s.status === 'reviewed').length;
  const averageScore = reviewedSubmissions.length > 0 
    ? Math.round(submissions
        .filter(s => s.status === 'reviewed' && s.score)
        .reduce((sum, s) => sum + s.score, 0) / reviewedSubmissions.length)
    : 0;
  
  const submissionRate = totalStudents > 0 ? Math.round((totalSubmissions / totalStudents) * 100) : 0;

  // Data for simple bar chart
  const chartData = [
    { label: 'Pending', value: pendingSubmissions, color: '#fbbf24' },
    { label: 'Reviewed', value: reviewedSubmissions, color: '#10b981' },
    { label: 'Not Submitted', value: totalStudents - totalSubmissions, color: '#6b7280' }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  // Task completion data
  const taskStats = tasks.map(task => {
    const taskSubmissions = submissions.filter(s => s.taskId === task.id);
    const taskReviewed = taskSubmissions.filter(s => s.status === 'reviewed');
    return {
      taskTitle: task.title,
      submitted: taskSubmissions.length,
      reviewed: taskReviewed.length,
      pending: taskSubmissions.filter(s => s.status === 'pending').length,
      notSubmitted: totalStudents - taskSubmissions.length
    };
  });

  // Recent activity (last 7 days)
  const getRecentActivity = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return submissions
      .filter(s => new Date(s.submittedDate) >= lastWeek)
      .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
      .slice(0, 5);
  };

  const recentActivity = getRecentActivity();

  return (
    <div className={styles.analyticsContainer}>
      {/* Summary Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalStudents}</div>
          <div className={styles.statLabel}>Total Students</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalSubmissions}</div>
          <div className={styles.statLabel}>Total Submissions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{submissionRate}%</div>
          <div className={styles.statLabel}>Submission Rate</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{averageScore}</div>
          <div className={styles.statLabel}>Average Score</div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Submission Status Chart */}
        <div className={styles.chartCard}>
          <h3>Submission Status Overview</h3>
          <div className={styles.barChart}>
            {chartData.map((item, index) => (
              <div key={index} className={styles.barGroup}>
                <div className={styles.barLabel}>{item.label}</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
                <div className={styles.barValue}>{item.value}</div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className={styles.legend}>
            {chartData.map((item, index) => (
              <div key={index} className={styles.legendItem}>
                <div 
                  className={styles.legendColor} 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.label}: {item.value} students ({totalStudents > 0 ? Math.round((item.value / totalStudents) * 100) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Performance */}
        <div className={styles.chartCard}>
          <h3>Task Performance</h3>
          {taskStats.length === 0 ? (
            <p className={styles.noData}>No tasks assigned yet.</p>
          ) : (
            <div className={styles.taskPerformance}>
              {taskStats.map((task, index) => (
                <div key={index} className={styles.taskRow}>
                  <div className={styles.taskTitle}>{task.taskTitle}</div>
                  <div className={styles.taskStats}>
                    <div className={styles.taskStat}>
                      <span className={styles.taskStatValue}>{task.reviewed}</span>
                      <span className={styles.taskStatLabel}>Reviewed</span>
                    </div>
                    <div className={styles.taskStat}>
                      <span className={styles.taskStatValue}>{task.pending}</span>
                      <span className={styles.taskStatLabel}>Pending</span>
                    </div>
                    <div className={styles.taskStat}>
                      <span className={styles.taskStatValue}>{task.notSubmitted}</span>
                      <span className={styles.taskStatLabel}>Not Submitted</span>
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ 
                        width: `${totalStudents > 0 ? (task.submitted / totalStudents) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.chartCard}>
        <h3>Recent Activity (Last 7 Days)</h3>
        {recentActivity.length === 0 ? (
          <p className={styles.noData}>No recent submissions.</p>
        ) : (
          <div className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <strong>{activity.studentName}</strong>
                  <span className={styles.activityAction}>submitted a task</span>
                  <span className={styles.activityDate}>
                    {new Date(activity.submittedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={`${styles.activityStatus} ${styles[activity.status]}`}>
                  {activity.status === 'pending' ? 'Needs Review' : 'Reviewed'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className={styles.chartCard}>
        <h3>Performance Insights</h3>
        <div className={styles.insights}>
          <div className={styles.insight}>
            <div className={styles.insightIcon}>📊</div>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Class Participation</div>
              <div className={styles.insightDescription}>
                {submissionRate >= 80 ? 'Excellent participation rate!' : 
                 submissionRate >= 60 ? 'Good participation, room for improvement' :
                 'Low participation - consider sending reminders'}
              </div>
            </div>
          </div>
          
          <div className={styles.insight}>
            <div className={styles.insightIcon}>🎯</div>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Average Performance</div>
              <div className={styles.insightDescription}>
                {averageScore >= 90 ? 'Outstanding work quality!' :
                 averageScore >= 75 ? 'Good quality submissions' :
                 averageScore >= 60 ? 'Average work, provide more guidance' :
                 'Consider providing additional resources'}
              </div>
            </div>
          </div>

          <div className={styles.insight}>
            <div className={styles.insightIcon}>⚡</div>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Review Status</div>
              <div className={styles.insightDescription}>
                {pendingSubmissions === 0 ? 'All submissions reviewed!' :
                 pendingSubmissions <= 3 ? 'Only a few submissions pending review' :
                 'Multiple submissions need attention'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;