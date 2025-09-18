import React, { useState, useEffect } from 'react';
import { Fish, RotateCcw, Trophy, Trash2 } from 'lucide-react';

const EcoOceanCleanup = () => {
  const [marineLife, setMarineLife] = useState([]);
  const [trash, setTrash] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);

  const trashTypes = ['🗑️', '🥤', '🛍️', '🛍️', '🍾', '🥫', '🧴', '📦'];
  const marineLifeTypes = ['🐠', '🐟', '🦈', '🐢', '🐙', '🦑', '🦞', '🐳'];

  useEffect(() => {
    initializeLevel();
  }, [level]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        updateGame();
      }
    }, 100);

    return () => clearInterval(gameLoop);
  }, [marineLife, trash, gameOver]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const initializeLevel = () => {
    const numTrash = 8 + (level - 1) * 3;
    const numMarineLife = 5 + (level - 1) * 2;

    // Generate trash
    const newTrash = [];
    for (let i = 0; i < numTrash; i++) {
      newTrash.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        type: trashTypes[Math.floor(Math.random() * trashTypes.length)],
        collected: false
      });
    }
    setTrash(newTrash);

    // Generate marine life
    const newMarineLife = [];
    for (let i = 0; i < numMarineLife; i++) {
      newMarineLife.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        type: marineLifeTypes[Math.floor(Math.random() * marineLifeTypes.length)],
        rescued: false
      });
    }
    setMarineLife(newMarineLife);
  };

  const updateGame = () => {
    // Move marine life slightly
    setMarineLife(prev => prev.map(life => ({
      ...life,
      x: life.x + (Math.random() - 0.5) * 0.5,
      y: life.y + (Math.random() - 0.5) * 0.5
    })));

    // Check for collisions between trash and marine life
    setMarineLife(prev => prev.map(life => {
      const nearbyTrash = trash.find(t =>
        !t.collected &&
        Math.abs(t.x - life.x) < 8 &&
        Math.abs(t.y - life.y) < 8
      );

      if (nearbyTrash && !life.rescued) {
        // Marine life is in danger!
        return { ...life, inDanger: true };
      }
      return { ...life, inDanger: false };
    }));
  };

  const collectTrash = (trashId) => {
    setTrash(prev => prev.map(t =>
      t.id === trashId ? { ...t, collected: true } : t
    ));

    // Check if this trash was endangering marine life
    const collectedTrash = trash.find(t => t.id === trashId);
    const endangeredLife = marineLife.find(life =>
      Math.abs(life.x - collectedTrash.x) < 8 &&
      Math.abs(life.y - collectedTrash.y) < 8 &&
      life.inDanger
    );

    if (endangeredLife) {
      setScore(prev => prev + 30); // Bonus for saving marine life
    } else {
      setScore(prev => prev + 10);
    }
  };

  const rescueMarineLife = (lifeId) => {
    setMarineLife(prev => prev.map(l =>
      l.id === lifeId ? { ...l, rescued: true } : l
    ));
    setScore(prev => prev + 20);
  };

  const nextLevel = () => {
    if (level < 5) {
      setLevel(level + 1);
      setTimeLeft(90);
    } else {
      setGameOver(true);
    }
  };

  const loseLife = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameOver(true);
      }
      return newLives;
    });
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(90);
    setGameOver(false);
    setLevel(1);
    setLives(3);
  };

  const collectedTrash = trash.filter(t => t.collected).length;
  const rescuedLife = marineLife.filter(l => l.rescued).length;
  const totalTrash = trash.length;
  const totalLife = marineLife.length;

  const allTrashCollected = collectedTrash === totalTrash;
  const allLifeRescued = rescuedLife === totalLife;

  useEffect(() => {
    if (allTrashCollected && allLifeRescued && !gameOver) {
      setTimeout(() => nextLevel(), 1000);
    }
  }, [allTrashCollected, allLifeRescued, gameOver]);

  if (gameOver) {
    const finalScore = score + (lives * 50) + (level * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">
            {lives > 0 ? '🌊' : '💔'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {lives > 0 ? 'Ocean Cleanup Complete!' : 'Game Over!'}
          </h2>
          <div className="text-4xl font-bold text-blue-600 mb-2">{finalScore} Points</div>
          <p className="text-lg text-gray-600 mb-6">
            You reached Level {level} and {lives > 0 ? 'saved the ocean!' : 'ran out of lives!'}
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{collectedTrash}</div>
              <div className="text-sm text-gray-600">Trash Collected</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{rescuedLife}</div>
              <div className="text-sm text-gray-600">Marine Life Saved</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{level}</div>
              <div className="text-sm text-gray-600">Levels Completed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{lives}</div>
              <div className="text-sm text-gray-600">Lives Remaining</div>
            </div>
          </div>

          <div className="bg-cyan-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-cyan-800 mb-2">🌊 Ocean Conservation Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Reduce plastic use and properly recycle plastic items</li>
              <li>• Participate in beach and river cleanup events</li>
              <li>• Use reef-safe sunscreen to protect marine ecosystems</li>
              <li>• Support sustainable fishing practices</li>
              <li>• Reduce water pollution by properly disposing of chemicals</li>
              <li>• Advocate for marine protected areas</li>
            </ul>
          </div>

          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <RotateCcw size={20} className="inline mr-2" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">🌊 Eco Ocean Cleanup</h1>
          <p className="text-lg text-gray-600">Clean up the ocean while rescuing marine life from pollution!</p>

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
              <span className="text-2xl font-bold text-purple-600">Level {level}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-red-600">{'❤️'.repeat(lives)}</span>
            </div>
          </div>
        </div>

        {/* Ocean Scene */}
        <div className="bg-gradient-to-b from-blue-200 to-blue-600 rounded-xl shadow-2xl p-6 mb-8 relative overflow-hidden" style={{ height: '500px' }}>
          {/* Ocean background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 text-6xl">🌊</div>
            <div className="absolute top-20 right-20 text-4xl">🐚</div>
            <div className="absolute bottom-10 left-1/4 text-5xl">🪸</div>
            <div className="absolute bottom-20 right-1/3 text-4xl">🐙</div>
          </div>

          {/* Trash items */}
          {trash.map((item) => (
            !item.collected && (
              <button
                key={item.id}
                onClick={() => collectTrash(item.id)}
                className="absolute text-3xl hover:scale-110 transition-transform"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {item.type}
              </button>
            )
          ))}

          {/* Marine life */}
          {marineLife.map((life) => (
            !life.rescued && (
              <button
                key={life.id}
                onClick={() => rescueMarineLife(life.id)}
                className={`absolute text-3xl hover:scale-110 transition-transform ${
                  life.inDanger ? 'animate-pulse text-red-500' : ''
                }`}
                style={{
                  left: `${life.x}%`,
                  top: `${life.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {life.type}
              </button>
            )
          ))}

          {/* Progress indicators */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-800">
              Trash: {collectedTrash}/{totalTrash}
            </div>
            <div className="text-sm font-medium text-gray-800">
              Marine Life: {rescuedLife}/{totalLife}
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 How to Play:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Click on trash items to collect them</div>
              <div>• Click on marine life to rescue them</div>
              <div>• Save marine life from nearby trash (red glow)</div>
              <div>• Complete all objectives to advance levels</div>
              <div>• Don't let time run out!</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Scoring:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Trash collected: 10 points</div>
              <div>• Marine life rescued: 20 points</div>
              <div>• Life saved from trash: +20 bonus points</div>
              <div>• Level completion: +100 points</div>
              <div>• Lives remaining: +50 points each</div>
            </div>
          </div>
        </div>

        {allTrashCollected && allLifeRescued && (
          <div className="text-center mt-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg inline-block">
              <span className="font-medium">Level {level} Complete!</span>
              <span className="ml-2">Advancing to next level...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoOceanCleanup;
