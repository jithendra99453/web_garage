import React, { useState, useEffect, useContext, useMemo } from 'react'; 
import {
  Trophy, Zap, BookOpen, Users, Award, Leaf, Recycle, Calendar, 
  ExternalLink, CheckCircle, Lock, Target, TrendingDown, Home, 
  User, Settings, LogOut, Bell, Menu, X, Puzzle, Brain, 
  HelpCircle, Search, Trash2, Sun
} from 'lucide-react';
import styles from './StudentDashboard.module.css';
import { Link } from 'react-router-dom';

// 1. Import the context
import UserContext from '../../context/UserContext.jsx'; 

// --- Define constants OUTSIDE the component ---
const allGames = [
  { name: 'Eco Puzzle', link: '/student/puzzle', icon: <Puzzle size={20} />, level: 'School', color: 'blue' },
  { name: 'Memory Game', link: '/student/memory', icon: <Brain size={20} />, level: 'School', color: 'green' },
  { name: 'Word Search', link: '/student/wordsearch', icon: <Search size={20} />, level: 'School', color: 'blue' },
  { name: 'Matching Game', link: '/student/matching', icon: <Puzzle size={20} />, level: 'School', color: 'yellow' },
  { name: 'Sorting Game', link: '/student/sorting', icon: <Trash2 size={20} />, level: 'School', color: 'red' },
  { name: 'Eco Bingo', link: '/student/bingo', icon: <Trophy size={20} />, level: 'School', color: 'emerald' },
  { name: 'Wildlife Match', link: '/student/wildlife', icon: <Award size={20} />, level: 'School', color: 'violet' },
  { name: 'Garden Planner', link: '/student/garden', icon: <Home size={20} />, level: 'School', color: 'rose' },
  { name: 'Pollution Puzzle', link: '/student/pollution', icon: <Settings size={20} />, level: 'School', color: 'stone' },
  { name: 'Solar Simulator', link: '/student/solar', icon: <Sun size={20} />, level: 'School', color: 'neutral' },
  { name: 'Recycle Sort', link: '/student/recycle', icon: <Recycle size={20} />, level: 'School', color: 'cyan' },
  { name: 'Water Saver', link: '/student/water', icon: <Users size={20} />, level: 'School', color: 'sky' },
  { name: 'Eco Trivia', link: '/student/trivia', icon: <HelpCircle size={20} />, level: 'College', color: 'purple' },
  { name: 'Carbon Calculator', link: '/student/carbon', icon: <TrendingDown size={20} />, level: 'College', color: 'teal' },
  { name: 'Energy Quiz', link: '/student/energy', icon: <Zap size={20} />, level: 'College', color: 'indigo' },
  { name: 'Climate Challenge', link: '/student/climate', icon: <Leaf size={20} />, level: 'College', color: 'fuchsia' },
  { name: 'Waste Audit', link: '/student/waste', icon: <Trash2 size={20} />, level: 'College', color: 'amber' },
  { name: 'Sustainability Trivia', link: '/student/sustainability', icon: <BookOpen size={20} />, level: 'College', color: 'lime' },
  { name: 'Food Waste Game', link: '/student/foodwaste', icon: <Target size={20} />, level: 'College', color: 'orange' },
];

const badges = [
    { id: 1, name: "Recycling Hero", icon: "🏆", color: "badge-yellow" },
    { id: 2, name: "Water Saver", icon: "💧", color: "badge-blue" },
    { id: 3, name: "Energy Master", icon: "⚡", color: "badge-green" },
    { id: 4, name: "Eco Warrior", icon: "🌱", color: "badge-emerald" }
];

const upcomingTasks = [
    { id: 1, title: "Segregate Waste Challenge", description: "Sort your household waste correctly for one week", deadline: "Due: Today, 20 Sep 2025", points: 150 },
];

const newsItems = [
    { id: 1, title: "New Recycling Initiative Launches in Hyderabad", description: "Schools across the city are implementing advanced recycling programs.", date: "September 15, 2025", category: "Education" },
];

const StudentDashboard = () => {
  // 2. Get the student data and loading status from the context
  const { studentData, isLoading } = useContext(UserContext);
  
  // Local state for UI elements specific to this component
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studyTaskCompleted, setStudyTaskCompleted] = useState(false);
  
  // 3. Use `useMemo` to efficiently filter games only when studentData changes
  const availableGames = useMemo(() => {
    if (!studentData?.educationType) return [];
    
    const userEducationLevel = studentData.educationType.toLowerCase();
    if (userEducationLevel === 'school') {
      return allGames.filter(game => game.level === 'School');
    } else {
      // Default to College games for everyone else ('College', 'UG', etc.)
      return allGames.filter(game => game.level === 'College');
    }
  }, [studentData]); // Dependency array: this code only re-runs if studentData changes
  
  // The local `useEffect` for fetching data has been removed.

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
      {/* Mobile-First Navigation */}
      <nav className={styles.navbar}>
        <div className={styles['nav-container']}>
          <div className={styles['nav-brand']}>
            <Leaf size={28} color="#059669" />
            <span className={styles['brand-text']}>EcoLearn</span>
          </div>
          
          <div className={styles['nav-desktop']}>
            <button onClick={() => scrollToSection('dashboard-top')} className={styles['nav-link']}>
              <Home size={18} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => scrollToSection('study-section')} className={styles['nav-link']}>
              <BookOpen size={18} />
              <span>Study</span>
            </button>
            <button onClick={() => scrollToSection('challenges-section')} className={styles['nav-link']}>
              <Trophy size={18} />
              <span>Challenges</span>
            </button>
            <button className={styles['nav-link']}>
              <Bell size={18} />
              <span>Notifications</span>
            </button>
          </div>

          <div className={styles['nav-actions']}>
            <button className={styles['nav-icon-btn']}>
              <Bell size={20} />
            </button>
            <Link to="/profile" className={styles['nav-icon-btn']}>
              <User size={20} />
            </Link>
            <button 
              className={styles['mobile-menu-btn']}
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={styles['mobile-menu-overlay']}>
            <div className={styles['mobile-menu']}>
              <button onClick={() => scrollToSection('dashboard-top')} className={styles['mobile-menu-item']}>
                <Home size={20} />
                <span>Dashboard</span>
              </button>
              <button onClick={() => scrollToSection('study-section')} className={styles['mobile-menu-item']}>
                <BookOpen size={20} />
                <span>Study</span>
              </button>
              <button onClick={() => scrollToSection('challenges-section')} className={styles['mobile-menu-item']}>
                <Trophy size={20} />
                <span>Challenges</span>
              </button>
              <button onClick={() => scrollToSection('notifications-section')} className={styles['mobile-menu-item']}>
                <Bell size={20} />
                <span>Notifications</span>
              </button>
              <hr className={styles['menu-divider']} />
              <Link to="/profile" className={styles['mobile-menu-item']}>
                <User size={20} />
                <span>Profile</span>
              </Link>
              <button className={styles['mobile-menu-item']}>
                <Settings size={20} />
                <span>Settings</span>
              </button>
              <button 
                className={styles['mobile-menu-item-danger']}
                onClick={() => {
                  // Add your logout logic here
                  if (window.confirm('Are you sure you want to logout?')) {
                    // Clear user data and redirect to login
                    localStorage.removeItem('userToken');
                    window.location.href = '/login';
                  }
                }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Header Section */}
      <header id="dashboard-top" className={styles.header}>
        <div className={styles['header-container']}>
          <div className={styles['header-content']}>
            <div className={styles['welcome-section']}>
              <div className={styles['welcome-main']}>
                <h1 className={styles['welcome-title']}>
                  Welcome back, <span className={styles['welcome-name']}>{studentData.name}</span>! 
                  <span className={styles['wave-emoji']}>🌱</span>
                </h1>
                <p className={styles['welcome-subtitle']}>Ready to make a difference today?</p>
              </div>
              <div className={styles['level-progress']}>
                <div className={styles['level-info']}>
                  <span className={styles['level-text']}>Level {studentData.level}</span>
                  <span className={styles['xp-text']}>{studentData.currentXP}/{studentData.nextLevelXP} XP</span>
                </div>
                <div className={styles['progress-bar']}>
                  <div 
                    className={styles['progress-fill']} 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className={styles['progress-text']}>
                  {studentData.nextLevelXP - studentData.currentXP} XP to next level
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className={styles['main-content']}>
        {/* Stats Cards */}
        <div className={styles['stats-grid']}>
          <div className={styles['stat-card-modern']}>
            <div className={styles['stat-icon-wrapper']}>
              <Zap className={styles['stat-icon']} />
            </div>
            <div className={styles['stat-content']}>
              <div className={styles['stat-number']}>{studentData.totalPoints.toLocaleString()}</div>
              <div className={styles['stat-label']}>Eco Points</div>
            </div>
          </div>
          
          <div className={styles['stat-card-modern']}>
            <div className={styles['stat-icon-wrapper']}>
              <Award className={styles['stat-icon']} />
            </div>
            <div className={styles['stat-content']}>
              <div className={styles['stat-number']}>{badges.length}</div>
              <div className={styles['stat-label']}>Badges Earned</div>
            </div>
          </div>
          
          <div className={styles['stat-card-modern']}>
            <div className={styles['stat-icon-wrapper']}>
              <Trophy className={styles['stat-icon']} />
            </div>
            <div className={styles['stat-content']}>
              <div className={styles['stat-number']}>#{Math.floor(Math.random() * 50) + 1}</div>
              <div className={styles['stat-label']}>Rank</div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className={styles['section-card']}>
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

        {/* Quick Actions */}
        <div className={styles['section-card']}>
          <h3 className={styles['section-title']}>
            <Target size={24} color="#2563eb" /> Quick Actions
          </h3>
          <div className={styles['actions-grid']}>
            <Link to="/student/quiz" className={styles['action-btn-modern']}>
              <BookOpen size={20} />
              <span>Take a Quiz</span>
            </Link>
            <button className={styles['action-btn-modern']}>
              <Target size={20} />
              <span>Complete Challenge</span>
            </button>
            <button className={styles['action-btn-modern']}>
              <Users size={20} />
              <span>View Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Eco Games */}
        <div className={styles['section-card']}>
          <h3 className={styles['section-title']}>
            <Puzzle size={24} color="#7c3aed" /> Eco Games
          </h3>
          <div className={styles['games-grid']}>
            {availableGames.map((game) => (
              <Link to={game.link} key={game.name} className={styles['game-card']}>
                <div className={styles['game-icon']}>
                  {game.icon}
                </div>
                <span className={styles['game-name']}>{game.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Study Task Section */}
        <div id="study-section" className={styles['section-card']}>
          <h3 className={styles['section-title']}>
            <BookOpen size={24} color="#2563eb" /> Today's Study Task
          </h3>
          <div className={styles['study-content']}>
            <h4 className={styles['study-title']}>Understanding Carbon Footprints</h4>
            <p className={styles['study-description']}>
              Learn about carbon footprints and how individual actions impact the environment. This comprehensive guide covers measurement techniques, reduction strategies, and personal action plans.
            </p>
            {!studyTaskCompleted ? (
              <button onClick={handleStudyTaskComplete} className={styles['complete-btn']}>
                <CheckCircle size={16} />
                <span>Mark as Completed</span>
              </button>
            ) : (
              <div className={styles['completed-indicator']}>
                <CheckCircle size={20} />
                <span>Completed! Great job! 🎉</span>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks Section */}
        <div id="challenges-section" className={styles['section-card']}>
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

        <div className={styles['bottom-grid']}>
          {/* Environmental News */}
          

          {/* Environmental Impact */}
          <div className={styles['section-card']}>
            <h3 className={styles['section-title']}>
              <TrendingDown size={24} color="#059669" /> Your Environmental Impact
            </h3>
            <div className={styles['impact-stats']}>
              <div className={styles['impact-card']}>
                <div className={styles['impact-header']}>
                  <div className={styles['impact-icon-wrapper']}>
                    <Leaf size={16} />
                  </div>
                  <span className={styles['impact-label']}>CO₂ Saved</span>
                </div>
                <span className={styles['impact-value']}>{studentData.co2Saved} kg</span>
                <p className={styles['impact-description']}>Equivalent to planting 3 trees this month!</p>
              </div>
              
              <div className={styles['impact-card']}>
                <div className={styles['impact-header']}>
                  <div className={styles['impact-icon-wrapper']}>
                    <Recycle size={16} />
                  </div>
                  <span className={styles['impact-label']}>Plastic Reduced</span>
                </div>
                <span className={styles['impact-value']}>{studentData.plasticReduced} kg</span>
                <p className={styles['impact-description']}>160 plastic bottles diverted from landfills!</p>
              </div>
              
              <div className={styles['impact-card']}>
                <div className={styles['impact-header']}>
                  <span className={styles['impact-label']}>Weekly Goal Progress</span>
                </div>
                <div className={styles['goal-progress']}>
                  <div className={styles['goal-fill']} style={{ width: '73%' }}></div>
                </div>
                <span className={styles['impact-value']}>73%</span>
                <p className={styles['impact-description']}>Keep going! You're doing great this week.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;