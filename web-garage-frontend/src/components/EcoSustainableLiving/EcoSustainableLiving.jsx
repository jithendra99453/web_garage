import React, { useState, useEffect, useContext } from 'react';
import { Home, RotateCcw, Trophy, Leaf } from 'lucide-react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';

const EcoSustainableLiving = () => {
  const { refreshStudentData } = useContext(UserContext);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);

  const challenges = [
    {
      category: "Energy",
      title: "Smart Home Upgrade",
      description: "Install LED bulbs and a programmable thermostat",
      options: [
        "Replace all incandescent bulbs with LEDs and install smart thermostat",
        "Keep using old bulbs and manual thermostat",
        "Replace only some bulbs"
      ],
      correct: 0,
      impact: "Reduces home energy use by 30%",
      points: 25,
      timeBonus: 10
    },
    {
      category: "Water",
      title: "Water Conservation",
      description: "Fix leaky faucets and install low-flow showerheads",
      options: [
        "Fix all leaks and install water-efficient fixtures",
        "Fix only major leaks",
        "Ignore the leaks for now"
      ],
      correct: 0,
      impact: "Saves 10,000 gallons of water per year",
      points: 20,
      timeBonus: 8
    },
    {
      category: "Waste",
      title: "Zero Waste Kitchen",
      description: "Set up composting and eliminate disposable items",
      options: [
        "Start composting and use reusable containers",
        "Compost only food waste",
        "Continue using disposables"
      ],
      correct: 0,
      impact: "Reduces landfill waste by 40%",
      points: 30,
      timeBonus: 12
    },
    {
      category: "Transportation",
      title: "Green Commute",
      description: "Choose transportation method for daily commute",
      options: [
        "Bike or walk when possible, use public transport",
        "Carpool with others",
        "Drive alone in car"
      ],
      correct: 0,
      impact: "Reduces carbon emissions by 50%",
      points: 35,
      timeBonus: 15
    },
    {
      category: "Food",
      title: "Sustainable Eating",
      description: "Plan meals to reduce food waste and choose local foods",
      options: [
        "Plan meals, buy local, and use leftovers creatively",
        "Buy local but waste some food",
        "Shop without planning"
      ],
      correct: 0,
      impact: "Reduces food waste by 60%",
      points: 25,
      timeBonus: 10
    },
    {
      category: "Shopping",
      title: "Conscious Consumer",
      description: "Research products and choose sustainable options",
      options: [
        "Check company practices and buy durable, repairable items",
        "Buy on sale without research",
        "Buy cheapest option available"
      ],
      correct: 0,
      impact: "Supports ethical companies and reduces waste",
      points: 20,
      timeBonus: 8
    },
    {
      category: "Home",
      title: "Green Garden",
      description: "Create a sustainable garden space",
      options: [
        "Plant native species and use natural pest control",
        "Plant whatever looks nice",
        "Use chemical pesticides and fertilizers"
      ],
      correct: 0,
      impact: "Creates wildlife habitat and reduces chemical use",
      points: 30,
      timeBonus: 12
    },
    {
      category: "Community",
      title: "Neighborhood Action",
      description: "Organize community environmental initiative",
      options: [
        "Start a community garden or clean-up group",
        "Talk about environmental issues",
        "Do nothing"
      ],
      correct: 0,
      impact: "Inspires others and creates lasting change",
      points: 40,
      timeBonus: 20
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleChoice(-1); // Time out
    }
  }, [timeLeft, gameOver]);

  const handleChoice = (choiceIndex) => {
    const challenge = challenges[currentChallenge];
    const isCorrect = choiceIndex === challenge.correct;

    if (isCorrect) {
      const timeBonus = Math.max(0, timeLeft * challenge.timeBonus / 45);
      const streakBonus = streak * 5;
      const points = challenge.points + Math.round(timeBonus) + streakBonus;

      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCompletedChallenges(prev => [...prev, {
        ...challenge,
        choice: choiceIndex,
        points: points
      }]);
    } else {
      setStreak(0);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          return 0;
        }
        return newLives;
      });
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1 && lives > 0) {
        nextChallenge();
      } else {
        setGameOver(true);
      }
    }, 3000);
  };

  const nextChallenge = () => {
    setCurrentChallenge(prev => prev + 1);
    setTimeLeft(45);
  };

  const resetGame = () => {
    setCurrentChallenge(0);
    setScore(0);
    setTimeLeft(45);
    setGameOver(false);
    setCompletedChallenges([]);
    setStreak(0);
    setLives(3);
  };

  // Award eco points and refresh dashboard when game is over
  useEffect(() => {
    if (gameOver && score > 0) {
      awardPoints(score).then(() => {
        refreshStudentData();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  const getScoreRating = () => {
    const correctAnswers = completedChallenges.length;
    const percentage = (correctAnswers / challenges.length) * 100;

    if (percentage >= 90) return { rating: "Sustainability Champion", color: "text-green-600", emoji: "🌟" };
    if (percentage >= 75) return { rating: "Eco Leader", color: "text-blue-600", emoji: "⭐" };
    if (percentage >= 60) return { rating: "Conscious Citizen", color: "text-yellow-600", emoji: "🌱" };
    if (percentage >= 40) return { rating: "Getting Started", color: "text-orange-600", emoji: "📈" };
    return { rating: "Keep Learning", color: "text-red-600", emoji: "🌱" };
  };

  if (gameOver) {
    const scoreRating = getScoreRating();
    const challengesCompleted = completedChallenges.length;
    const totalPossibleScore = challenges.slice(0, challengesCompleted).reduce((sum, c) => sum + c.points, 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">{scoreRating.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {lives > 0 ? 'Sustainable Living Complete!' : 'Challenge Ended!'}
          </h2>
          <div className="text-4xl font-bold text-green-600 mb-2">{score} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            Rating: <span className={`font-bold ${scoreRating.color}`}>{scoreRating.rating}</span>
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{challengesCompleted}</div>
              <div className="text-sm text-gray-600">Challenges Completed</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{streak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{lives}</div>
              <div className="text-sm text-gray-600">Lives Remaining</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{Math.round((score / totalPossibleScore) * 100)}%</div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">🏠 Sustainable Living Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Small daily changes add up to big environmental impact</li>
              <li>• Focus on one area at a time to avoid feeling overwhelmed</li>
              <li>• Involve family and friends to create positive change together</li>
              <li>• Track your progress and celebrate sustainable achievements</li>
              <li>• Stay informed about local environmental issues and solutions</li>
              <li>• Remember that every sustainable choice makes a difference</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const challenge = challenges[currentChallenge];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🏠 Eco Sustainable Living</h1>
          <p className="text-lg text-gray-600">Make sustainable choices for everyday living challenges!</p>

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

        {/* Challenge Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">
              Challenge {currentChallenge + 1} of {challenges.length}
            </div>
            <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {challenge.category}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {challenge.title}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {challenge.description}
            </p>
          </div>

          {/* Choice Options */}
          <div className="space-y-4 mb-6">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  index === challenge.correct
                    ? 'border-green-300 hover:border-green-500 hover:bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-800">{option}</span>
                    {index === challenge.correct && (
                      <span className="ml-2 text-green-600 font-bold">(Recommended)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {index === challenge.correct ? `+${challenge.points} pts` : ''}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Challenge Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-800">Environmental Impact:</span>
              <span className="text-sm text-blue-600">{challenge.impact}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-800">Points Value:</span>
              <span className="text-sm text-blue-600">{challenge.points} + time bonus</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{currentChallenge + 1} / {challenges.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${((currentChallenge + 1) / challenges.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Game Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 How to Play:</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Choose the most sustainable option for each challenge</div>
              <div>• Answer quickly for time bonuses</div>
              <div>• Build streaks for extra points</div>
              <div>• You have 3 lives - don't lose them all!</div>
              <div>• Complete all challenges to win</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Scoring:</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Correct choice: Base points + time bonus</div>
              <div>• Time bonus: Up to {challenges[currentChallenge]?.timeBonus} extra points</div>
              <div>• Streak bonus: 5 points per consecutive correct answer</div>
              <div>• Wrong choice: Lose 1 life</div>
              <div>• Lives remaining: Bonus at game end</div>
            </div>
          </div>
        </div>

        {/* Completed Challenges Summary */}
        {completedChallenges.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">✅ Completed Challenges:</h3>
            <div className="space-y-2">
              {completedChallenges.map((comp, index) => (
                <div key={index} className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium text-green-800">{comp.title}</span>
                    <span className="text-sm text-gray-600 ml-2">({comp.category})</span>
                  </div>
                  <span className="font-bold text-green-600">+{comp.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoSustainableLiving;
