import React, { useState, useEffect } from 'react';
import { Thermometer, CloudRain, Wind, Sun } from 'lucide-react';

const EcoClimateChallenge = () => {
  const [temperature, setTemperature] = useState(15);
  const [co2Level, setCo2Level] = useState(400);
  const [actions, setActions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);

  const climateActions = [
    { id: 1, name: "Plant Trees", icon: "🌳", tempEffect: -0.5, co2Effect: -20, points: 50 },
    { id: 2, name: "Use Solar Power", icon: "☀️", tempEffect: -0.3, co2Effect: -15, points: 40 },
    { id: 3, name: "Reduce Driving", icon: "🚗", tempEffect: -0.4, co2Effect: -25, points: 45 },
    { id: 4, name: "Recycle More", icon: "♻️", tempEffect: -0.2, co2Effect: -10, points: 30 },
    { id: 5, name: "Save Energy", icon: "💡", tempEffect: -0.3, co2Effect: -12, points: 35 },
    { id: 6, name: "Go Vegetarian", icon: "🥕", tempEffect: -0.6, co2Effect: -30, points: 55 }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // Simulate climate change progression
        setTemperature(prev => prev + 0.01);
        setCo2Level(prev => prev + 0.5);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const performAction = (action) => {
    if (gameOver) return;

    setActions([...actions, action]);
    setTemperature(prev => Math.max(10, prev + action.tempEffect));
    setCo2Level(prev => Math.max(350, prev + action.co2Effect));
    setScore(prev => prev + action.points);
  };

  const getClimateStatus = () => {
    if (temperature < 14) return { status: "Cooling", color: "text-blue-600", icon: "❄️" };
    if (temperature < 16) return { status: "Stable", color: "text-green-600", icon: "✅" };
    if (temperature < 18) return { status: "Warming", color: "text-yellow-600", icon: "🌡️" };
    return { status: "Critical", color: "text-red-600", icon: "🔥" };
  };

  const resetGame = () => {
    setTemperature(15);
    setCo2Level(400);
    setActions([]);
    setScore(0);
    setTimeLeft(120);
    setGameOver(false);
  };

  const climateStatus = getClimateStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">🌡️ Eco Climate Challenge</h1>
          <p className="text-lg text-gray-600">Take action to combat climate change before time runs out!</p>

          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-green-600">{score}</span>
              <span className="text-gray-600 ml-2">Points</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-blue-600">{timeLeft}</span>
              <span className="text-gray-600 ml-2">Seconds</span>
            </div>
            <button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Climate Dashboard */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🌍 Climate Dashboard</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Thermometer className="text-red-500" size={24} />
                  <span className="text-lg font-medium">Temperature</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{temperature.toFixed(1)}°C</div>
                  <div className={`text-sm font-medium ${climateStatus.color}`}>
                    {climateStatus.icon} {climateStatus.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudRain className="text-blue-500" size={24} />
                  <span className="text-lg font-medium">CO₂ Level</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{co2Level.toFixed(0)} ppm</div>
                  <div className="text-sm text-gray-600">Atmospheric CO₂</div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Recent Actions:</h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {actions.slice(-5).map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span>{action.icon}</span>
                      <span>{action.name}</span>
                      <span className="text-green-600">+{action.points}pts</span>
                    </div>
                  ))}
                  {actions.length === 0 && (
                    <p className="text-gray-500 text-sm">No actions taken yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Climate Actions</h2>

            <div className="grid grid-cols-2 gap-4">
              {climateActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => performAction(action)}
                  disabled={gameOver}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="text-sm font-medium text-gray-800 mb-1">{action.name}</div>
                  <div className="text-xs text-green-600">+{action.points} pts</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl max-w-md">
              <div className="text-6xl mb-4">{temperature < 16 ? '🎉' : '⚠️'}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Time's Up!</h2>
              <p className="text-lg text-gray-600 mb-4">
                {temperature < 16
                  ? "Great job! You helped stabilize the climate!"
                  : "The climate is still warming. Try taking more actions next time!"
                }
              </p>
              <div className="text-4xl font-bold text-green-600 mb-4">{score} Points</div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">🌡️ Final Climate State:</h3>
                <p className="text-gray-700">Temperature: {temperature.toFixed(1)}°C</p>
                <p className="text-gray-700">CO₂ Level: {co2Level.toFixed(0)} ppm</p>
                <p className="text-gray-700">Actions Taken: {actions.length}</p>
              </div>

              <button
                onClick={resetGame}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-600">
            Take climate actions to reduce temperature and CO₂ levels before time runs out!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcoClimateChallenge;
