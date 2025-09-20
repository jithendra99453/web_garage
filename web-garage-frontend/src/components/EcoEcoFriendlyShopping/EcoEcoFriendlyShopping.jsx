import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, RotateCcw, Trophy, CheckCircle, XCircle } from 'lucide-react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';

const EcoEcoFriendlyShopping = () => {
  const { refreshStudentData } = useContext(UserContext);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [budget, setBudget] = useState(100);

  const shoppingItems = [
    {
      item: "Reusable Water Bottle",
      ecoChoice: "Stainless steel bottle",
      nonEcoChoice: "Plastic disposable bottles",
      ecoPrice: 25,
      nonEcoPrice: 5,
      explanation: "A reusable bottle saves money and reduces plastic waste over time.",
      impact: "Reduces 500 plastic bottles from landfills per year"
    },
    {
      item: "Shopping Bags",
      ecoChoice: "Canvas tote bags",
      nonEcoChoice: "Plastic bags",
      ecoPrice: 15,
      nonEcoPrice: 0.10,
      explanation: "Canvas bags are durable and can be used hundreds of times.",
      impact: "Prevents 1000+ plastic bags from polluting oceans annually"
    },
    {
      item: "Coffee",
      ecoChoice: "Reusable coffee cup",
      nonEcoChoice: "Disposable paper cups",
      ecoPrice: 20,
      nonEcoPrice: 3,
      explanation: "Reusable cups eliminate daily waste and save money long-term.",
      impact: "Reduces 300 disposable cups from landfills per year"
    },
    {
      item: "Cleaning Supplies",
      ecoChoice: "Natural vinegar and baking soda",
      nonEcoChoice: "Chemical cleaners",
      ecoPrice: 8,
      nonEcoPrice: 12,
      explanation: "Natural alternatives are safer for you and the environment.",
      impact: "Reduces toxic chemical runoff into waterways"
    },
    {
      item: "Food Storage",
      ecoChoice: "Glass containers",
      nonEcoChoice: "Plastic wrap and containers",
      ecoPrice: 30,
      nonEcoPrice: 4,
      explanation: "Glass is durable, reusable, and doesn't leach chemicals into food.",
      impact: "Eliminates microplastic contamination in food"
    },
    {
      item: "Personal Care",
      ecoChoice: "Bar soap in reusable dish",
      nonEcoChoice: "Liquid soap in plastic bottle",
      ecoPrice: 12,
      nonEcoPrice: 8,
      explanation: "Bar soap reduces plastic waste and is often more concentrated.",
      impact: "Reduces plastic bottle waste by 80%"
    },
    {
      item: "Laundry",
      ecoChoice: "Laundry detergent sheets",
      nonEcoChoice: "Liquid detergent in plastic jug",
      ecoPrice: 18,
      nonEcoPrice: 15,
      explanation: "Sheets use less water to produce and eliminate plastic packaging.",
      impact: "Reduces plastic waste and transportation emissions"
    },
    {
      item: "Produce",
      ecoChoice: "Buy in bulk without packaging",
      nonEcoChoice: "Pre-packaged portions",
      ecoPrice: 8,
      nonEcoPrice: 12,
      explanation: "Bulk buying reduces packaging waste significantly.",
      impact: "Cuts plastic packaging waste by up to 70%"
    },
    {
      item: "Electronics",
      ecoChoice: "Repair and upgrade existing device",
      nonEcoChoice: "Buy new device",
      ecoPrice: 50,
      nonEcoPrice: 200,
      explanation: "Repairing extends product life and reduces e-waste.",
      impact: "Prevents toxic e-waste from entering landfills"
    },
    {
      item: "Clothing",
      ecoChoice: "Second-hand or sustainable brand",
      nonEcoChoice: "Fast fashion item",
      ecoPrice: 35,
      nonEcoPrice: 25,
      explanation: "Second-hand reduces textile waste and water usage in production.",
      impact: "Saves 2700 liters of water per garment"
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleChoice(-1); // Time out
    }
  }, [timeLeft, gameOver, showResult]);

  const handleChoice = (choiceIndex) => {
    setSelectedChoice(choiceIndex);
    setShowResult(true);

    const item = shoppingItems[currentItem];
    const isEcoChoice = choiceIndex === 0;
    const choicePrice = isEcoChoice ? item.ecoPrice : item.nonEcoPrice;

    if (budget >= choicePrice) {
      if (isEcoChoice) {
        const timeBonus = Math.max(0, timeLeft * 3);
        const streakBonus = streak * 10;
        const points = 20 + timeBonus + streakBonus;
        setScore(prev => prev + points);
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
        setScore(prev => Math.max(0, prev - 5)); // Penalty for non-eco choice
      }

      setBudget(prev => prev - choicePrice);

      setTimeout(() => {
        if (currentItem < shoppingItems.length - 1) {
          nextItem();
        } else {
          setGameOver(true);
        }
      }, 3000);
    } else {
      // Not enough budget
      setTimeout(() => {
        setShowResult(false);
        setSelectedChoice(null);
      }, 2000);
    }
  };

  const nextItem = () => {
    setCurrentItem(prev => prev + 1);
    setSelectedChoice(null);
    setShowResult(false);
    setTimeLeft(20);
  };

  const resetGame = () => {
    setCurrentItem(0);
    setScore(0);
    setTimeLeft(20);
    setGameOver(false);
    setSelectedChoice(null);
    setShowResult(false);
    setStreak(0);
    setBudget(100);
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
    const ecoChoices = Math.floor(score / 20); // Approximate eco choices made
    const percentage = (ecoChoices / shoppingItems.length) * 100;

    if (percentage >= 90) return { rating: "Eco Shopping Champion", color: "text-green-600", emoji: "🌟" };
    if (percentage >= 75) return { rating: "Sustainable Shopper", color: "text-blue-600", emoji: "⭐" };
    if (percentage >= 60) return { rating: "Conscious Consumer", color: "text-yellow-600", emoji: "🛒" };
    if (percentage >= 40) return { rating: "Getting Better", color: "text-orange-600", emoji: "📈" };
    return { rating: "Keep Learning", color: "text-red-600", emoji: "🌱" };
  };

  if (gameOver) {
    const scoreRating = getScoreRating();
    const itemsCompleted = currentItem + 1;
    const ecoChoices = Math.floor(score / 20);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">{scoreRating.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Shopping Complete!
          </h2>
          <div className="text-4xl font-bold text-green-600 mb-2">{score} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            Rating: <span className={`font-bold ${scoreRating.color}`}>{scoreRating.rating}</span>
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{ecoChoices}</div>
              <div className="text-sm text-gray-600">Eco Choices</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{itemsCompleted}</div>
              <div className="text-sm text-gray-600">Items Shopped</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{streak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">${budget}</div>
              <div className="text-sm text-gray-600">Budget Left</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">🛒 Eco-Shopping Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Choose products with minimal or recyclable packaging</li>
              <li>• Buy in bulk to reduce packaging waste</li>
              <li>• Look for products made from recycled materials</li>
              <li>• Support companies with sustainable practices</li>
              <li>• Repair and reuse items instead of buying new</li>
              <li>• Consider the full lifecycle impact of products</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Shop Again
          </button>
        </div>
      </div>
    );
  }

  const item = shoppingItems[currentItem];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🛒 Eco-Friendly Shopping</h1>
          <p className="text-lg text-gray-600">Make sustainable choices while shopping on a budget!</p>

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
              <span className="text-2xl font-bold text-yellow-600">${budget}</span>
              <span className="text-gray-600 ml-2">Budget</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-purple-600">{streak}</span>
              <span className="text-gray-600 ml-2">Eco Streak</span>
            </div>
          </div>
        </div>

        {/* Shopping Item Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">
              Item {currentItem + 1} of {shoppingItems.length}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🛍️ {item.item}
            </h2>
            <p className="text-lg text-gray-600">
              Choose the more environmentally friendly option:
            </p>
          </div>

          {/* Choice Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Eco Choice */}
            <button
              onClick={() => !showResult && handleChoice(0)}
              disabled={showResult || budget < item.ecoPrice}
              className={`p-6 rounded-lg border-3 transition-all duration-200 text-center ${
                showResult
                  ? selectedChoice === 0
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 bg-gray-50'
                  : budget < item.ecoPrice
                    ? 'border-red-300 bg-red-50 opacity-50 cursor-not-allowed'
                    : 'border-green-300 hover:border-green-500 hover:bg-green-50'
              }`}
            >
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Eco Choice</h3>
              <p className="text-gray-700 mb-3">{item.ecoChoice}</p>
              <div className="text-2xl font-bold text-green-600">${item.ecoPrice}</div>
              {showResult && selectedChoice === 0 && (
                <CheckCircle size={24} className="text-green-600 mx-auto mt-2" />
              )}
            </button>

            {/* Non-Eco Choice */}
            <button
              onClick={() => !showResult && handleChoice(1)}
              disabled={showResult || budget < item.nonEcoPrice}
              className={`p-6 rounded-lg border-3 transition-all duration-200 text-center ${
                showResult
                  ? selectedChoice === 1
                    ? 'border-red-500 bg-red-100'
                    : 'border-gray-200 bg-gray-50'
                  : budget < item.nonEcoPrice
                    ? 'border-red-300 bg-red-50 opacity-50 cursor-not-allowed'
                    : 'border-red-300 hover:border-red-500 hover:bg-red-50'
              }`}
            >
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Less Eco Choice</h3>
              <p className="text-gray-700 mb-3">{item.nonEcoChoice}</p>
              <div className="text-2xl font-bold text-red-600">${item.nonEcoPrice}</div>
              {showResult && selectedChoice === 1 && (
                <XCircle size={24} className="text-red-600 mx-auto mt-2" />
              )}
            </button>
          </div>

          {/* Result Explanation */}
          {showResult && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-2">
                {selectedChoice === 0 ? '🌱 Great Eco Choice!' : '💡 Consider the Impact'}
              </h3>
              <p className="text-gray-700 mb-2">{item.explanation}</p>
              <p className="text-sm text-green-700 font-medium">Environmental Impact: {item.impact}</p>
            </div>
          )}

          {/* Insufficient Budget Message */}
          {selectedChoice !== null && !showResult && budget < (selectedChoice === 0 ? item.ecoPrice : item.nonEcoPrice) && (
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-red-700 font-medium">Not enough budget for this choice!</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Shopping Progress</span>
            <span>{currentItem + 1} / {shoppingItems.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${((currentItem + 1) / shoppingItems.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Shopping Tips */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Budget Strategy</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Eco choices often save money long-term</div>
              <div>• Some sustainable options cost more initially</div>
              <div>• Consider durability and reusability</div>
              <div>• Think about environmental impact vs. cost</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Scoring System</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Eco choice: 20 points + time bonus</div>
              <div>• Time bonus: up to 60 points</div>
              <div>• Streak bonus: 10 points per eco choice in a row</div>
              <div>• Non-eco choice: -5 points penalty</div>
              <div>• Budget management affects available choices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoEcoFriendlyShopping;
