import React, { useState, useEffect } from 'react';
import { Leaf, Award, RotateCcw } from 'lucide-react';

const EcoMemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const cardSymbols = ['🌳', '🌱', '🌿', '🌸', '🌻', '🌺', '🌼', '🌹'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards = [...cardSymbols, ...cardSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setGameComplete(false);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    const newCards = cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs(prev => [...prev, firstCard.symbol]);
          setScore(prev => prev + 20);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs.length === cardSymbols.length) {
      setGameComplete(true);
      setScore(prev => prev + 50); // Bonus for completing the game
    }
  }, [matchedPairs]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f3ff 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
            🧠 Eco Memory Game
          </h1>
          <p style={{ color: '#6b7280' }}>Match the environmental symbols to save the planet!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <Award style={{ display: 'inline', width: '1rem', height: '1rem', color: '#16a34a' }} />
              <span style={{ marginLeft: '0.5rem', fontWeight: '500', color: '#15803d' }}>{score} points</span>
            </div>
            <div style={{ background: '#dbeafe', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <span style={{ fontWeight: '500', color: '#1e40af' }}>{moves} moves</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: '32rem', margin: '0 auto' }}>
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={{
                  width: '6rem',
                  height: '6rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  background: card.isMatched ? '#dcfce7' : card.isFlipped ? '#dbeafe' : '#3b82f6',
                  color: card.isFlipped || card.isMatched ? '#1e40af' : 'white',
                  transition: 'all 0.3s',
                  transform: card.isFlipped || card.isMatched ? 'scale(1)' : 'scale(0.95)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </div>
            ))}
          </div>
        </div>

        {gameComplete && (
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', textAlign: 'center' }}>
            <Award style={{ width: '4rem', height: '4rem', color: '#eab308', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginBottom: '1rem' }}>
              Memory Master! 🎉
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Excellent! You completed the game in {moves} moves and earned {score} eco-points!
            </p>
            <button
              onClick={initializeGame}
              style={{
                background: '#16a34a',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RotateCcw style={{ width: '1.25rem', height: '1.25rem' }} />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoMemoryGame;
