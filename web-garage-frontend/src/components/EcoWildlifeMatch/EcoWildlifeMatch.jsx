import React, { useState, useEffect } from 'react';
import { Heart, RotateCcw } from 'lucide-react';

const EcoWildlifeMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const wildlifePairs = [
    { id: 1, name: "Panda", emoji: "🐼", habitat: "Bamboo forests" },
    { id: 2, name: "Elephant", emoji: "🐘", habitat: "Savannas" },
    { id: 3, name: "Tiger", emoji: "🐯", habitat: "Forests" },
    { id: 4, name: "Koala", emoji: "🐨", habitat: "Eucalyptus trees" },
    { id: 5, name: "Penguin", emoji: "🐧", habitat: "Antarctica" },
    { id: 6, name: "Dolphin", emoji: "🐬", habitat: "Oceans" }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matched.length === wildlifePairs.length * 2) {
      setGameWon(true);
    }
  }, [matched]);

  const initializeGame = () => {
    const gameCards = wildlifePairs.flatMap(pair => [
      { ...pair, uniqueId: `${pair.id}-name` },
      { ...pair, uniqueId: `${pair.id}-emoji` }
    ]);
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].uniqueId)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);

      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.id === secondCard.id) {
        setTimeout(() => {
          setMatched([...matched, firstCard.uniqueId, secondCard.uniqueId]);
          setFlipped([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const getCardContent = (card) => {
    if (card.uniqueId.includes('name')) {
      return card.name;
    } else {
      return card.emoji;
    }
  };

  const getScore = () => {
    const baseScore = wildlifePairs.length * 100;
    const movePenalty = moves * 5;
    return Math.max(baseScore - movePenalty, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🦁 Eco Wildlife Match</h1>
          <p className="text-lg text-gray-600">Match wildlife names with their emojis to learn about endangered species!</p>

          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-green-600">{moves}</span>
              <span className="text-gray-600 ml-2">Moves</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-2xl font-bold text-blue-600">{matched.length / 2}</span>
              <span className="text-gray-600 ml-2">Matches</span>
            </div>
            <button
              onClick={initializeGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RotateCcw size={20} />
              New Game
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index);
            const isMatched = matched.includes(card.uniqueId);

            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(index)}
                className={`aspect-square bg-white rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  isMatched
                    ? 'border-green-500 bg-green-100'
                    : isFlipped
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isMatched}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  {isFlipped || isMatched ? (
                    <>
                      <div className="text-2xl mb-1">{getCardContent(card)}</div>
                      {isMatched && (
                        <div className="text-xs text-green-600 font-medium">
                          {card.habitat}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-3xl text-gray-400">?</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {gameWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl max-w-md">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">Congratulations!</h2>
              <p className="text-lg text-gray-600 mb-4">You've matched all the wildlife!</p>
              <div className="text-4xl font-bold text-green-600 mb-4">{getScore()} Points</div>
              <p className="text-sm text-gray-500 mb-6">Completed in {moves} moves</p>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">🌍 Conservation Facts:</h3>
                <ul className="text-left text-sm text-gray-700 space-y-1">
                  <li>• Pandas eat bamboo for 12 hours daily</li>
                  <li>• Elephants can recognize themselves in mirrors</li>
                  <li>• Tigers have unique stripe patterns</li>
                  <li>• Koalas sleep up to 20 hours per day</li>
                  <li>• Penguins can dive up to 500 meters</li>
                  <li>• Dolphins use echolocation to navigate</li>
                </ul>
              </div>

              <button
                onClick={initializeGame}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Click cards to flip them. Match names with emojis to learn about wildlife conservation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcoWildlifeMatch;
