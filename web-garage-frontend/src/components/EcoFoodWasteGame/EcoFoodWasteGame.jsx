import React, { useState, useEffect } from 'react';
import { Apple, Carrot, Wheat, RotateCcw } from 'lucide-react';

const EcoFoodWasteGame = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  const foodCategories = {
    fresh: { name: "Fresh Produce", color: "green", icon: "🥕" },
    grains: { name: "Grains & Bread", color: "yellow", icon: "🍞" },
    dairy: { name: "Dairy", color: "blue", icon: "🥛" },
    meat: { name: "Meat & Fish", color: "red", icon: "🥩" },
    packaged: { name: "Packaged Foods", color: "purple", icon: "🥫" }
  };

  const wasteReasons = [
    "Expired date",
    "Not used in time",
    "Over-purchased",
    "Poor storage",
    "Cooking too much"
  ];

  useEffect(() => {
    generateFoodItems();
  }, [currentRound]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const generateFoodItems = () => {
    const items = [];
    const categories = Object.keys(foodCategories);

    for (let i = 0; i < 8; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const wasteReason = wasteReasons[Math.floor(Math.random() * wasteReasons.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;

      items.push({
        id: i,
        category,
        name: getRandomFoodName(category),
        quantity,
        wasteReason,
        saved: false,
        wasted: false
      });
    }

    setFoodItems(items);
  };

  const getRandomFoodName = (category) => {
    const names = {
      fresh: ["Apples", "Bananas", "Carrots", "Lettuce", "Tomatoes", "Potatoes", "Onions", "Broccoli"],
      grains: ["Bread", "Rice", "Pasta", "Cereal", "Flour", "Oats", "Quinoa", "Bagels"],
      dairy: ["Milk", "Cheese", "Yogurt", "Butter", "Cream", "Eggs", "Ice Cream", "Sour Cream"],
      meat: ["Chicken", "Beef", "Fish", "Pork", "Turkey", "Bacon", "Sausage", "Tuna"],
      packaged: ["Canned Soup", "Chips", "Cookies", "Frozen Pizza", "Cereal Bars", "Peanut Butter", "Jam", "Pickles"]
    };
    return names[category][Math.floor(Math.random() * names[category].length)];
  };

  const handleFoodAction = (itemId, action) => {
    if (gameOver) return;

    setFoodItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          if (action === 'save') {
            setScore(prev => prev + 10);
            return { ...item, saved: true };
          } else if (action === 'waste') {
            setScore(prev => prev + 5);
            return { ...item, wasted: true };
          }
        }
        return item;
      })
    );
  };

  const nextRound = () => {
    if (currentRound < 5) {
      setCurrentRound(currentRound + 1);
      setTimeLeft(90);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(90);
    setGameOver(false);
    setCurrentRound(1);
  };

  const allItemsHandled = foodItems.every(item => item.saved || item.wasted);
  const savedItems = foodItems.filter(item => item.saved).length;
  const wastedItems = foodItems.filter(item => item.wasted).length;

  if (gameOver) {
    const totalPossibleScore = 8 * 10; // 8 items * 10 points each
    const efficiency = (savedItems / 8) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">{efficiency >= 70 ? '🥳' : '🤔'}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <div className="text-4xl font-bold text-green-600 mb-2">{score} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            You saved {savedItems} out of 8 food items ({efficiency.toFixed(1)}% efficiency)
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{savedItems}</div>
              <div className="text-sm text-gray-600">Items Saved</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{wastedItems}</div>
              <div className="text-sm text-gray-600">Items Wasted</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{efficiency.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2">🍎 Food Waste Prevention Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Plan meals and make shopping lists</li>
              <li>• Store food properly to extend freshness</li>
              <li>• Use "first in, first out" inventory method</li>
              <li>• Buy only what you need</li>
              <li>• Compost food scraps when possible</li>
              <li>• Use leftovers creatively</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">🍎 Eco Food Waste Game</h1>
          <p className="text-lg text-gray-600">Decide whether to save or waste food items to reduce food waste!</p>

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
              <span className="text-2xl font-bold text-purple-600">Round {currentRound}/5</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {foodItems.map((item) => (
            <div key={item.id} className={`bg-white rounded-lg p-4 shadow-lg border-2 ${
              item.saved ? 'border-green-500 bg-green-50' :
              item.wasted ? 'border-red-500 bg-red-50' :
              'border-gray-200'
            }`}>
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{foodCategories[item.category].icon}</div>
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-600">{item.quantity} {item.quantity > 1 ? 'items' : 'item'}</div>
              </div>

              <div className="text-xs text-gray-500 mb-3 text-center">
                Reason: {item.wasteReason}
              </div>

              {!item.saved && !item.wasted && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFoodAction(item.id, 'save')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleFoodAction(item.id, 'waste')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium"
                  >
                    Waste
                  </button>
                </div>
              )}

              {item.saved && (
                <div className="text-center text-green-600 font-medium text-sm">
                  ✓ Saved!
                </div>
              )}

              {item.wasted && (
                <div className="text-center text-red-600 font-medium text-sm">
                  ✗ Wasted
                </div>
              )}
            </div>
          ))}
        </div>

        {allItemsHandled && (
          <div className="text-center">
            <button
              onClick={nextRound}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Next Round
            </button>
          </div>
        )}

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 How to Play:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Save:</strong> Choose items that can still be used or repurposed
            </div>
            <div>
              <strong>Waste:</strong> Choose items that are truly spoiled or unusable
            </div>
            <div>
              <strong>Goal:</strong> Maximize saved food to reduce waste
            </div>
            <div>
              <strong>Tip:</strong> Consider composting and creative cooking!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoFoodWasteGame;
