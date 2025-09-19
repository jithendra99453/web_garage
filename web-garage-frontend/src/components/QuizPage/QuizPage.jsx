import React, { useState, useEffect } from 'react';
import { Clock, Leaf, Award, ChevronRight, RotateCcw } from 'lucide-react';
import axios from 'axios';

const EcoQuiz = () => {
  // Quiz state management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);
  const [hasLeveledUp, setHasLeveledUp] = useState(false);

  // Styles object
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f3ff 100%)',
      padding: '1rem'
    },
    maxWidth: {
      maxWidth: '64rem',
      margin: '0 auto'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center'
    },
    spinner: {
      width: '3rem',
      height: '3rem',
      border: '2px solid transparent',
      borderBottom: '2px solid #16a34a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem'
    },
    loadingText: {
      color: '#15803d',
      fontWeight: '500'
    },
    header: {
      marginBottom: '1.5rem'
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    leafIcon: {
      width: '1.5rem',
      height: '1.5rem',
      color: '#16a34a'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#15803d',
      margin: '0'
    },
    statsSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    pointsBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: '#fef3c7',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px'
    },
    timerBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backgroundColor: '#fee2e2',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px'
    },
    badgeIcon: {
      width: '1rem',
      height: '1rem'
    },
    badgeText: {
      fontWeight: '500'
    },
    progressContainer: {
      width: '100%',
      backgroundColor: '#e5e7eb',
      borderRadius: '9999px',
      height: '0.75rem'
    },
    progressBar: {
      background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
      height: '100%',
      borderRadius: '9999px',
      transition: 'width 0.3s ease-in-out'
    },
    progressText: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '0.5rem'
    },
    questionCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      marginBottom: '1.5rem'
    },
    questionText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1rem'
    },
    optionButton: {
      width: '100%',
      padding: '1rem',
      textAlign: 'left',
      borderRadius: '0.75rem',
      border: '2px solid #d1d5db',
      transition: 'all 0.2s ease-in-out',
      fontWeight: '500',
      background: '#f9fafb',
      color: '#374751',
      cursor: 'pointer'
    },
    selectedOption: {
      background: '#dbeafe',
      borderColor: '#3b82f6',
      color: '#1e40af'
    },
    correctOption: {
      background: '#d1fae5',
      borderColor: '#10b981',
      color: '#065f46'
    },
    incorrectOption: {
      background: '#fee2e2',
      borderColor: '#ef4444',
      color: '#991b1b'
    },
    disabledOption: {
      background: '#f3f4f6',
      borderColor: '#d1d5db',
      color: '#6b7280',
      cursor: 'not-allowed'
    },
    optionContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    optionLetter: {
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '50%',
      backgroundColor: 'currentColor',
      opacity: '0.2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    },
    feedbackCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    feedbackHeader: {
      textAlign: 'center',
      marginBottom: '1rem'
    },
    feedbackTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    pointsEarned: {
      color: '#16a34a',
      fontWeight: '500',
      margin: '0'
    },
    explanationBox: {
      background: '#eff6ff',
      borderLeft: '4px solid #3b82f6',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem'
    },
    explanationTitle: {
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '0.25rem'
    },
    explanationText: {
      color: '#1d4ed8',
      margin: '0'
    },
    nextButtonContainer: {
      textAlign: 'center'
    },
    nextButton: {
      background: '#16a34a',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.75rem',
      fontWeight: '500',
      transition: 'background-color 0.2s ease-in-out',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    buttonIcon: {
      width: '1.25rem',
      height: '1.25rem'
    },
    resultsCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      textAlign: 'center',
      maxWidth: '42rem',
      margin: '0 auto'
    },
    resultsHeader: {
      marginBottom: '1.5rem'
    },
    awardIcon: {
      width: '4rem',
      height: '4rem',
      color: '#eab308',
      margin: '0 auto 1rem'
    },
    resultsTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#15803d',
      marginBottom: '0.5rem'
    },
    levelUpBanner: {
      background: '#fef3c7',
      border: '2px solid #fbbf24',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem'
    },
    levelUpText: {
      color: '#92400e',
      fontWeight: 'bold',
      fontSize: '1.125rem',
      margin: '0'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      borderRadius: '0.75rem',
      padding: '1.5rem'
    },
    statCardGreen: {
      background: '#dcfce7'
    },
    statCardBlue: {
      background: '#dbeafe'
    },
    statCardPurple: {
      background: '#f3e8ff'
    },
    statIcon: {
      width: '2rem',
      height: '2rem',
      margin: '0 auto 0.5rem'
    },
    levelIcon: {
      width: '2rem',
      height: '2rem',
      background: '#7c3aed',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 0.5rem'
    },
    levelNumber: {
      color: 'white',
      fontWeight: 'bold'
    },
    statLabel: {
      fontWeight: '600',
      marginBottom: '0.25rem'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: '0'
    },
    finalMessage: {
      marginBottom: '1.5rem'
    },
    performanceMessage: {
      fontSize: '1.125rem',
      marginBottom: '0.5rem'
    },
    summaryText: {
      color: '#6b7280',
      margin: '0'
    },
    restartButton: {
      background: '#16a34a',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.75rem',
      fontWeight: '500',
      transition: 'background-color 0.2s ease-in-out',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  };

  // Add CSS animation keyframes
  const spinnerKeyframes = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  // Fallback quiz data
  const fallbackQuestions = [
    {
      question: "What percentage of the Earth's water is freshwater?",
      options: ["97%", "71%", "3%", "25%"],
      correctAnswer: 2,
      explanation: "Only about 3% of Earth's water is freshwater, and most of that is frozen in ice caps and glaciers!"
    },
    // Add more fallback questions if needed
  ];

  // API call to Gemini
  // In EcoQuiz.jsx

const fetchQuizQuestions = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get('http://localhost:5000/api/quiz/generate');

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      
      // --- DATA TRANSFORMATION AND VALIDATION ---
      const transformedQuestions = response.data.map(q => {
        // If the API gives an 'answer' string but no 'correctAnswer' index, create it.
        if (q.answer && typeof q.correctAnswer === 'undefined') {
          const correctIndex = q.options.findIndex(opt => opt === q.answer);
          return {
            ...q,
            correctAnswer: correctIndex,
            // Ensure an explanation field exists, even if it's generic
            explanation: q.explanation || "No explanation provided." 
          };
        }
        // Ensure explanation exists on all questions
        return { ...q, explanation: q.explanation || "No explanation provided." };
      });

      setQuestions(transformedQuestions);

    } else {
      console.error('API did not return valid questions, using fallback data.');
      setQuestions(fallbackQuestions);
    }
  } catch (error) {
    console.error('API call failed, using fallback data:', error);
    setQuestions(fallbackQuestions);
  } finally {
    setIsLoading(false);
  }
};


  // Timer effect
  useEffect(() => {
    if (!isLoading && !showFeedback && !isQuizComplete && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleTimeUp();
    }
  }, [timeLeft, showFeedback, isLoading, isQuizComplete]);

  // Initialize quiz
  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  // Level calculation
  const calculateLevel = (points) => {
    return Math.floor(points / 50) + 1;
  };

  const handleTimeUp = () => {
    setShowFeedback(true);
    setTimeout(() => {
      moveToNext();
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      const newPoints = ecoPoints + 10;
      setEcoPoints(newPoints);
      
      const newLevel = calculateLevel(newPoints);
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        setHasLeveledUp(true);
      }
    }
    
    setShowFeedback(true);
  };

  const moveToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(20);
    } else {
      setIsQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setEcoPoints(0);
    setTimeLeft(20);
    setIsQuizComplete(false);
    setHasLeveledUp(false);
    fetchQuizQuestions();
  };

  // Get button style based on state
  const getOptionButtonStyle = (index) => {
    let buttonStyle = { ...styles.optionButton };
    
    if (showFeedback) {
      if (index === questions[currentQuestionIndex].correctAnswer) {
        buttonStyle = { ...buttonStyle, ...styles.correctOption };
      } else if (selectedAnswer === index) {
        buttonStyle = { ...buttonStyle, ...styles.incorrectOption };
      } else {
        buttonStyle = { ...buttonStyle, ...styles.disabledOption };
      }
    } else if (selectedAnswer === index) {
      buttonStyle = { ...buttonStyle, ...styles.selectedOption };
    }
    
    return buttonStyle;
  };

  if (isLoading) {
    return (
      <>
        <style>{spinnerKeyframes}</style>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading your eco-quiz...</p>
          </div>
        </div>
      </>
    );
  }

  if (!questions || questions.length === 0) {
    return (
        <div style={styles.container}>
            <div style={styles.loadingContainer}>
                <p style={styles.loadingText}>Could not load quiz questions. Please try again later.</p>
            </div>
        </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.resultsCard}>
            <div style={styles.resultsHeader}>
              <Award style={styles.awardIcon} />
              <h1 style={styles.resultsTitle}>Quiz Complete! 🎉</h1>
              {hasLeveledUp && (
                <div style={styles.levelUpBanner}>
                  <p style={styles.levelUpText}>🎉 You leveled up to Level {userLevel}!</p>
                </div>
              )}
            </div>
            
            <div style={{...styles.statsGrid, gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr'}}>
              <div style={{...styles.statCard, ...styles.statCardGreen}}>
                <Leaf style={{...styles.statIcon, color: '#16a34a'}} />
                <h3 style={{...styles.statLabel, color: '#15803d'}}>Eco Points</h3>
                <p style={{...styles.statValue, color: '#16a34a'}}>{ecoPoints}</p>
              </div>
              
              <div style={{...styles.statCard, ...styles.statCardBlue}}>
                <Award style={{...styles.statIcon, color: '#2563eb'}} />
                <h3 style={{...styles.statLabel, color: '#1e40af'}}>Score</h3>
                <p style={{...styles.statValue, color: '#2563eb'}}>{score}/{questions.length}</p>
              </div>
              
              <div style={{...styles.statCard, ...styles.statCardPurple}}>
                <div style={styles.levelIcon}>
                  <span style={styles.levelNumber}>{userLevel}</span>
                </div>
                <h3 style={{...styles.statLabel, color: '#7c2d12'}}>Level</h3>
                <p style={{...styles.statValue, color: '#7c3aed'}}>{userLevel}</p>
              </div>
            </div>
            
            <div style={styles.finalMessage}>
              <div style={styles.performanceMessage}>
                {score === questions.length ? "Perfect! 🌟" : 
                 score >= questions.length * 0.8 ? "Excellent work! 🌱" :
                 score >= questions.length * 0.6 ? "Good job! 🌿" : 
                 "Keep learning! 🌾"}
              </div>
              <p style={styles.summaryText}>
                You got {score} out of {questions.length} questions correct and earned {ecoPoints} eco-points!
              </p>
            </div>
            
            <button
              onClick={restartQuiz}
              style={styles.restartButton}
              onMouseOver={(e) => e.target.style.background = '#15803d'}
              onMouseOut={(e) => e.target.style.background = '#16a34a'}
            >
              <RotateCcw style={styles.buttonIcon} />
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header with progress */}
        <div style={styles.header}>
          <div style={{...styles.headerTop, flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: window.innerWidth < 768 ? '1rem' : '0'}}>
            <div style={styles.titleSection}>
              <Leaf style={styles.leafIcon} />
              <h1 style={styles.title}>Eco Quiz</h1>
            </div>
            <div style={styles.statsSection}>
              <div style={styles.pointsBadge}>
                <Award style={{...styles.badgeIcon, color: '#d97706'}} />
                <span style={{...styles.badgeText, color: '#92400e'}}>{ecoPoints} points</span>
              </div>
              <div style={styles.timerBadge}>
                <Clock style={{...styles.badgeIcon, color: '#dc2626'}} />
                <span style={{...styles.badgeText, color: '#991b1b'}}>{timeLeft}s</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div style={styles.progressContainer}>
            <div 
              style={{...styles.progressBar, width: `${progress}%`}}
            ></div>
          </div>
          <p style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question card */}
        <div style={styles.questionCard}>
          <h2 style={styles.questionText}>
            {currentQuestion.question}
          </h2>
          
          <div style={{...styles.optionsGrid, gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr'}}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                style={getOptionButtonStyle(index)}
                onMouseOver={(e) => {
                  if (!showFeedback && selectedAnswer !== index) {
                    e.target.style.background = '#eff6ff';
                    e.target.style.borderColor = '#93c5fd';
                  }
                }}
                onMouseOut={(e) => {
                  if (!showFeedback && selectedAnswer !== index) {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#d1d5db';
                  }
                }}
              >
                <span style={styles.optionContent}>
                  <span style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback section */}
        {showFeedback && (
          <div style={styles.feedbackCard}>
            <div style={{...styles.feedbackHeader, color: selectedAnswer === currentQuestion.correctAnswer ? '#15803d' : '#dc2626'}}>
              <h3 style={styles.feedbackTitle}>
                {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect!'}
              </h3>
              {selectedAnswer === currentQuestion.correctAnswer && (
                <p style={styles.pointsEarned}>+10 Eco Points!</p>
              )}
            </div>
            
            <div style={styles.explanationBox}>
              <h4 style={styles.explanationTitle}>Did you know?</h4>
              <p style={styles.explanationText}>{currentQuestion.explanation}</p>
            </div>
            
            <div style={styles.nextButtonContainer}>
              <button
                onClick={moveToNext}
                style={styles.nextButton}
                onMouseOver={(e) => e.target.style.background = '#15803d'}
                onMouseOut={(e) => e.target.style.background = '#16a34a'}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                <ChevronRight style={styles.buttonIcon} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoQuiz;
