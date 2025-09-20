import React, { useState, useEffect, useContext } from 'react';
import styles from './EcoClimateChallenge.module.css';
import { Thermometer, CloudRain, RotateCcw, Zap } from 'lucide-react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';

const EcoClimateChallenge = () => {
  // 1. CONNECT to the context
  const { refreshStudentData } = useContext(UserContext);
  
  // 2. MANAGE game state
  const [temperature, setTemperature] = useState(15);
  const [co2Level, setCo2Level] = useState(400);
  const [actions, setActions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);

  // Game data
  const climateActions = [
    { id: 1, name: "Plant Trees", icon: "🌳", tempEffect: -0.5, co2Effect: -20, points: 50 },
    { id: 2, name: "Use Solar Power", icon: "☀️", tempEffect: -0.3, co2Effect: -15, points: 40 },
    { id: 3, name: "Reduce Driving", icon: "🚗", tempEffect: -0.4, co2Effect: -25, points: 45 },
    { id: 4, name: "Recycle More", icon: "♻️", tempEffect: -0.2, co2Effect: -10, points: 30 },
    { id: 5, name: "Save Energy", icon: "💡", tempEffect: -0.3, co2Effect: -12, points: 35 },
    { id: 6, name: "Go Vegetarian", icon: "🥕", tempEffect: -0.6, co2Effect: -30, points: 55 }
  ];

  // Timer Effect
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // Simulate gradual climate change progression
        setTemperature(prev => prev + 0.01);
        setCo2Level(prev => prev + 0.5);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // 3. SAVE score when the game ends
  useEffect(() => {
    const saveFinalScore = async () => {
      if (gameOver && score > 0) {
        await awardPoints(score);
        refreshStudentData();
      }
    };
    saveFinalScore();
  }, [gameOver, score, refreshStudentData]);

  const performAction = (action) => {
    if (gameOver) return;

    setActions([...actions, action]);
    setTemperature(prev => Math.max(10, prev + action.tempEffect));
    setCo2Level(prev => Math.max(350, prev + action.co2Effect));
    setScore(prev => prev + action.points);
  };

  const getClimateStatus = () => {
    if (temperature < 14) return { status: "Cooling", color: styles.cooling, icon: "❄️" };
    if (temperature < 16) return { status: "Stable", color: styles.stable, icon: "✅" };
    if (temperature < 18) return { status: "Warming", color: styles.warning, icon: "🌡️" };
    return { status: "Critical", color: styles.critical, icon: "🔥" };
  };

  const resetGame = () => {
    setTemperature(15);
    setCo2Level(400);
    setActions([]);
    setScore(0);
    setTimeLeft(120);
    setGameOver(false);
  };

  const climateStatus = getClimateStatus();

  if (gameOver) {
    return (
      <div className={styles.container}>
        <div className={styles.gameOverModal}>
          <div className={styles.gameOverIcon}>
            {temperature < 16 ? '🎉' : '⚠️'}
          </div>
          <h2 className={styles.gameOverTitle}>Time's Up!</h2>
          <p className={styles.gameOverMessage}>
            {temperature < 16
              ? "Excellent work! You helped stabilize the climate!"
              : "The climate is still warming. Try taking more actions next time!"
            }
          </p>
          <div className={styles.finalScoreDisplay}>{score} Points</div>
          <div className={styles.pointsEarned}>
            You earned {score} eco points!
          </div>
          <div className={styles.finalStats}>
            <h3 className={styles.finalStatsTitle}>Final Climate State:</h3>
            <div className={styles.finalStatsGrid}>
              <div className={styles.finalStat}>
                <span>Temperature:</span>
                <span>{temperature.toFixed(1)}°C</span>
              </div>
              <div className={styles.finalStat}>
                <span>CO₂ Level:</span>
                <span>{co2Level.toFixed(0)} ppm</span>
              </div>
              <div className={styles.finalStat}>
                <span>Actions Taken:</span>
                <span>{actions.length}</span>
              </div>
            </div>
          </div>
          <button onClick={resetGame} className={styles.playAgainButton}>
            <RotateCcw size={18} />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Eco Climate Challenge</h1>
        <div className={styles.titleIcon}>
          <Thermometer size={32} />
        </div>
        <p className={styles.subtitle}>Take action to combat climate change before time runs out!</p>
        
        <div className={styles.statsBar}>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{score}</span>
            <span className={styles.statLabel}>Points</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{timeLeft}</span>
            <span className={styles.statLabel}>Seconds</span>
          </div>
          <button onClick={resetGame} className={styles.resetButton}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className={styles.gameGrid}>
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Climate Dashboard</h2>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <Thermometer className={styles.tempIcon} size={24} />
                <span>Temperature</span>
              </div>
              <div className={styles.metricValue}>
                <div className={styles.valueNumber}>{temperature.toFixed(1)}°C</div>
                <div className={`${styles.valueStatus} ${climateStatus.color}`}>
                  {climateStatus.icon} {climateStatus.status}
                </div>
              </div>
            </div>

            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <CloudRain className={styles.co2Icon} size={24} />
                <span>CO₂ Level</span>
              </div>
              <div className={styles.metricValue}>
                <div className={styles.valueNumber}>{co2Level.toFixed(0)} ppm</div>
                <div className={styles.valueStatus}>Atmospheric CO₂</div>
              </div>
            </div>
          </div>

          <div className={styles.actionsLog}>
            <h3 className={styles.logTitle}>Recent Actions:</h3>
            <div className={styles.actionsList}>
              {actions.length === 0 ? (
                <p className={styles.noActions}>No actions taken yet</p>
              ) : (
                actions.slice(-5).map((action, index) => (
                  <div key={index} className={styles.actionItem}>
                    <span className={styles.actionIcon}>{action.icon}</span>
                    <span className={styles.actionName}>{action.name}</span>
                    <span className={styles.actionPoints}>+{action.points}pts</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.actionsCard}>
          <h2 className={styles.cardTitle}>Climate Actions</h2>
          <div className={styles.actionsGrid}>
            {climateActions.map((action) => (
              <button
                key={action.id}
                onClick={() => performAction(action)}
                disabled={gameOver}
                className={styles.actionButton}
              >
                <div className={styles.buttonIcon}>{action.icon}</div>
                <div className={styles.buttonName}>{action.name}</div>
                <div className={styles.buttonPoints}>+{action.points} pts</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoClimateChallenge;