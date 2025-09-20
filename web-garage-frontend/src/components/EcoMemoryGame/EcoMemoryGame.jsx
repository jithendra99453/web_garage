import { Award, RotateCcw } from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';
// 1. Import the new CSS module
import styles from './EcoMemoryGame.module.css';

const EcoMemoryGame = () => {
  const { refreshStudentData } = useContext(UserContext);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 2. More diverse and eco-friendly symbols
  const cardSymbols = ['♻️', '💧', '🌍', '🦋', '💡', '🍃', '☀️', '⛰️'];

  useEffect(() => {
    initializeGame();
  }, []);
  
  // This effect correctly detects when the game is won
  useEffect(() => {
    // Check if all pairs have been matched
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setTimeout(() => {
        setScore(prev => prev + 50); // Bonus for completing
        setGameOver(true);
      }, 500);
    }
  }, [cards]);

  // This effect handles saving the score and refreshing the dashboard
  useEffect(() => {
    const saveFinalScore = async () => {
      if (gameOver && score > 0) {
        await awardPoints(score);
        refreshStudentData();
      }
    };
    saveFinalScore();
  }, [gameOver, score, refreshStudentData]);

  const initializeGame = () => {
    const gameCards = [...cardSymbols, ...cardSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setGameOver(false);
  };

  const handleCardClick = (clickedCard) => {
    if (gameOver || clickedCard.isFlipped || flippedCards.length === 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    // Flip the clicked card
    setCards(prev => prev.map(c => (c.id === clickedCard.id ? { ...c, isFlipped: true } : c)));

    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setScore(prev => prev + 20);
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.symbol === firstCard.symbol ? { ...c, isMatched: true } : c)));
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === firstCard.id || c.id === secondCard.id ? { ...c, isFlipped: false } : c)));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.gameWrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>🧠 Eco Memory Game</h1>
          <p className={styles.subtitle}>Match the environmental symbols to save the planet!</p>
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <Award size={16} color="#16a34a" />
              <span>{score} points</span>
            </div>
            <div className={styles.statBox}>
              <span>{moves} moves</span>
            </div>
          </div>
        </header>

        {gameOver ? (
          <div className={styles.gameOverCard}>
            <Award size={64} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
            <h2 className={styles.gameOverTitle}>Memory Master! 🎉</h2>
            <p className={styles.gameOverText}>
              Excellent! You completed the game in {moves} moves and earned {score} eco-points!
            </p>
            <button onClick={initializeGame} className={styles.playAgainButton}>
              <RotateCcw size={20} />
              Play Again
            </button>
          </div>
        ) : (
          <div className={styles.board}>
            <div className={styles.cardGrid}>
              {cards.map((card) => (
                // 3. The card structure is now using divs and CSS classes
                <div key={card.id} className={styles.card} onClick={() => handleCardClick(card)}>
                  <div className={`${styles.cardInner} ${card.isFlipped ? styles.isFlipped : ''}`}>
                    <div className={`${styles.cardFace} ${styles.cardFront}`}>?</div>
                    <div className={`${styles.cardFace} ${styles.cardBack} ${card.isMatched ? styles.isMatched : ''}`}>
                      {card.symbol}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoMemoryGame;
