import React, { useState, useEffect } from 'react';
import { Droplet, Zap, RefreshCw } from 'lucide-react';
import styles from './EcoWaterSaver.module.css';

const EcoWaterSaver = () => {
  const [waterUsed, setWaterUsed] = useState(0);
  const [goal, setGoal] = useState(100); // liters per day goal
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setGameOver(true);
      if (waterUsed <= goal) {
        setFeedback('Great job! You saved water today! 💧');
      } else {
        setFeedback('Try to reduce your water usage next time! 🚿');
      }
    }
  }, [timer, gameOver, waterUsed, goal]);

  const handleUseWater = () => {
    if (gameOver) return;
    setWaterUsed(prev => prev + 5);
  };

  const handleSaveWater = () => {
    if (gameOver) return;
    setWaterUsed(prev => (prev - 3 >= 0 ? prev - 3 : 0));
  };

  const resetGame = () => {
    setWaterUsed(0);
    setTimer(60);
    setGameOver(false);
    setFeedback('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <Droplet size={36} /> Eco Water Saver
      </h1>
      <p className={styles.subtitle}>Try to keep your water usage below {goal} liters in 60 seconds!</p>

      <div className={styles.card}>
        <div className={styles.iconLarge}>
          <Droplet />
        </div>
        <div className={styles.waterUsed}>{waterUsed} L</div>
        <div className={styles.waterLabel}>Water Used</div>

        <div className={styles.buttons}>
          <button
            onClick={handleUseWater}
            className={styles.buttonUse}
          >
            <Zap size={20} /> Use Water
          </button>
          <button
            onClick={handleSaveWater}
            className={styles.buttonSave}
          >
            <Droplet size={20} /> Save Water
          </button>
        </div>

        <div className={styles.timer}>Time Left: {timer} seconds</div>

        {gameOver && (
          <>
            <div className={styles.feedback}>{feedback}</div>
            <button
              onClick={resetGame}
              className={styles.playAgainButton}
            >
              <RefreshCw size={20} />
              Play Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EcoWaterSaver;
