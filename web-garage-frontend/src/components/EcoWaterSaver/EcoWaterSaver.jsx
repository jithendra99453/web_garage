import React, { useState, useEffect, useContext } from 'react';
import { Droplet, Zap, RefreshCw } from 'lucide-react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';
import styles from './EcoWaterSaver.module.css';

const EcoWaterSaver = () => {
  const { refreshStudentData } = useContext(UserContext);
  const [waterUsed, setWaterUsed] = useState(0);
  const [goal, setGoal] = useState(100); // liters per day goal
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setGameOver(true);
      if (waterUsed <= goal) {
        setFeedback('Great job! You saved water today! 💧');
        setScore(10); // Award 10 points for saving water
      } else {
        setFeedback('Try to reduce your water usage next time! 🚿');
        setScore(0);
      }
    }
  }, [timer, gameOver, waterUsed, goal]);

  // Award eco points and refresh dashboard when game is over and user saved water
  useEffect(() => {
    if (gameOver && score > 0) {
      awardPoints(score).then(() => {
        refreshStudentData();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

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
    setScore(0);
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
            <div className={styles.score}>Eco Points: {score}</div>
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
