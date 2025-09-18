import React, { useState, useEffect } from 'react';
import { Home, RotateCcw, Trophy, Leaf } from 'lucide-react';

const EcoGreenBuilding = () => {
  const [building, setBuilding] = useState({
    foundation: false,
    walls: false,
    roof: false,
    windows: false,
    solar: false,
    insulation: false,
    rainwater: false,
    garden: false
  });

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameOver, setGameOver] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [efficiency, setEfficiency] = useState(0);

  const buildingComponents = {
    foundation: {
      name: "Eco Foundation",
      cost: 200,
      efficiency: 15,
      emoji: "🏗️",
      description: "Sustainable concrete foundation"
    },
    walls: {
      name: "Insulated Walls",
      cost: 150,
      efficiency: 20,
      emoji: "🧱",
      description: "Energy-efficient wall system"
    },
    roof: {
      name: "Green Roof",
      cost: 180,
      efficiency: 25,
      emoji: "🏠",
      description: "Living roof with vegetation"
    },
    windows: {
      name: "Energy Windows",
      cost: 120,
      efficiency: 18,
      emoji: "🪟",
      description: "Triple-glazed, energy-efficient windows"
    },
    solar: {
      name: "Solar Panels",
      cost: 300,
      efficiency: 35,
      emoji: "☀️",
      description: "Solar power generation system"
    },
    insulation: {
      name: "Smart Insulation",
      cost: 100,
      efficiency: 22,
      emoji: "🔧",
      description: "Advanced thermal insulation"
    },
    rainwater: {
      name: "Rainwater System",
      cost: 80,
      efficiency: 12,
      emoji: "💧",
      description: "Rainwater harvesting and reuse"
    },
    garden: {
      name: "Permaculture Garden",
      cost: 90,
      efficiency: 16,
      emoji: "🌱",
      description: "Sustainable food production garden"
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    // Calculate efficiency whenever building changes
    const totalEfficiency = Object.entries(building)
      .filter(([_, installed]) => installed)
      .reduce((sum, [component]) => sum + buildingComponents[component].efficiency, 0);

    setEfficiency(totalEfficiency);

    // Check if building is complete
    const allComponents = Object.values(building).every(installed => installed);
    if (allComponents) {
      setGameOver(true);
    }
  }, [building]);

  const installComponent = (component) => {
    if (building[component] || budget < buildingComponents[component].cost) return;

    setBuilding(prev => ({ ...prev, [component]: true }));
    setBudget(prev => prev - buildingComponents[component].cost);
    setScore(prev => prev + buildingComponents[component].efficiency * 2);
  };

  const resetGame = () => {
    setBuilding({
      foundation: false,
      walls: false,
      roof: false,
      windows: false,
      solar: false,
      insulation: false,
      rainwater: false,
      garden: false
    });
    setScore(0);
    setTimeLeft(180);
    setGameOver(false);
    setBudget(1000);
    setEfficiency(0);
  };

  const getEfficiencyRating = () => {
    if (efficiency >= 150) return { rating: "Exceptional", color: "text-green-600", emoji: "🌟" };
    if (efficiency >= 120) return { rating: "Excellent", color: "text-blue-600", emoji: "⭐" };
    if (efficiency >= 90) return { rating: "Good", color: "text-yellow-600", emoji: "👍" };
    if (efficiency >= 60) return { rating: "Fair", color: "text-orange-600", emoji: "🤔" };
    return { rating: "Poor", color: "text-red-600", emoji: "😕" };
  };

  const completedComponents = Object.values(building).filter(installed => installed).length;
  const totalComponents = Object.keys(building).length;

  if (gameOver) {
    const efficiencyRating = getEfficiencyRating();
    const finalScore = score + (efficiency * 3) + (budget * 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">{efficiencyRating.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {completedComponents === totalComponents ? 'Green Building Complete!' : 'Time\'s Up!'}
          </h2>
          <div className="text-4xl font-bold text-green-600 mb-2">{Math.round(finalScore)} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            Efficiency Rating: <span className={`font-bold ${efficiencyRating.color}`}>{efficiencyRating.rating}</span>
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedComponents}</div>
              <div className="text-sm text-gray-600">Components Built</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{efficiency}%</div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">${budget}</div>
              <div className="text-sm text-gray-600">Budget Left</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className={`text-2xl font-bold ${efficiencyRating.color}`}>{efficiencyRating.rating}</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-emerald-800 mb-2">🏠 Green Building Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Use locally sourced, sustainable materials</li>
              <li>• Maximize natural light and ventilation</li>
              <li>• Install energy-efficient appliances and systems</li>
              <li>• Incorporate green spaces and living roofs</li>
              <li>• Use water-efficient fixtures and rainwater harvesting</li>
              <li>• Consider the building's lifecycle environmental impact</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Build Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🏠 Eco Green Building</h1>
          <p className="text-lg text-gray-600">Design and build an environmentally sustainable home!</p>

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
              <span className="text-2xl font-bold text-purple-600">{efficiency}%</span>
              <span className="text-gray-600 ml-2">Efficiency</span>
            </div>
          </div>
        </div>

        {/* Building Visualization */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Green Home</h2>
            <div className="text-sm text-gray-600">
              Components: {completedComponents}/{totalComponents}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-64 h-64 border-4 border-gray-300 rounded-lg bg-gradient-to-b from-blue-200 to-green-200">
              {/* Foundation */}
              {building.foundation && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-600 rounded-b-lg"></div>
              )}

              {/* Walls */}
              {building.walls && (
                <div className="absolute bottom-8 left-2 right-2 top-16 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              )}

              {/* Roof */}
              {building.roof && (
                <div className="absolute top-4 left-0 right-0 h-12 bg-green-400 rounded-t-lg flex items-center justify-center">
                  <span className="text-lg">🌱</span>
                </div>
              )}

              {/* Windows */}
              {building.windows && (
                <>
                  <div className="absolute top-20 left-4 w-8 h-8 bg-blue-200 border border-blue-400 rounded"></div>
                  <div className="absolute top-20 right-4 w-8 h-8 bg-blue-200 border border-blue-400 rounded"></div>
                </>
              )}

              {/* Solar Panels */}
              {building.solar && (
                <div className="absolute top-2 left-8 right-8 h-6 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-sm">☀️</span>
                </div>
              )}

              {/* Insulation indicator */}
              {building.insulation && (
                <div className="absolute top-16 left-6 right-6 h-2 bg-pink-300 rounded"></div>
              )}

              {/* Rainwater system */}
              {building.rainwater && (
                <div className="absolute top-8 right-1 w-4 h-16 bg-blue-400 rounded"></div>
              )}

              {/* Garden */}
              {building.garden && (
                <div className="absolute bottom-12 left-4 right-4 h-8 bg-green-300 rounded flex items-center justify-center">
                  <span className="text-sm">🌿</span>
                </div>
              )}

              {/* Empty house placeholder */}
              {!building.walls && (
                <div className="absolute inset-4 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                  <span className="text-4xl text-gray-400">🏗️</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Component Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(buildingComponents).map(([key, component]) => (
            <button
              key={key}
              onClick={() => installComponent(key)}
              disabled={building[key] || budget < component.cost}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                building[key]
                  ? 'border-green-500 bg-green-100'
                  : budget < component.cost
                    ? 'border-red-300 bg-red-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{component.emoji}</div>
                <div className="font-medium text-gray-800">{component.name}</div>
                <div className="text-sm text-gray-600">{component.description}</div>
                <div className="text-sm font-bold text-green-600 mt-1">
                  ${component.cost} | +{component.efficiency}% efficiency
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Progress and Tips */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Building Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Components Built:</span>
                <span className="font-medium">{completedComponents}/{totalComponents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedComponents / totalComponents) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Efficiency Rating:</span>
                <span className={`font-medium ${getEfficiencyRating().color}`}>
                  {getEfficiencyRating().rating}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Building Tips</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Start with foundation and walls first</div>
              <div>• Solar panels give the highest efficiency boost</div>
              <div>• Balance your budget with efficiency gains</div>
              <div>• Complete all components for maximum score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoGreenBuilding;
