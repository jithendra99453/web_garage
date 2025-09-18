import React, { useState } from 'react';
import { Zap, CheckCircle, XCircle } from 'lucide-react';

const EcoEnergyQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = [
    {
      question: "What is the most energy-efficient way to heat water?",
      options: ["Electric kettle", "Gas stove", "Solar water heater", "Microwave"],
      correct: 2,
      explanation: "Solar water heaters use renewable energy from the sun, making them the most energy-efficient option."
    },
    {
      question: "Which appliance consumes the most electricity in a typical home?",
      options: ["Refrigerator", "Air conditioner", "Water heater", "Television"],
      correct: 2,
      explanation: "Water heaters typically consume the most electricity, accounting for about 18% of home energy use."
    },
    {
      question: "What does LED stand for in LED light bulbs?",
      options: ["Light Emitting Diode", "Low Energy Device", "Long Electric Duration", "Light Energy Distributor"],
      correct: 0,
      explanation: "LED stands for Light Emitting Diode. LED bulbs use 75% less energy than traditional incandescent bulbs."
    },
    {
      question: "Which renewable energy source is most commonly used for electricity generation?",
      options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
      correct: 2,
      explanation: "Hydroelectric power is currently the most widely used renewable energy source for electricity generation worldwide."
    },
    {
      question: "What is the best time to run energy-intensive appliances to save electricity?",
      options: ["Morning peak hours", "Afternoon peak hours", "Evening peak hours", "Off-peak hours (late night/early morning)"],
      correct: 3,
      explanation: "Running appliances during off-peak hours reduces strain on the power grid and can lower electricity costs."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! You're an energy expert! ⚡";
    if (percentage >= 60) return "Great job! You know your energy facts! 💡";
    if (percentage >= 40) return "Good effort! Keep learning about energy! 📚";
    return "Keep studying! Energy conservation is important! 🌱";
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md w-full">
          <Zap className="mx-auto text-yellow-500 mb-4" size={48} />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
          <div className="text-5xl font-bold text-yellow-600 mb-2">{score}/{questions.length}</div>
          <p className="text-lg text-gray-600 mb-6">{getScoreMessage()}</p>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">💡 Energy Saving Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Unplug electronics when not in use</li>
              <li>• Use LED bulbs instead of incandescent</li>
              <li>• Wash clothes in cold water</li>
              <li>• Air dry clothes instead of using dryer</li>
              <li>• Use a programmable thermostat</li>
            </ul>
          </div>

          <button
            onClick={resetQuiz}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-800 mb-2">⚡ Eco Energy Quiz</h1>
          <p className="text-lg text-gray-600">Test your knowledge about energy conservation!</p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="font-bold text-yellow-600">{score}</span>
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
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === null
                      ? 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
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

export default EcoEnergyQuiz;
