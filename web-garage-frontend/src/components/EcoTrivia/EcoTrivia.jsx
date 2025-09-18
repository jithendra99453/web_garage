import React, { useState, useEffect } from 'react';
import { Leaf, Award, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const EcoTrivia = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const triviaQuestions = [
    {
      question: "What is the main greenhouse gas responsible for climate change?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correct: 1,
      explanation: "Carbon dioxide (CO2) is the primary greenhouse gas emitted through human activities like burning fossil fuels."
    },
    {
      question: "Which of these is NOT a renewable energy source?",
      options: ["Solar", "Wind", "Coal", "Hydroelectric"],
      correct: 2,
      explanation: "Coal is a fossil fuel and non-renewable, while solar, wind, and hydroelectric are renewable sources."
    },
    {
      question: "What percentage of Earth's water is freshwater?",
      options: ["97%", "71%", "3%", "25%"],
      correct: 2,
      explanation: "Only about 3% of Earth's water is freshwater, and most of that is frozen in ice caps and glaciers."
    },
    {
      question: "Which animal is considered a keystone species in many ecosystems?",
      options: ["Panda", "Wolf", "Elephant", "Lion"],
      correct: 1,
      explanation: "Wolves are keystone species that help maintain balance in ecosystems by controlling prey populations."
    },
    {
      question: "What is the term for the variety of life on Earth?",
      options: ["Ecosystem", "Biodiversity", "Habitat", "Population"],
      correct: 1,
      explanation: "Biodiversity refers to the variety of life forms on Earth, including genetic, species, and ecosystem diversity."
    },
    {
      question: "Which ocean is the largest?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3,
      explanation: "The Pacific Ocean is the largest ocean on Earth, covering about one-third of the planet's surface."
    }
  ];

  useEffect(() => {
    setQuestions(triviaQuestions);
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === questions[currentQuestionIndex].correct) {
      setScore(prev => prev + 10);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f3ff 100%)', padding: '1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', textAlign: 'center' }}>
            <Award style={{ width: '4rem', height: '4rem', color: '#eab308', margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '1rem' }}>
              Trivia Complete! 🎉
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              You scored {score} out of {questions.length * 10} points!
            </p>
            <button
              onClick={restartGame}
              style={{
                background: '#16a34a',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RotateCcw style={{ width: '1.25rem', height: '1.25rem' }} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f3ff 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
            ❓ Eco Trivia
          </h1>
          <p style={{ color: '#6b7280' }}>Test your environmental knowledge!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <Award style={{ display: 'inline', width: '1rem', height: '1rem', color: '#16a34a' }} />
              <span style={{ marginLeft: '0.5rem', fontWeight: '500', color: '#15803d' }}>{score} points</span>
            </div>
            <div style={{ background: '#dbeafe', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <span style={{ fontWeight: '500', color: '#1e40af' }}>{currentQuestionIndex + 1}/{questions.length}</span>
            </div>
          </div>
          <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '0.75rem', marginTop: '1rem' }}>
            <div style={{ background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)', height: '100%', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.3s' }}></div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
            {currentQuestion?.question}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  borderRadius: '0.5rem',
                  border: '2px solid #d1d5db',
                  background: showResult
                    ? index === currentQuestion.correct
                      ? '#dcfce7'
                      : index === selectedAnswer
                        ? '#fee2e2'
                        : '#f9fafb'
                    : selectedAnswer === index
                      ? '#dbeafe'
                      : '#f9fafb',
                  color: showResult
                    ? index === currentQuestion.correct
                      ? '#15803d'
                      : index === selectedAnswer
                        ? '#dc2626'
                        : '#374151'
                    : selectedAnswer === index
                      ? '#1e40af'
                      : '#374151',
                  cursor: showResult ? 'default' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    background: 'currentColor',
                    opacity: '0.2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                  {showResult && index === currentQuestion.correct && (
                    <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                    <XCircle style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showResult && (
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '1rem', borderRadius: '0.5rem' }}>
              <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem' }}>Did you know?</h3>
              <p style={{ color: '#1d4ed8', margin: '0' }}>{currentQuestion.explanation}</p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={nextQuestion}
                style={{
                  background: '#16a34a',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoTrivia;
