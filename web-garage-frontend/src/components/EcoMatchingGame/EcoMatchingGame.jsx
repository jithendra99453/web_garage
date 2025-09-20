import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';
import { Leaf, Award, RotateCcw, CheckCircle } from 'lucide-react';

const EcoMatchingGame = () => {
  // 1. CONNECT
  const { refreshStudentData } = useContext(UserContext);

  // 2. MANAGE STATE
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  // 3. SAVE SCORE ON GAME END
  useEffect(() => {
    const saveFinalScore = async () => {
      if (gameComplete && score > 0) {
        await awardPoints(score);
        refreshStudentData();
      }
    };
    saveFinalScore();
  }, [gameComplete, score, refreshStudentData]);

  const cardPairs = [
    { id: 1, term: 'Carbon Footprint', definition: 'The total amount of greenhouse gases produced by human activities' },
    { id: 2, term: 'Renewable Energy', definition: 'Energy from sources that are naturally replenished' },
    { id: 3, term: 'Biodiversity', definition: 'The variety of life in the world or in a particular habitat' },
    { id: 4, term: 'Sustainable', definition: 'Able to be maintained at a certain rate or level' },
    { id: 5, term: 'Recycling', definition: 'The process of converting waste into reusable material' },
    { id: 6, term: 'Conservation', definition: 'The protection of plants, animals, and natural resources' },
    { id: 7, term: 'Ecosystem', definition: 'A community of living organisms and their environment' },
    { id: 8, term: 'Climate Change', definition: 'Long-term changes in temperature and weather patterns' }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    setScore(0);
    setGameComplete(false);
    const gameCards = [];
    cardPairs.forEach(pair => {
      gameCards.push({
        id: `${pair.id}-term`,
        content: pair.term,
        type: 'term',
        pairId: pair.id,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: `${pair.id}-def`,
        content: pair.definition,
        type: 'definition',
        pairId: pair.id,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle the cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2) return;

    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatchedPairs(prev => [...prev, firstCard.pairId]);
          setScore(prev => prev + 15);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs.length === cardPairs.length) {
      setGameComplete(true);
      setScore(prev => prev + 50); // Bonus for completing the game
    }
  }, [matchedPairs]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f3ff 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
            🔗 Eco Matching Game
          </h1>
          <p style={{ color: '#6b7280' }}>Match environmental terms with their definitions!</p>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #d1d5db',
                  background: card.isMatched ? '#dcfce7' :
                             card.isFlipped ? '#dbeafe' : '#f9fafb',
                  color: card.isMatched ? '#15803d' :
                         card.isFlipped ? '#1e40af' : '#374151',
                  cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
              >
                {card.isFlipped || card.isMatched ? (
                  <>
                    <span>{card.content}</span>
                    {card.isMatched && (
                      <CheckCircle style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '1rem',
                        height: '1rem',
                        color: '#16a34a'
                      }} />
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>?</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {gameComplete && (
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', textAlign: 'center' }}>
            <Award style={{ width: '4rem', height: '4rem', color: '#eab308', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginBottom: '1rem' }}>
              Matching Complete! 🎉
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Excellent! You matched all pairs in {moves} moves and earned {score} eco-points!
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

export default EcoMatchingGame;
