import React, { useState, useEffect } from 'react';
import { CheckCircle, X, RotateCcw } from 'lucide-react';

const EcoBingo = () => {
  const [board, setBoard] = useState([]);
  const [marked, setMarked] = useState(new Set());
  const [hasWon, setHasWon] = useState(false);
  const [score, setScore] = useState(0);

  const ecoFacts = [
    "Reduce, Reuse, Recycle",
    "Save Water Daily",
    "Use Renewable Energy",
    "Plant Trees",
    "Conserve Electricity",
    "Choose Public Transport",
    "Reduce Plastic Use",
    "Compost Organic Waste",
    "Save Endangered Species",
    "Fight Climate Change",
    "Protect Oceans",
    "Sustainable Farming",
    "Green Building",
    "Clean Air",
    "Biodiversity",
    "Carbon Footprint",
    "Eco-friendly Products",
    "Water Conservation",
    "Renewable Resources",
    "Environmental Education",
    "Zero Waste",
    "Green Transportation",
    "Sustainable Living",
    "Nature Conservation",
    "Climate Action"
  ];

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const shuffled = [...ecoFacts].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 25);
    const newBoard = [];
    for (let i = 0; i < 5; i++) {
      newBoard.push(selected.slice(i * 5, (i + 1) * 5));
    }
    // Mark center as free
    const centerIndex = 12; // 5x5 grid, center is index 12
    setBoard(newBoard);
    setMarked(new Set([centerIndex]));
    setHasWon(false);
    setScore(0);
  };

  const checkWin = (newMarked) => {
    const size = 5;

    // Check rows
    for (let row = 0; row < size; row++) {
      if ([...Array(size)].every((_, col) => newMarked.has(row * size + col))) {
        return true;
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      if ([...Array(size)].every((_, row) => newMarked.has(row * size + col))) {
        return true;
      }
    }

    // Check diagonals
    if ([...Array(size)].every((_, i) => newMarked.has(i * size + i))) return true;
    if ([...Array(size)].every((_, i) => newMarked.has(i * size + (size - 1 - i)))) return true;

    return false;
  };

  const handleCellClick = (row, col) => {
    const index = row * 5 + col;
    if (marked.has(index)) return;

    const newMarked = new Set(marked);
    newMarked.add(index);
    setMarked(newMarked);
    setScore(prev => prev + 10);

    if (checkWin(newMarked)) {
      setHasWon(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 Eco Bingo</h1>
          <p className="text-lg text-gray-600">Mark environmental facts to get BINGO!</p>
          <div className="mt-4 flex justify-center items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-green-600">{score}</span>
              <span className="text-gray-600 ml-2">Points</span>
            </div>
            <button
              onClick={initializeBoard}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RotateCcw size={20} />
              New Game
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
            {board.flat().map((fact, index) => {
              const row = Math.floor(index / 5);
              const col = index % 5;
              const isMarked = marked.has(index);
              const isCenter = index === 12;

              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(row, col)}
                  disabled={isMarked}
                  className={`
                    aspect-square p-2 text-xs font-medium rounded-lg border-2 transition-all duration-200
                    ${isMarked
                      ? 'bg-green-500 text-white border-green-500 shadow-lg transform scale-95'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                    }
                    ${isCenter ? 'bg-green-200 border-green-400' : ''}
                  `}
                >
                  {fact}
                  {isMarked && <CheckCircle size={16} className="mx-auto mt-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {hasWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">BINGO!</h2>
              <p className="text-lg text-gray-600 mb-4">Congratulations! You completed Eco Bingo!</p>
              <p className="text-xl font-semibold text-green-600 mb-6">Final Score: {score} points</p>
              <button
                onClick={initializeBoard}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Click on squares to mark environmental facts. Get 5 in a row to win!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcoBingo;
