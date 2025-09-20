import React, { useState, useEffect, useContext } from 'react';
import styles from './EcoWasteAudit.module.css';
import { Trash2, Recycle, Plus, Minus, RotateCcw, BarChart3 } from 'lucide-react';
import UserContext from '../../context/UserContext';
import { awardPoints } from '../../utils/api';

const EcoWasteAudit = () => {
  // 1. CONNECT to the context
  const { refreshStudentData } = useContext(UserContext);
  
  // 2. MANAGE game state
  const [score, setScore] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [wasteItems, setWasteItems] = useState([
    { category: 'Plastic', amount: 0, unit: 'kg', recyclable: true },
    { category: 'Paper', amount: 0, unit: 'kg', recyclable: true },
    { category: 'Glass', amount: 0, unit: 'kg', recyclable: true },
    { category: 'Metal', amount: 0, unit: 'kg', recyclable: true },
    { category: 'Organic', amount: 0, unit: 'kg', recyclable: false },
    { category: 'Other', amount: 0, unit: 'kg', recyclable: false }
  ]);

  // 3. SAVE score when the audit is complete
  useEffect(() => {
    const saveFinalScore = async () => {
      if (auditComplete && score > 0) {
        await awardPoints(score);
        refreshStudentData();
      }
    };
    saveFinalScore();
  }, [auditComplete, score, refreshStudentData]);

  const updateAmount = (index, change) => {
    const newItems = [...wasteItems];
    newItems[index].amount = Math.max(0, newItems[index].amount + change);
    setWasteItems(newItems);
  };

  const calculateTotals = () => {
    const totalWaste = wasteItems.reduce((sum, item) => sum + item.amount, 0);
    const recyclableWaste = wasteItems
      .filter(item => item.recyclable)
      .reduce((sum, item) => sum + item.amount, 0);
    const nonRecyclableWaste = totalWaste - recyclableWaste;
    const recyclingRate = totalWaste > 0 ? (recyclableWaste / totalWaste) * 100 : 0;

    return { totalWaste, recyclableWaste, nonRecyclableWaste, recyclingRate };
  };

  const generateRecommendations = (stats) => {
    const recs = [];

    if (stats.recyclingRate < 50) {
      recs.push("Consider recycling more paper and cardboard");
      recs.push("Set up separate bins for different waste types");
    }

    if (wasteItems.find(item => item.category === 'Plastic').amount > 5) {
      recs.push("Reduce single-use plastic consumption");
      recs.push("Choose reusable alternatives for plastic items");
    }

    if (wasteItems.find(item => item.category === 'Organic').amount > 3) {
      recs.push("Start composting organic waste");
      recs.push("Use food scraps for garden compost");
    }

    if (stats.totalWaste > 10) {
      recs.push("Track waste for a week to identify reduction opportunities");
      recs.push("Buy products with less packaging");
    }

    return recs.length > 0 ? recs : ["Great job! Your waste management is excellent. Keep it up!"];
  };

  const completeAudit = () => {
    const stats = calculateTotals();
    const recs = generateRecommendations(stats);
    setRecommendations(recs);
    // Award 10 points per 1kg recycled, minimum 10 points for completing
    const points = Math.max(10, Math.round(stats.recyclableWaste * 10));
    setScore(points);
    setAuditComplete(true);
  };

  const resetAudit = () => {
    setWasteItems(wasteItems.map(item => ({ ...item, amount: 0 })));
    setAuditComplete(false);
    setRecommendations([]);
    setScore(0);
  };

  const stats = calculateTotals();

  if (auditComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <div className={styles.resultHeader}>
            <div className={styles.resultIcon}>
              <BarChart3 size={48} />
            </div>
            <h2 className={styles.resultTitle}>Waste Audit Complete!</h2>
            <div className={styles.pointsEarned}>You earned {score} eco points!</div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.totalWaste.toFixed(1)}</div>
              <div className={styles.statLabel}>Total Waste (kg)</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.recyclableWaste.toFixed(1)}</div>
              <div className={styles.statLabel}>Recyclable (kg)</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.nonRecyclableWaste.toFixed(1)}</div>
              <div className={styles.statLabel}>Non-recyclable (kg)</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.recyclingRate.toFixed(1)}%</div>
              <div className={styles.statLabel}>Recycling Rate</div>
            </div>
          </div>

          <div className={styles.breakdown}>
            <h3 className={styles.breakdownTitle}>Waste Breakdown</h3>
            <div className={styles.breakdownList}>
              {wasteItems.map((item) => (
                <div key={item.category} className={styles.breakdownItem}>
                  <div className={styles.breakdownLeft}>
                    {item.recyclable ? (
                      <Recycle className={styles.recycleIcon} size={16} />
                    ) : (
                      <Trash2 className={styles.trashIcon} size={16} />
                    )}
                    <span className={styles.breakdownCategory}>{item.category}</span>
                  </div>
                  <span className={styles.breakdownAmount}>{item.amount} kg</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.recommendations}>
            <h3 className={styles.recommendationsTitle}>Recommendations</h3>
            <div className={styles.recommendationsList}>
              {recommendations.map((rec, index) => (
                <div key={index} className={styles.recommendationItem}>
                  <span className={styles.recommendationBullet}></span>
                  <span className={styles.recommendationText}>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={resetAudit} className={styles.resetButton}>
            <RotateCcw size={20} />
            Start New Audit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Eco Waste Audit</h1>
        <div className={styles.titleIcon}>
          <BarChart3 size={32} />
        </div>
        <p className={styles.subtitle}>Track and analyze your household waste to improve recycling habits!</p>
      </div>

      <div className={styles.trackingCard}>
        <div className={styles.trackingHeader}>
          <h2 className={styles.trackingTitle}>Weekly Waste Tracking</h2>
          <p className={styles.trackingSubtitle}>
            Estimate how much waste you generate in each category per week:
          </p>
        </div>

        <div className={styles.wasteGrid}>
          {wasteItems.map((item, index) => (
            <div key={item.category} className={styles.wasteItem}>
              <div className={styles.wasteHeader}>
                <div className={styles.wasteInfo}>
                  {item.recyclable ? (
                    <Recycle className={styles.recycleIcon} size={20} />
                  ) : (
                    <Trash2 className={styles.trashIcon} size={20} />
                  )}
                  <span className={styles.wasteName}>{item.category}</span>
                </div>
                <span className={`${styles.wasteBadge} ${
                  item.recyclable ? styles.recyclableBadge : styles.nonRecyclableBadge
                }`}>
                  {item.recyclable ? 'Recyclable' : 'Non-recyclable'}
                </span>
              </div>

              <div className={styles.wasteControls}>
                <button
                  onClick={() => updateAmount(index, -0.5)}
                  className={styles.decreaseButton}
                >
                  <Minus size={16} />
                </button>

                <div className={styles.amountDisplay}>
                  <div className={styles.amountValue}>{item.amount}</div>
                  <div className={styles.amountUnit}>{item.unit}</div>
                </div>

                <button
                  onClick={() => updateAmount(index, 0.5)}
                  className={styles.increaseButton}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.completeSection}>
          <button onClick={completeAudit} className={styles.completeButton}>
            Complete Waste Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcoWasteAudit;