import React, { useState, useEffect, useContext } from 'react';
import styles from './EcoFoodWasteGame.module.css';
import { Apple, RotateCcw, Clock, Target } from 'lucide-react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';

const EcoFoodWasteGame = () => {
  // 1. CONNECT to the context
  const { refreshStudentData } = useContext(UserContext);
  
  // 2. MANAGE game state
  const [foodItems, setFoodItems] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  const foodCategories = {
    fresh: { name: "Fresh Produce", color: "green", icon: "🥕" },
    grains: { name: "Grains & Bread", color: "yellow", icon: "🍞" },
    dairy: { name: "Dairy", color: "blue", icon: "🥛" },
    meat: { name: "Meat & Fish", color: "red", icon: "🥩" },
    packaged: { name: "Packaged Foods", color: "purple", icon: "🥫" }
  };

  const wasteReasons = [
    "Expired date",
    "Not used in time",
    "Over-purchased",
    "Poor storage",
    "Cooking too much"
  ];

  // Generate food items when round changes
  useEffect(() => {
    generateFoodItems();
  }, [currentRound]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
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

  const generateFoodItems = () => {
    const items = [];
    const categories = Object.keys(foodCategories);

    for (let i = 0; i < 8; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const wasteReason = wasteReasons[Math.floor(Math.random() * wasteReasons.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;

      items.push({
        id: i,
        category,
        name: getRandomFoodName(category),
        quantity,
        wasteReason,
        saved: false,
        wasted: false
      });
    }

    setFoodItems(items);
  };

  const getRandomFoodName = (category) => {
    const names = {
      fresh: ["Apples", "Bananas", "Carrots", "Lettuce", "Tomatoes", "Potatoes", "Onions", "Broccoli"],
      grains: ["Bread", "Rice", "Pasta", "Cereal", "Flour", "Oats", "Quinoa", "Bagels"],
      dairy: ["Milk", "Cheese", "Yogurt", "Butter", "Cream", "Eggs", "Ice Cream", "Sour Cream"],
      meat: ["Chicken", "Beef", "Fish", "Pork", "Turkey", "Bacon", "Sausage", "Tuna"],
      packaged: ["Canned Soup", "Chips", "Cookies", "Frozen Pizza", "Cereal Bars", "Peanut Butter", "Jam", "Pickles"]
    };
    return names[category][Math.floor(Math.random() * names[category].length)];
  };

  const handleFoodAction = (itemId, action) => {
    if (gameOver) return;

    setFoodItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          if (action === 'save') {
            setScore(prev => prev + 10);
            return { ...item, saved: true };
          } else if (action === 'waste') {
            setScore(prev => prev + 5);
            return { ...item, wasted: true };
          }
        }
        return item;
      })
    );
  };

  const nextRound = () => {
    if (currentRound < 5) {
      setCurrentRound(currentRound + 1);
      setTimeLeft(90);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(90);
    setGameOver(false);
    setCurrentRound(1);
    generateFoodItems();
  };

  const allItemsHandled = foodItems.every(item => item.saved || item.wasted);
  const savedItems = foodItems.filter(item => item.saved).length;
  const wastedItems = foodItems.filter(item => item.wasted).length;

  if (gameOver) {
    const efficiency = savedItems > 0 ? (savedItems / (savedItems + wastedItems)) * 100 : 0;

    return (
      <div className={styles.container}>
        <div className={styles.gameOverCard}>
          <div className={styles.gameOverIcon}>
            {efficiency >= 70 ? '🎉' : '🤔'}
          </div>
          <h2 className={styles.gameOverTitle}>Game Over!</h2>
          <div className={styles.finalScore}>{score} Points</div>
          <div className={styles.pointsEarned}>
            You earned {score} eco points!
          </div>
          <p className={styles.gameOverMessage}>
            You saved {savedItems} out of {savedItems + wastedItems} food items ({efficiency.toFixed(1)}% efficiency)
          </p>
          
          <div className={styles.finalStatsGrid}>
            <div className={styles.finalStat}>
              <div className={styles.statNumber}>{savedItems}</div>
              <div className={styles.statLabel}>Items Saved</div>
            </div>
            <div className={styles.finalStat}>
              <div className={styles.statNumber}>{wastedItems}</div>
              <div className={styles.statLabel}>Items Wasted</div>
            </div>
            <div className={styles.finalStat}>
              <div className={styles.statNumber}>{efficiency.toFixed(1)}%</div>
              <div className={styles.statLabel}>Efficiency</div>
            </div>
          </div>
          
          <div className={styles.tipsSection}>
            <h3 className={styles.tipsTitle}>Food Waste Prevention Tips:</h3>
            <ul className={styles.tipsList}>
              <li>Plan meals and make shopping lists</li>
              <li>Store food properly to extend freshness</li>
              <li>Use "first in, first out" inventory method</li>
              <li>Buy only what you need</li>
              <li>Compost food scraps when possible</li>
              <li>Use leftovers creatively</li>
            </ul>
          </div>
          
          <button onClick={resetGame} className={styles.playAgainButton}>
            <RotateCcw size={20} />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Eco Food Waste Game</h1>
        <div className={styles.titleIcon}>
          <Apple size={32} />
        </div>
        <p className={styles.subtitle}>Decide whether to save or waste food items to reduce food waste!</p>

        <div className={styles.statsBar}>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{score}</span>
            <span className={styles.statLabel}>Points</span>
          </div>
          <div className={styles.statBox}>
            <Clock className={styles.clockIcon} size={20} />
            <span className={styles.statValue}>{timeLeft}</span>
            <span className={styles.statLabel}>Seconds</span>
          </div>
          <div className={styles.statBox}>
            <Target className={styles.targetIcon} size={20} />
            <span className={styles.statValue}>Round {currentRound}/5</span>
          </div>
        </div>
      </div>

      <div className={styles.foodGrid}>
        {foodItems.map((item) => (
          <div key={item.id} className={`${styles.foodItem} ${
            item.saved ? styles.savedItem :
            item.wasted ? styles.wastedItem :
            styles.activeItem
          }`}>
            <div className={styles.foodHeader}>
              <div className={styles.foodIcon}>
                {foodCategories[item.category].icon}
              </div>
              <div className={styles.foodInfo}>
                <div className={styles.foodName}>{item.name}</div>
                <div className={styles.foodQuantity}>
                  {item.quantity} {item.quantity > 1 ? 'items' : 'item'}
                </div>
                <div className={styles.foodCategory}>
                  {foodCategories[item.category].name}
                </div>
              </div>
            </div>

            <div className={styles.wasteReason}>
              Reason: {item.wasteReason}
            </div>

            {!item.saved && !item.wasted && (
              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleFoodAction(item.id, 'save')}
                  className={styles.saveButton}
                >
                  Save
                </button>
                <button
                  onClick={() => handleFoodAction(item.id, 'waste')}
                  className={styles.wasteButton}
                >
                  Waste
                </button>
              </div>
            )}

            {item.saved && (
              <div className={styles.savedIndicator}>
                ✓ Saved!
              </div>
            )}

            {item.wasted && (
              <div className={styles.wastedIndicator}>
                ✗ Wasted
              </div>
            )}
          </div>
        ))}
      </div>

      {allItemsHandled && (
        <div className={styles.nextRoundSection}>
          <button onClick={nextRound} className={styles.nextRoundButton}>
            Next Round
          </button>
        </div>
      )}

      <div className={styles.howToPlay}>
        <h3 className={styles.howToPlayTitle}>How to Play:</h3>
        <div className={styles.instructions}>
          <div className={styles.instruction}>
            <strong>Save:</strong> Choose items that can still be used or repurposed
          </div>
          <div className={styles.instruction}>
            <strong>Waste:</strong> Choose items that are truly spoiled or unusable
          </div>
          <div className={styles.instruction}>
            <strong>Goal:</strong> Maximize saved food to reduce waste
          </div>
          <div className={styles.instruction}>
            <strong>Tip:</strong> Consider composting and creative cooking!
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoFoodWasteGame;