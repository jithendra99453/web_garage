import React, { useState, useEffect } from 'react';
import { Factory, Car, TreePine, Wind, RotateCcw } from 'lucide-react';

const EcoPollutionPuzzle = () => {
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const pollutionSources = [
    { id: 1, name: "Factory Smoke", emoji: "🏭", type: "air", solution: "clean_energy" },
    { id: 2, name: "Car Exhaust", emoji: "🚗", type: "air", solution: "electric_vehicle" },
    { id: 3, name: "Plastic Waste", emoji: "🗑️", type: "land", solution: "recycling" },
    { id: 4, name: "Oil Spill", emoji: "🛢️", type: "water", solution: "cleanup" },
    { id: 5, name: "Deforestation", emoji: "🪓", type: "land", solution: "reforestation" },
    { id: 6, name: "Chemical Runoff", emoji: "🏭", type: "water", solution: "filtration" }
  ];

  const solutions = [
    { id: "clean_energy", name: "Clean Energy", emoji: "☀️", type: "air" },
    { id: "electric_vehicle", name: "Electric Vehicle", emoji: "🚲", type: "air" },
    { id: "recycling", name: "Recycling", emoji: "♻️", type: "land" },
    { id: "cleanup", name: "Oil Cleanup", emoji: "🧽", type: "water" },
    { id: "reforestation", name: "Reforestation", emoji: "🌳", type: "land" },
    { id: "filtration", name: "Water Filtration", emoji: "💧", type: "water" }
  ];

  useEffect(() => {
    initializePuzzle();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const initializePuzzle = () => {
    const shuffledSources = [...pollutionSources].sort(() => Math.random() - 0.5);
    const shuffledSolutions = [...solutions].sort(() => Math.random() - 0.5);

    const pieces = shuffledSources.map((source, index) => ({
      ...source,
      position: index,
      matched: false
    }));

    setPuzzlePieces(pieces);
    setScore(0);
    setTimeLeft(120);
    setGameOver(false);
    setSelectedPiece(null);
  };

  const handlePieceClick = (pieceId) => {
    if (gameOver) return;

    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      // Try to match
      const sourcePiece = puzzlePieces.find(p => p.id === selectedPiece);
      const targetPiece = puzzlePieces.find(p => p.id === pieceId);

      if (sourcePiece && targetPiece && sourcePiece.solution === targetPiece.id) {
        // Correct match
        setPuzzlePieces(pieces =>
          pieces.map(p =>
            p.id === pieceId ? { ...p, matched: true } : p
          )
        );
        setScore(prev => prev + 20);
      } else {
        // Wrong match
        setScore(prev => Math.max(0, prev - 5));
      }
      setSelectedPiece(null);
    }
  };

  const allMatched = puzzlePieces.every(piece => piece.matched);

  useEffect(() => {
    if (allMatched && puzzlePieces.length > 0) {
      setGameOver(true);
    }
  }, [allMatched, puzzlePieces]);

  const getScoreMessage = () => {
    if (score >= 100) return "Excellent! You're a pollution prevention expert! 🌟";
    if (score >= 70) return "Great job! You understand pollution solutions! 👍";
    if (score >= 40) return "Good effort! Keep learning about environmental protection! 📚";
    return "Keep practicing! Every solution counts! ♻️";
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl w-full">
          <div className="text-6xl mb-4">{allMatched ? '🎉' : '⏰'}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {allMatched ? 'Puzzle Complete!' : 'Time\'s Up!'}
          </h2>
          <div className="text-4xl font-bold text-green-600 mb-2">{score} Points</div>
          <p className="text-lg text-gray-600 mb-6">{getScoreMessage()}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {puzzlePieces.filter(p => p.matched).length}
              </div>
              <div className="text-sm text-gray-600">Problems Solved</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {((puzzlePieces.filter(p => p.matched).length / puzzlePieces.length) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">🌍 Pollution Prevention Tips:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>• Choose renewable energy sources</li>
              <li>• Reduce, reuse, and recycle materials</li>
              <li>• Use public transportation or biking</li>
              <li>• Support clean water initiatives</li>
              <li>• Plant trees and protect forests</li>
              <li>• Advocate for environmental policies</li>
            </ul>
          </div>

          <button
            onClick={initializePuzzle}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧩 Eco Pollution Puzzle</h1>
          <p className="text-lg text-gray-600">Match pollution sources with their solutions!</p>

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
              <span className="text-2xl font-bold text-purple-600">
                {puzzlePieces.filter(p => p.matched).length}/{puzzlePieces.length}
              </span>
              <span className="text-gray-600 ml-2">Matched</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pollution Sources */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">🚨 Pollution Sources</h2>
            <div className="grid grid-cols-2 gap-4">
              {puzzlePieces.map((piece) => (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece.id)}
                  disabled={piece.matched}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    piece.matched
                      ? 'border-green-500 bg-green-100 opacity-50'
                      : selectedPiece === piece.id
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{piece.emoji}</div>
                  <div className="text-sm font-medium text-gray-800">{piece.name}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{piece.type} pollution</div>
                </button>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-green-600 mb-4">✅ Solutions</h2>
            <div className="grid grid-cols-2 gap-4">
              {solutions.map((solution) => {
                const isMatched = puzzlePieces.some(p => p.matched && p.solution === solution.id);
                return (
                  <div
                    key={solution.id}
                    className={`p-4 rounded-lg border-2 ${
                      isMatched
                        ? 'border-green-500 bg-green-100'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{solution.emoji}</div>
                    <div className="text-sm font-medium text-gray-800">{solution.name}</div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">{solution.type} solution</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 How to Play:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>1. Click a pollution source</strong> to select it
            </div>
            <div>
              <strong>2. Click the matching solution</strong> to pair them
            </div>
            <div>
              <strong>3. Correct matches</strong> earn 20 points
            </div>
            <div>
              <strong>4. Wrong matches</strong> lose 5 points
            </div>
          </div>
        </div>

        {selectedPiece && (
          <div className="mt-4 text-center">
            <p className="text-blue-600 font-medium">
              Selected: {puzzlePieces.find(p => p.id === selectedPiece)?.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoPollutionPuzzle;
