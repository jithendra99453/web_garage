import React, { useState, useEffect } from 'react';
import { Leaf, RotateCcw, Trophy, CheckCircle, XCircle } from 'lucide-react';

const EcoBiodiversityQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);

  const questions = [
    {
      question: "What is biodiversity?",
      options: [
        "The variety of life in a particular habitat or ecosystem",
        "The process of plants making food",
        "The movement of animals from one place to another",
        "The study of rocks and minerals"
      ],
      correct: 0,
      explanation: "Biodiversity refers to the variety of life forms in a particular habitat or ecosystem, including plants, animals, and microorganisms."
    },
    {
      question: "Which of these is NOT a major cause of biodiversity loss?",
      options: [
        "Habitat destruction",
        "Climate change",
        "Overexploitation",
        "Photosynthesis"
      ],
      correct: 3,
      explanation: "Photosynthesis is the process by which plants make food, not a cause of biodiversity loss. The main causes are habitat destruction, climate change, overexploitation, pollution, and invasive species."
    },
    {
      question: "What percentage of Earth's species live in tropical rainforests?",
      options: [
        "About 25%",
        "About 50%",
        "About 75%",
        "About 90%"
      ],
      correct: 1,
      explanation: "Approximately 50% of Earth's species live in tropical rainforests, despite these forests covering only about 7% of Earth's land surface."
    },
    {
      question: "Which animal is considered a keystone species in many ecosystems?",
      options: [
        "Honey bee",
        "Gray wolf",
        "Both A and B",
        "Neither A nor B"
      ],
      correct: 2,
      explanation: "Both honey bees (important for pollination) and gray wolves (control prey populations) are keystone species that have major impacts on their ecosystems."
    },
    {
      question: "What is the main threat to coral reefs worldwide?",
      options: [
        "Overfishing",
        "Climate change and ocean warming",
        "Pollution",
        "All of the above"
      ],
      correct: 3,
      explanation: "Coral reefs face multiple threats including overfishing, climate change causing bleaching, pollution, and habitat destruction."
    },
    {
      question: "Which of these is an example of an invasive species?",
      options: [
        "European starling in North America",
        "Kangaroo in Australia",
        "Panda in China",
        "Polar bear in the Arctic"
      ],
      correct: 0,
      explanation: "The European starling was introduced to North America and has become invasive, competing with native birds for resources."
    },
    {
      question: "What is reforestation?",
      options: [
        "Cutting down trees",
        "Planting new trees in deforested areas",
        "Moving trees from one place to another",
        "Studying tree rings"
      ],
      correct: 1,
      explanation: "Reforestation is the process of planting trees in areas where forests have been cut down or destroyed."
    },
    {
      question: "Which ecosystem has the highest biodiversity?",
      options: [
        "Desert",
        "Tundra",
        "Tropical rainforest",
        "Grassland"
      ],
      correct: 2,
      explanation: "Tropical rainforests have the highest biodiversity on Earth, hosting millions of species in complex ecosystems."
    },
    {
      question: "What does 'endemic' mean in biodiversity terms?",
      options: [
        "Found everywhere",
        "Found only in a specific area",
        "Very common",
        "Very rare"
      ],
      correct: 1,
      explanation: "Endemic species are found only in a specific geographic area and nowhere else in the world."
    },
    {
      question: "Which human activity has the largest impact on biodiversity loss?",
      options: [
        "Recycling",
        "Agriculture and land use change",
        "Using renewable energy",
        "Planting gardens"
      ],
      correct: 1,
      explanation: "Agriculture and land use change, including deforestation for farming, is the largest driver of biodiversity loss worldwide."
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1); // Time out
    }
  }, [timeLeft, gameOver, showResult]);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === questions[currentQuestion].correct;

    if (isCorrect) {
      const timeBonus = Math.max(0, timeLeft * 2);
      const streakBonus = streak * 5;
      const points = 10 + timeBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return newLives;
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1 && lives > 1) {
        nextQuestion();
      } else {
        setGameOver(true);
      }
    }, 3000);
  };

  const nextQuestion = () => {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);
    setLives(3);
  };

  const getScoreRating = () => {
    const percentage = (score / (questions.length * 50)) * 100;
    if (percentage >= 90) return { rating: "Biodiversity Expert", color: "text-green-600", emoji: "🌟" };
    if (percentage >= 75) return { rating: "Eco Warrior", color: "text-blue-600", emoji: "⭐" };
    if (percentage >= 60) return { rating: "Nature Lover", color: "text-yellow-600", emoji: "🌱" };
    if (percentage >= 40) return { rating: "Learning", color: "text-orange-600", emoji: "📚" };
    return { rating: "Keep Trying", color: "text-red-600", emoji: "🌱" };
  };

  if (gameOver) {
    const scoreRating = getScoreRating();
    const questionsAnswered = currentQuestion + (selectedAnswer !== null ? 1 : 0);
    const accuracy = questionsAnswered > 0 ? Math.round((score / (questionsAnswered * 10)) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">{scoreRating.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {lives > 0 ? 'Quiz Complete!' : 'Game Over!'}
          </h2>
          <div className="text-4xl font-bold text-green-600 mb-2">{score} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            Rating: <span className={`font-bold ${scoreRating.color}`}>{scoreRating.rating}</span>
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{questionsAnswered}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{streak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{lives}</div>
              <div className="text-sm text-gray-600">Lives Left</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">🦋 Biodiversity Conservation Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Support protected areas and national parks</li>
              <li>• Reduce habitat destruction by supporting sustainable agriculture</li>
              <li>• Plant native species in your garden to support local wildlife</li>
              <li>• Reduce pollution and plastic use to protect aquatic ecosystems</li>
              <li>• Support organizations working on conservation and research</li>
              <li>• Learn about and respect endangered species in your area</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🦋 Eco Biodiversity Quiz</h1>
          <p className="text-lg text-gray-600">Test your knowledge about Earth's amazing biodiversity!</p>

          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-green-600">{score}</span>
              <span className="text-gray-600 ml-2">Points</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-blue-600">{timeLeft}</span>
              <span className="text-gray-600 ml-2">Seconds</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-purple-600">{streak}</span>
              <span className="text-gray-600 ml-2">Streak</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-red-600">{'❤️'.repeat(lives)}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {question.options.map((option, index) => {
              let buttonClass = "p-4 rounded-lg border-2 transition-all duration-200 text-left ";

              if (showResult) {
                if (index === question.correct) {
                  buttonClass += "border-green-500 bg-green-100 text-green-800";
                } else if (index === selectedAnswer && index !== question.correct) {
                  buttonClass += "border-red-500 bg-red-100 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50";
                }
              } else {
                buttonClass += index === selectedAnswer
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showResult && index === question.correct && (
                      <CheckCircle size={20} className="text-green-600" />
                    )}
                    {showResult && index === selectedAnswer && index !== question.correct && (
                      <XCircle size={20} className="text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Explanation */}
          {showResult && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-2">
                {selectedAnswer === question.correct ? '✅ Correct!' : '❌ Incorrect'}
              </h3>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{currentQuestion + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Biodiversity Facts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🌍 Did You Know?</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• There are over 8.7 million species on Earth</div>
              <div>• 1 million species are currently threatened with extinction</div>
              <div>• Tropical rainforests cover 7% of land but contain 50% of species</div>
              <div>• 75% of genetic diversity has been lost in agricultural crops</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Scoring System</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Correct answer: 10 points</div>
              <div>• Time bonus: up to 60 points</div>
              <div>• Streak bonus: 5 points per consecutive correct answer</div>
              <div>• Wrong answer: lose 1 life</div>
              <div>• 3 lives total - game over when all are lost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoBiodiversityQuiz;
