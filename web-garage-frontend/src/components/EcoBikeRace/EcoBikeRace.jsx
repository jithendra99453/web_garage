import React, { useState, useEffect } from 'react';
import { Bike, RotateCcw, Trophy } from 'lucide-react';

const EcoBikeRace = () => {
  const [position, setPosition] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [powerUps, setPowerUps] = useState([]);
  const [speed, setSpeed] = useState(1);

  const trackLength = 1000;
  const obstacleTypes = ['🚗', '🗑️', '🏭', '🛢️'];
  const powerUpTypes = ['⚡', '🌱', '💧', '♻️'];

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        updateGame();
      }
    }, 100);

    return () => clearInterval(gameLoop);
  }, [position, obstacles, powerUps, gameOver]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const updateGame = () => {
    // Move bike forward
    setPosition(prev => {
      const newPos = prev + speed;
      if (newPos >= trackLength) {
        setGameOver(true);
        return trackLength;
      }
      return newPos;
    });

    // Generate obstacles
    if (Math.random() < 0.02) {
      setObstacles(prev => [...prev, {
        id: Date.now(),
        position: Math.random() * 100 + 100,
        type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]
      }]);
    }

    // Generate power-ups
    if (Math.random() < 0.01) {
      setPowerUps(prev => [...prev, {
        id: Date.now(),
        position: Math.random() * 100 + 100,
        type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
      }]);
    }

    // Check collisions with obstacles
    setObstacles(prev => prev.filter(obstacle => {
      if (Math.abs(obstacle.position - position) < 5) {
        setSpeed(prevSpeed => Math.max(0.5, prevSpeed - 0.2));
        setScore(prevScore => Math.max(0, prevScore - 10));
        return false;
      }
      return obstacle.position > position - 50;
    }));

    // Check power-up collection
    setPowerUps(prev => prev.filter(powerUp => {
      if (Math.abs(powerUp.position - position) < 5) {
        collectPowerUp(powerUp.type);
        return false;
      }
      return powerUp.position > position - 50;
    }));
  };

  const collectPowerUp = (type) => {
    switch (type) {
      case '⚡':
        setSpeed(prev => prev + 0.5);
        setScore(prev => prev + 20);
        break;
      case '🌱':
        setScore(prev => prev + 15);
        break;
      case '💧':
        setSpeed(prev => prev + 0.3);
        break;
      case '♻️':
        setScore(prev => prev + 25);
        break;
    }
  };

  const resetGame = () => {
    setPosition(0);
    setObstacles([]);
    setPowerUps([]);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setSpeed(1);
  };

  const getProgressPercentage = () => (position / trackLength) * 100;
  const getSpeedColor = () => {
    if (speed >= 2) return 'text-green-600';
    if (speed >= 1.5) return 'text-blue-600';
    if (speed >= 1) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (gameOver) {
    const completionRate = (position / trackLength) * 100;
    const finalScore = score + Math.floor(completionRate * 2);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">
            {completionRate >= 100 ? '🏆' : completionRate >= 50 ? '🎉' : '💪'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {completionRate >= 100 ? 'Race Complete!' : 'Race Finished!'}
          </h2>
          <div className="text-4xl font-bold text-green-600 mb-2">{finalScore} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            You completed {completionRate.toFixed(1)}% of the eco-bike race!
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.floor(position)}m</div>
              <div className="text-sm text-gray-600">Distance Covered</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{speed.toFixed(1)}x</div>
              <div className="text-sm text-gray-600">Final Speed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{timeLeft}s</div>
              <div className="text-sm text-gray-600">Time Remaining</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">🚴‍♂️ Eco-Biking Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Biking reduces carbon emissions by avoiding car travel</li>
              <li>• Maintain your bike regularly for optimal performance</li>
              <li>• Use bike lanes and follow traffic rules for safety</li>
              <li>• Combine biking with public transport for longer trips</li>
              <li>• Advocate for better bike infrastructure in your community</li>
              <li>• Bike to work or school to improve your health and the environment</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Race Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🚴‍♂️ Eco Bike Race</h1>
          <p className="text-lg text-gray-600">Race through the city while avoiding pollution and collecting eco-power-ups!</p>

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
              <span className={`text-2xl font-bold ${getSpeedColor()}`}>{speed.toFixed(1)}x</span>
              <span className="text-gray-600 ml-2">Speed</span>
            </div>
          </div>
        </div>

        {/* Race Track */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-8">
          <div className="relative h-32 bg-gradient-to-r from-green-200 via-yellow-100 to-green-200 rounded-lg overflow-hidden">
            {/* Track markings */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="flex-1 border-r border-white border-dashed"></div>
              ))}
            </div>

            {/* Bike */}
            <div
              className="absolute bottom-4 transition-all duration-100"
              style={{ left: `${getProgressPercentage()}%` }}
            >
              <div className="text-4xl animate-bounce">🚴‍♂️</div>
            </div>

            {/* Obstacles */}
            {obstacles.map((obstacle) => (
              <div
                key={obstacle.id}
                className="absolute bottom-4 text-2xl"
                style={{ left: `${((obstacle.position - position) / 10) + 50}%` }}
              >
                {obstacle.type}
              </div>
            ))}

            {/* Power-ups */}
            {powerUps.map((powerUp) => (
              <div
                key={powerUp.id}
                className="absolute bottom-8 text-2xl animate-pulse"
                style={{ left: `${((powerUp.position - position) / 10) + 50}%` }}
              >
                {powerUp.type}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Start</span>
              <span>{Math.floor(position)}m / {trackLength}m</span>
              <span>Finish</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Power-ups:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <span>Speed Boost (+0.5x speed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <span>Eco Points (+15 points)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💧</span>
                <span>Water Boost (+0.3x speed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">♻️</span>
                <span>Recycle Bonus (+25 points)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Obstacles:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚗</span>
                <span>Cars (-0.2x speed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🗑️</span>
                <span>Trash (-0.2x speed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏭</span>
                <span>Factories (-0.2x speed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🛢️</span>
                <span>Oil Spills (-0.2x speed)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoBikeRace;
