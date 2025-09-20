import React, { useState, useEffect, useContext } from 'react';
import styles from './EcoSustainabilityTrivia.module.css';
import { CheckCircle, XCircle, RotateCcw, Leaf } from 'lucide-react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';

const EcoSustainabilityTrivia = () => {
  // 1. CONNECT to the context
  const { refreshStudentData } = useContext(UserContext);
  
  // 2. MANAGE game state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      question: "What percentage of the world's freshwater is used for agriculture?",
      options: ["30%", "50%", "70%", "90%"],
      correct: 2,
      explanation: "About 70% of the world's freshwater is used for agriculture, making efficient water use in farming crucial for sustainability."
    },
    {
      question: "Which of these is NOT a greenhouse gas?",
      options: ["Carbon Dioxide", "Methane", "Oxygen", "Nitrous Oxide"],
      correct: 2,
      explanation: "Oxygen is not a greenhouse gas. Greenhouse gases trap heat in the atmosphere and include CO₂, methane, and nitrous oxide."
    },
    {
      question: "What is the term for the variety of life on Earth?",
      options: ["Ecosystem", "Biodiversity", "Habitat", "Biosphere"],
      correct: 1,
      explanation: "Biodiversity refers to the variety of life on Earth, including different species, ecosystems, and genetic diversity."
    },
    {
      question: "Which renewable energy source provides the most electricity globally?",
      options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
      correct: 2,
      explanation: "Hydroelectric power currently provides the most renewable electricity worldwide, followed by wind and solar."
    },
    {
      question: "What is 'carbon footprint'?",
      options: ["Size of a person's feet", "Amount of carbon dioxide emissions caused by an individual", "Carbon stored in soil", "Carbon content in food"],
      correct: 1,
      explanation: "A carbon footprint measures the total greenhouse gas emissions caused by an individual, organization, or product."
    },
    {
      question: "Which ocean is the largest plastic pollution sink?",
      options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
      correct: 2,
      explanation: "The Pacific Ocean contains the Great Pacific Garbage Patch, the largest accumulation of ocean plastic."
    },
    {
      question: "What does 'sustainable development' aim to achieve?",
      options: ["Economic growth only", "Environmental protection only", "Meeting present needs without compromising future generations", "Technological advancement only"],
      correct: 2,
      explanation: "Sustainable development meets current needs without compromising future generations' ability to meet theirs."
    },
    {
      question: "Which country produces the most solar energy?",
      options: ["United States", "Germany", "China", "Japan"],
      correct: 2,
      explanation: "China is the world's largest producer of solar energy, with extensive solar panel manufacturing and installation."
    }
  ];

  // 3. SAVE score when the quiz is complete
  useEffect(() => {
    const saveFinalScore = async () => {
      if (showResult && score > 0) {
        const points = score * 10; // 10 points per correct answer
        await awardPoints(points);
        refreshStudentData();
      }
    };
    saveFinalScore();
  }, [showResult, score, refreshStudentData]);

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const isCorrect = answerIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([...answers, { question: currentQuestion, answer: answerIndex, correct: isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setShowResult(true);
      }
    }, 2500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Outstanding! You're a sustainability expert!";
    if (percentage >= 60) return "Great job! You have strong environmental knowledge!";
    if (percentage >= 40) return "Good effort! Keep learning about sustainability!";
    return "Keep studying! Sustainability knowledge is power!";
  };

  if (showResult) {
    return (
      <div className={styles.container}>
        <div className={styles.resultCard}>
          <div className={styles.resultIcon}>
            <Leaf size={48} />
          </div>
          <h2 className={styles.resultTitle}>Quiz Complete!</h2>
          <div className={styles.finalScore}>{score}/{questions.length}</div>
          <p className={styles.scoreMessage}>{getScoreMessage()}</p>
          <div className={styles.pointsEarned}>
            You earned {score * 10} eco points!
          </div>
          
          <div className={styles.performanceSection}>
            <h3 className={styles.performanceTitle}>Your Performance</h3>
            <div className={styles.performanceGrid}>
              {answers.map((answer, index) => (
                <div key={index} className={styles.performanceItem}>
                  <span className={styles.questionNumber}>Q{index + 1}</span>
                  <span className={`${styles.answerResult} ${
                    answer.correct ? styles.correct : styles.incorrect
                  }`}>
                    {answer.correct ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.tipsSection}>
            <h3 className={styles.tipsTitle}>Sustainability Tips:</h3>
            <ul className={styles.tipsList}>
              <li>Reduce, reuse, and recycle to minimize waste</li>
              <li>Choose renewable energy sources when possible</li>
              <li>Conserve water in daily activities</li>
              <li>Support sustainable agriculture and local food</li>
              <li>Use public transportation or biking</li>
              <li>Plant trees and support reforestation efforts</li>
            </ul>
          </div>
          
          <button onClick={resetQuiz} className={styles.playAgainButton}>
            <RotateCcw size={20} />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Eco Sustainability Trivia</h1>
        <div className={styles.titleIcon}>
          <Leaf size={32} />
        </div>
        <p className={styles.subtitle}>Test your knowledge of environmental sustainability!</p>
        
        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{score}</span>
            <span className={styles.statLabel}>Correct</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{currentQuestion + 1}</span>
            <span className={styles.statLabel}>of {questions.length}</span>
          </div>
        </div>
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <h2 className={styles.questionTitle}>
            Question {currentQuestion + 1}
          </h2>
          <p className={styles.questionText}>
            {questions[currentQuestion].question}
          </p>
        </div>

        <div className={styles.optionsGrid}>
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`${styles.option} ${
                selectedAnswer === null
                  ? styles.optionHover
                  : selectedAnswer === index
                    ? index === questions[currentQuestion].correct
                      ? styles.optionCorrect
                      : styles.optionIncorrect
                    : index === questions[currentQuestion].correct && showExplanation
                      ? styles.optionCorrect
                      : styles.optionDefault
              }`}
            >
              <span className={styles.optionText}>{option}</span>
              {selectedAnswer !== null && (
                <div className={styles.optionIcon}>
                  {index === questions[currentQuestion].correct ? (
                    <CheckCircle size={24} />
                  ) : selectedAnswer === index ? (
                    <XCircle size={24} />
                  ) : null}
                </div>
              )}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className={styles.explanation}>
            <strong>Explanation:</strong> {questions[currentQuestion].explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoSustainabilityTrivia;