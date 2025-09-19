import React, { useState, useEffect } from 'react';
import {
  Trophy, Zap, BookOpen, Users, Award, Leaf, Recycle, Calendar, 
  ExternalLink, CheckCircle, Lock, Target, TrendingDown, Home, 
  User, Settings, LogOut, Bell, Menu, X, Puzzle, Brain, 
  HelpCircle, Search, Trash2, Sun
} from 'lucide-react';
import styles from './StudentDashboard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studyTaskCompleted, setStudyTaskCompleted] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      axios.defaults.headers.common['x-auth-token'] = token;
      try {
        const res = await axios.get('http://localhost:5000/api/profile');
        
        // Ensure default values for gamification fields to prevent crashes
        const completeStudentData = {
          totalPoints: 0,
          currentXP: 0,
          nextLevelXP: 100,
          co2Saved: 0,
          plasticReduced: 0,
          level: 1,
          ...res.data
        };
        setStudentData(completeStudentData);

      } catch (err) {
        console.error('Failed to fetch user data', err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const badges = [
    { id: 1, name: "Recycling Hero", icon: "🏆", color: "badge-yellow" },
    { id: 2, name: "Water Saver", icon: "💧", color: "badge-blue" },
    { id: 3, name: "Energy Master", icon: "⚡", color: "badge-green" },
    { id: 4, name: "Eco Warrior", icon: "🌱", color: "badge-emerald" }
  ];

  const upcomingTasks = [
    { id: 1, title: "Segregate Waste Challenge", description: "Sort your household waste correctly for one week", deadline: "Due: Today, 19 Sep 2025", points: 150 },
  ];

  const newsItems = [
    { id: 1, title: "New Recycling Initiative Launches in Hyderabad", description: "Schools across the city are implementing advanced recycling programs.", date: "September 15, 2025", category: "Education" },
  ];

  const handleStudyTaskComplete = () => setStudyTaskCompleted(true);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };
  
  if (isLoading || !studentData) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  
  const progressPercentage = (studentData.currentXP / studentData.nextLevelXP) * 100 || 0;

  return (
    <div className={styles['dashboard-container']}>
      <nav className={styles.navbar}>
        <div className={styles['navbar-container']}>
          <div className={styles['navbar-content']}>
            <div className={styles['logo-section']}>
              <div className={styles['logo-icon']}><Leaf size={24} color="white" /></div>
              <span className={styles['logo-text']}>EcoLearn</span>
            </div>
            
            <div className={styles['desktop-nav']}>
              <button onClick={() => scrollToSection('dashboard-top')} className={`${styles['nav-button']} ${styles.active}`}><Home size={16} /><span>Dashboard</span></button>
              <button onClick={() => scrollToSection('study-section')} className={styles['nav-button']}><BookOpen size={16} /><span>Study Tasks</span></button>
              <button onClick={() => scrollToSection('challenges-section')} className={styles['nav-button']}><Target size={16} /><span>Challenges</span></button>
              <button onClick={() => scrollToSection('news-section')} className={styles['nav-button']}><Leaf size={16} /><span>News</span></button>
            </div>

            <div className={styles['desktop-right']}>
              <button className={styles['notification-btn']}><Bell size={20} /><span className={styles['notification-badge']}>3</span></button>
              <Link to="/profile" className={styles['profile-link']}>
                <div className={styles['profile-section']}>
                  <div className={styles['profile-avatar']}>{studentData.name.charAt(0).toUpperCase()}</div>
                  <span>{studentData.name}</span>
                </div>
              </Link>
            </div>
            
            <button onClick={toggleMobileMenu} className={styles['mobile-menu-btn']}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className={styles['mobile-menu']}>
              <button onClick={() => scrollToSection('dashboard-top')} className={`${styles['nav-button']} ${styles.active}`}><Home size={16} /><span>Dashboard</span></button>
              <button onClick={() => scrollToSection('study-section')} className={styles['nav-button']}><BookOpen size={16} /><span>Study Tasks</span></button>
              <button onClick={() => scrollToSection('challenges-section')} className={styles['nav-button']}><Target size={16} /><span>Challenges</span></button>
              <button onClick={() => scrollToSection('news-section')} className={styles['nav-button']}><Leaf size={16} /><span>News</span></button>
              <div className={styles['mobile-nav-section']}>
                <Link to="/profile" className={styles['profile-link']} onClick={toggleMobileMenu}>
                  <div className={styles['profile-section']}>
                    <div className={styles['profile-avatar']}>{studentData.name.charAt(0).toUpperCase()}</div>
                    <span>{studentData.name}</span>
                  </div>
                </Link>
                <button className={styles['mobile-notification']}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={16} /><span>Notifications</span></div>
                  <span className={styles['notification-badge']}>3</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <header id="dashboard-top" className={styles.header}>
        <div className={styles['header-container']}>
          <div className={styles['header-content']}>
            <div className={styles['welcome-section']}>
              <h1>Welcome back, <span className={styles['welcome-name']}>{studentData.name}</span>! 🌱</h1>
              <p className={styles['welcome-subtitle']}>Ready to make a difference today?</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className={styles['main-content']}>
        {/* Top Row - Points and Badges */}
        <div className={styles['grid-3']}>
          <div className={`${styles.card} ${styles['card-border-yellow']}`}>
            <div className={styles['points-card']}>
              <div className={styles['points-icon']}>
                <Zap size={32} color="#d97706" />
              </div>
              <div>
                <div className={styles['points-number']}>{studentData.totalPoints.toLocaleString()}</div>
                <p className={styles['points-label']}>Eco Points Earned</p>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <h3 className={styles['section-title']}>
              <Award size={24} color="#059669" /> Your Eco Badges
            </h3>
            <div className={styles['badges-grid']}>
              {badges.map((badge) => (
                <div key={badge.id} className={`${styles['badge-item']} ${styles[badge.color]}`}>
                  <div className={styles['badge-icon']}>{badge.icon}</div>
                  <div className={styles['badge-name']}>{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className={`${styles.card} ${styles['grid-1']}`}>
          <h3 className={styles['section-title']}>Quick Actions</h3>
          <div className={styles['actions-grid']}>
            <Link to="/student/quiz" className={styles['action-btn']}>
              <BookOpen size={20} />
              <span>Take a Quiz</span>
            </Link>
            <button className={`${styles['action-btn']} ${styles.green}`}>
              <Target size={20} />
              <span>Complete Challenge</span>
            </button>
            <button className={`${styles['action-btn']} ${styles.purple}`}>
              <Users size={20} />
              <span>View Leaderboard</span>
            </button>
          </div>
        </div>



        {/* Quick Actions */}
        <div className={`${styles.card} ${styles['grid-1']}`}>
          <h3 className={styles['section-title']}>Eco Games</h3>
          <div className={styles['actions-grid']}>
            <Link to='/student/puzzle' className={styles['action-btn']}>
               <Puzzle size={20} /><span>Eco Puzzle</span>
            </Link>
            <Link to='/student/memory' className={`${styles['action-btn']} ${styles.green}`}>
              <Brain size={20} /><span>Memory Game</span>
            </Link>
            <Link to='/student/trivia' className={`${styles['action-btn']} ${styles.purple}`}>
              <HelpCircle size={20} /><span>Eco Trivia</span>
            </Link>
            <Link to='/student/wordsearch' className={`${styles['action-btn']} ${styles.blue}`}>
              <Search size={20} /><span>Word Search</span>
            </Link>
            <Link to='/student/matching' className={`${styles['action-btn']} ${styles.yellow}`}>
              <Puzzle size={20} /><span>Matching Game</span>
            </Link>
            <Link to='/student/sorting' className={`${styles['action-btn']} ${styles.red}`}>
              <Trash2 size={20} /><span>Sorting Game</span>
            </Link>
            <Link to='/student/bingo' className={`${styles['action-btn']} ${styles.emerald}`}>
              <Trophy size={20} /><span>Eco Bingo</span>
            </Link>
            <Link to='/student/carbon' className={`${styles['action-btn']} ${styles.teal}`}>
              <TrendingDown size={20} /><span>Carbon Calculator</span>
            </Link>
            <Link to='/student/recycle' className={`${styles['action-btn']} ${styles.cyan}`}>
              <Recycle size={20} /><span>Recycle Sort</span>
            </Link>
            <Link to='/student/water' className={`${styles['action-btn']} ${styles.sky}`}>
              <Users size={20} /><span>Water Saver</span>
            </Link>
            <Link to='/student/energy' className={`${styles['action-btn']} ${styles.indigo}`}>
              <Zap size={20} /><span>Energy Quiz</span>
            </Link>
            <Link to='/student/wildlife' className={`${styles['action-btn']} ${styles.violet}`}>
              <Award size={20} /><span>Wildlife Match</span>
            </Link>
            <Link to='/student/climate' className={`${styles['action-btn']} ${styles.fuchsia}`}>
              <Leaf size={20} /><span>Climate Challenge</span>
            </Link>
            <Link to='/student/garden' className={`${styles['action-btn']} ${styles.rose}`}>
              <Home size={20} /><span>Garden Planner</span>
            </Link>
            <Link to='/student/waste' className={`${styles['action-btn']} ${styles.amber}`}>
              <Trash2 size={20} /><span>Waste Audit</span>
            </Link>
            <Link to='/student/sustainability' className={`${styles['action-btn']} ${styles.lime}`}>
              <BookOpen size={20} /><span>Sustainability Trivia</span>
            </Link>
            <Link to='/student/foodwaste' className={`${styles['action-btn']} ${styles.orange}`}>
              <Target size={20} /><span>Food Waste Game</span>
            </Link>
            <Link to='/student/pollution' className={`${styles['action-btn']} ${styles.stone}`}>
              <Settings size={20} /><span>Pollution Puzzle</span>
            </Link>
            <Link to='/student/solar' className={`${styles['action-btn']} ${styles.neutral}`}>
              <Sun size={20} /><span>Solar Simulator</span>
            </Link>
          </div>
        </div>

        {/* Study Task Section */}
        <div id="study-section" className={`${styles.card} ${styles['grid-1']}`}>
          <h3 className={styles['section-title']}>
            <BookOpen size={24} color="#2563eb" /> Today's Study Task
          </h3>
          <div className={styles['study-content']}>
            <h4 className={styles['study-title']}>Understanding Carbon Footprints</h4>
            <p className={styles['study-description']}>
              Learn about carbon footprints and how individual actions impact the environment...
            </p>
            {!studyTaskCompleted ? (
              <button onClick={handleStudyTaskComplete} className={styles['complete-btn']}>
                <CheckCircle size={16} /><span>Mark as Completed</span>
              </button>
            ) : (
              <div className={styles['completed-indicator']}>
                <CheckCircle size={20} /><span>Completed! Great job! 🎉</span>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks Section */}
        <div id="challenges-section" className={`${styles.card} ${styles['grid-1']}`}>
          <h3 className={styles['section-title']}>
            <Calendar size={24} color="#059669" /> Teacher-Assigned Tasks
            {!studyTaskCompleted && <Lock size={16} color="#9ca3af" />}
          </h3>
          {!studyTaskCompleted ? (
            <div className={styles['locked-section']}>
              <Lock className={styles['lock-icon']} />
              <p className={styles['locked-text']}>Complete your study task to unlock challenges!</p>
            </div>
          ) : (
            <div className={styles['tasks-grid']}>
              {upcomingTasks.map((task) => (
                <div key={task.id} className={styles['task-card']}>
                  <h4 className={styles['task-title']}>{task.title}</h4>
                  <p className={styles['task-description']}>{task.description}</p>
                  <div className={styles['task-footer']}>
                    <span className={styles['task-deadline']}>{task.deadline}</span>
                    <span className={styles['task-points']}>+{task.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles['grid-2']}>
          {/* Environmental News */}
          <div id="news-section" className={styles.card}>
            <h3 className={styles['section-title']}>
              <Leaf size={24} color="#059669" /> Environmental News
            </h3>
            <div className={styles['news-list']}>
              {newsItems.map((item) => (
                <div key={item.id} className={styles['news-item']}>
                  <div className={styles['news-header']}>
                    <h4 className={styles['news-title']}>{item.title}</h4>
                    <span className={styles['news-category']}>{item.category}</span>
                  </div>
                  <p className={styles['news-description']}>{item.description}</p>
                  <div className={styles['news-footer']}>
                    <span className={styles['news-date']}>{item.date}</span>
                    <a href="#" className={styles['read-more']}>
                      <span>Read More</span><ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Impact */}
          <div className={styles.card}>
            <h3 className={styles['section-title']}>
              <TrendingDown size={24} color="#059669" /> Your Environmental Impact
            </h3>
            <div className={styles['impact-stats']}>
              <div className={`${styles['stat-card']} ${styles.green}`}>
                <div className={styles['stat-header']}>
                  <div className={styles['stat-label-section']}>
                    <div className={`${styles['stat-icon']} ${styles.green}`}><Leaf size={16} /></div>
                    <span className={styles['stat-label']}>CO₂ Saved</span>
                  </div>
                  <span className={`${styles['stat-value']} ${styles.green}`}>{studentData.co2Saved} kg</span>
                </div>
                <p className={styles['stat-description']}>Equivalent to planting 3 trees this month!</p>
              </div>
              <div className={`${styles['stat-card']} ${styles.blue}`}>
                <div className={styles['stat-header']}>
                  <div className={styles['stat-label-section']}>
                    <div className={`${styles['stat-icon']} ${styles.blue}`}><Recycle size={16} /></div>
                    <span className={styles['stat-label']}>Plastic Reduced</span>
                  </div>
                  <span className={`${styles['stat-value']} ${styles.blue}`}>{studentData.plasticReduced} kg</span>
                </div>
                <p className={styles['stat-description']}>That's 160 plastic bottles diverted from landfills!</p>
              </div>
              <div className={`${styles['stat-card']} ${styles.purple}`}>
                <div className={styles['stat-header']}>
                  <span className={styles['stat-label']}>Weekly Goal Progress</span>
                  <span className={`${styles['stat-value']} ${styles.purple}`}>73%</span>
                </div>
                <div className={styles['goal-progress']}>
                  <div className={styles['goal-fill']} style={{ width: '73%' }}></div>
                </div>
                <p className={styles['stat-description']}>Keep going! You're doing great this week.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
