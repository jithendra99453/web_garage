import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const EcoSustainabilityTrivia = () => {
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
    if (percentage >= 80) return "Outstanding! You're a sustainability expert! 🌟";
    if (percentage >= 60) return "Great job! You have strong environmental knowledge! 👍";
    if (percentage >= 40) return "Good effort! Keep learning about sustainability! 📚";
    return "Keep studying! Sustainability knowledge is power! 🌱";
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
          <div className="text-5xl font-bold text-green-600 mb-2">{score}/{questions.length}</div>
          <p className="text-lg text-gray-600 mb-6">{getScoreMessage()}</p>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-4">📊 Your Performance</h3>
            <div className="space-y-2">
              {answers.map((answer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">Question {index + 1}</span>
                  <span className={`text-sm font-medium ${answer.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {answer.correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">💡 Sustainability Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Reduce, reuse, and recycle to minimize waste</li>
              <li>• Choose renewable energy sources when possible</li>
              <li>• Conserve water in daily activities</li>
              <li>• Support sustainable agriculture and local food</li>
              <li>• Use public transportation or biking</li>
              <li>• Plant trees and support reforestation efforts</li>
            </ul>
          </div>

          <button
            onClick={resetQuiz}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 Eco Sustainability Trivia</h1>
          <p className="text-lg text-gray-600">Test your knowledge of environmental sustainability!</p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="font-bold text-green-600">{score}</span>
              <span className="text-gray-600 ml-2">Correct</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="font-bold text-blue-600">{currentQuestion + 1}</span>
              <span className="text-gray-600 ml-2">of {questions.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {questions[currentQuestion].question}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === null
                      ? 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      : selectedAnswer === index
                        ? index === questions[currentQuestion].correct
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : index === questions[currentQuestion].correct && showExplanation
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{option}</span>
                    {selectedAnswer !== null && (
                      <div>
                        {index === questions[currentQuestion].correct ? (
                          <CheckCircle className="text-green-500" size={24} />
                        ) : selectedAnswer === index ? (
                          <XCircle className="text-red-500" size={24} />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800">
                <strong>Explanation:</strong> {questions[currentQuestion].explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcoSustainabilityTrivia;
