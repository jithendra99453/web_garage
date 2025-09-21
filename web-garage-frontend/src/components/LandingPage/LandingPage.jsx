import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className={styles.featureCard}>
    <span className={styles.featureIcon}>{icon}</span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
console.log('landing page rendering');
// Reusable Footer Component
const Footer = () => (
    <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.footerLinks}>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </div>
      <p className={styles.copyright}>
        &copy; 2025 EcoQuest. All rights reserved.
      </p>
    </div>
  </footer>
);

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <header className={styles.heroSection}>
        <div className={`${styles.container} ${styles.heroContent}`}>
          <h1>EcoLearn</h1>
          <p className={styles.tagline}>Learn. Play. Act. Save the Planet.</p>
          <div className={styles.ctaButtons}>
            {/* UPDATED LINK for students */}
            <Link
              to="/signup/student"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Join as Student
            </Link>
            {/* UPDATED LINK for schools/teachers */}
            <Link
              to="/signup/teacher"
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Join as teacher
            </Link>
            <Link
              to="/signup/school"
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Register your School
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Features Snapshot Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>How You'll Make a Difference</h2>
            <div className={styles.featuresGrid}>
              <FeatureCard
                icon="🎓"
                title="Interactive Quizzes"
                description="Test your eco-knowledge on topics from biodiversity to renewable energy."
              />
              <FeatureCard
                icon="🌱"
                title="Real-World Challenges"
                description="Take on fun, impactful tasks like starting a recycling program or planting a tree."
              />
              <FeatureCard
                icon="🏆"
                title="Climb the Leaderboard"
                description="Compete with friends and schools to see who can make the biggest positive impact."
              />
              <FeatureCard
                icon="🎖️"
                title="Earn Awesome Rewards"
                description="Unlock badges and titles for completing challenges and quizzes."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;