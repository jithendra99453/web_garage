// 1. Import 'useContext' from React
import React, { useState, useEffect, useContext } from 'react';
import { Recycle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import styles from './EcoRecycleSort.module.css';
import { awardPoints } from '../../utils/api'; 
import UserContext from '../../context/UserContext';

// 2. Move constant data arrays OUTSIDE the component function
const recyclableItems = [
  { name: "Plastic Bottle", category: "plastic", image: "🍼" },
  { name: "Glass Jar", category: "glass", image: "🍯" },
  { name: "Paper Bag", category: "paper", image: "🛍️" },
  { name: "Aluminum Can", category: "metal", image: "🥤" },
  { name: "Cardboard Box", category: "paper", image: "📦" },
  { name: "Plastic Bag", category: "plastic", image: "🛒" },
  { name: "Newspaper", category: "paper", image: "📰" },
  { name: "Wine Bottle", category: "glass", image: "🍷" },
  { name: "Tin Can", category: "metal", image: "🥫" },
  { name: "Magazine", category: "paper", image: "📖" }
];

const nonRecyclableItems = [
  { name: "Pizza Box", category: "trash", image: "🍕" },
  { name: "Plastic Wrap", category: "trash", image: "🎁" },
  { name: "Styrofoam Cup", category: "trash", image: "☕" },
  { name: "Tissue Paper", category: "trash", image: "🧻" },
  { name: "Ceramic Plate", category: "trash", image: "🍽️" }
];

const bins = {
  plastic: { name: "Plastic", color: "blue", icon: "🔵" },
  glass: { name: "Glass", color: "green", icon: "🟢" },
  paper: { name: "Paper", color: "yellow", icon: "🟡" },
  metal: { name: "Metal", color: "red", icon: "🔴" },
  trash: { name: "Trash", color: "black", icon: "⚫" }
};

const EcoRecycleSort = () => {
  // 3. Get the refresh function from the context
  const { refreshStudentData } = useContext(UserContext);
  
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);

  // Initialize game on first load
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // 4. Use a SINGLE useEffect to handle game completion
  useEffect(() => {
    const saveFinalScore = async () => {
      // Check if the game is over and the user has scored points
      if (gameOver && score > 0) {
        console.log(`Game over! Final score: ${score}. Awarding points...`);
        // First, award the points to the backend
        await awardPoints(score);
        
        // Then, trigger the global refresh to update the dashboard
        console.log("Refreshing student data...");
        refreshStudentData(); 
      }
    };
    
    saveFinalScore();
    // This effect runs when `gameOver` changes, ensuring points are saved and data is refreshed
  }, [gameOver, score, refreshStudentData]);

  const initializeGame = () => {
    const gameItems = [...recyclableItems, ...nonRecyclableItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setItems(gameItems);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setCurrentItem(0);
  };

  const handleBinClick = (binCategory) => {
    if (gameOver) return;

    const item = items[currentItem];
    if (item.category === binCategory) {
      setScore(score + 10);
    }

    if (currentItem < items.length - 1) {
      setCurrentItem(currentItem + 1);
    } else {
      setGameOver(true);
    }
  };

  const getScoreMessage = () => {
    if (score >= 80) return "Excellent! You're a recycling expert! 🌟";
    if (score >= 60) return "Great job! Keep up the good work! 👍";
    if (score >= 40) return "Good effort! Learn more about recycling! 📚";
    return "Keep practicing! Every bit helps! ♻️";
  };

  if (items.length === 0) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>♻️ Eco Recycle Sort</h1>
          <p className={styles.subtitle}>Sort items into the correct recycling bins!</p>
          <div className={styles.scoreTimeContainer}>
            <div className={styles.scoreBox}>
              <span className={styles.scoreValue}>{score}</span>
              <span className={styles.scoreLabel}>Points</span>
            </div>
            <div className={styles.scoreBox}>
              <span className={styles.scoreValue}>{timeLeft}</span>
              <span className={styles.scoreLabel}>Seconds</span>
            </div>
            <button
              onClick={initializeGame}
              className={styles.restartButton}
            >
              <RotateCcw size={20} />
              Restart
            </button>
          </div>
        </div>

        {!gameOver ? (
          <div className={styles.gameCard}>
            <div className={styles.itemDisplay}>
              <div className={styles.itemEmoji}>{items[currentItem]?.image}</div>
              <h2 className={styles.itemName}>{items[currentItem]?.name}</h2>
              <p className={styles.instruction}>Drag or click the correct bin!</p>
            </div>

            <div className={styles.binsGrid}>
              {Object.entries(bins).map(([key, bin]) => (
                <button
                  key={key}
                  onClick={() => handleBinClick(key)}
                  className={styles.binButton}
                >
                  <div className={styles.binIcon}>{bin.icon}</div>
                  <div>{bin.name}</div>
                </button>
              ))}
            </div>

            <div className={styles.progressText}>
              Item {currentItem + 1} of {items.length}
            </div>
          </div>
        ) : (
          <div className={styles.gameOverCard}>
            <div className={styles.gameOverEmoji}>{score >= 60 ? '🎉' : '📚'}</div>
            <h2 className={styles.gameOverTitle}>Game Over!</h2>
            <p className={styles.gameOverMessage}>{getScoreMessage()}</p>
            <div className={styles.finalScore}>{score} / 100 Points</div>

            <div className={styles.tipsBox}>
              <h3 className={styles.tipsTitle}>💡 Recycling Tips:</h3>
              <ul className={styles.tipsList}>
                <li>Clean items before recycling</li>
                <li>Remove caps and lids from bottles</li>
                <li>Flatten cardboard boxes</li>
                <li>Check local recycling guidelines</li>
                <li>Avoid wishcycling (guessing what can be recycled)</li>
              </ul>
            </div>

            <button
              onClick={initializeGame}
              className={styles.playAgainButton}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoRecycleSort;
