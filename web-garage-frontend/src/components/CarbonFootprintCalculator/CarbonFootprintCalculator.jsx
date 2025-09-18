import React, { useState } from 'react';
import { Calculator, Leaf, Car, Home, Zap, Utensils } from 'lucide-react';
import styles from './CarbonFootprintCalculator.module.css';

const CarbonFootprintCalculator = () => {
  const [answers, setAnswers] = useState({
    transportation: '',
    home: '',
    diet: '',
    consumption: ''
  });
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const questions = {
    transportation: {
      title: "Daily Transportation",
      icon: Car,
      options: [
        { value: 0, label: "Walk/Bike/Carpool (0 kg CO₂)", points: 0 },
        { value: 2.4, label: "Public Transport (2.4 kg CO₂)", points: 2.4 },
        { value: 4.6, label: "Electric Vehicle (4.6 kg CO₂)", points: 4.6 },
        { value: 8.2, label: "Gas Car (8.2 kg CO₂)", points: 8.2 }
      ]
    },
    home: {
      title: "Home Energy Use",
      icon: Home,
      options: [
        { value: 5, label: "Energy Efficient (5 kg CO₂)", points: 5 },
        { value: 12, label: "Average Home (12 kg CO₂)", points: 12 },
        { value: 20, label: "High Energy Use (20 kg CO₂)", points: 20 }
      ]
    },
    diet: {
      title: "Daily Diet",
      icon: Utensils,
      options: [
        { value: 1.5, label: "Plant-based (1.5 kg CO₂)", points: 1.5 },
        { value: 3.2, label: "Vegetarian (3.2 kg CO₂)", points: 3.2 },
        { value: 5.8, label: "Mixed Diet (5.8 kg CO₂)", points: 5.8 },
        { value: 8.5, label: "Meat-heavy (8.5 kg CO₂)", points: 8.5 }
      ]
    },
    consumption: {
      title: "Shopping Habits",
      icon: Zap,
      options: [
        { value: 2, label: "Minimal Shopping (2 kg CO₂)", points: 2 },
        { value: 5, label: "Average Shopping (5 kg CO₂)", points: 5 },
        { value: 10, label: "Frequent Shopping (10 kg CO₂)", points: 10 }
      ]
    }
  };

  const calculateFootprint = () => {
    const total = Object.values(answers).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    const weekly = total * 7;
    const monthly = total * 30;
    const yearly = total * 365;

    let assessment = '';
    let tips = [];

    if (total < 10) {
      assessment = 'Excellent! Your carbon footprint is very low.';
      tips = ['Keep up the great work!', 'Consider sharing your sustainable habits with others.'];
    } else if (total < 20) {
      assessment = 'Good! You have a moderate carbon footprint.';
      tips = ['Try reducing meat consumption', 'Use public transport more often', 'Conserve energy at home'];
    } else {
      assessment = 'Your carbon footprint could be reduced.';
      tips = ['Switch to plant-based meals', 'Use electric vehicles or public transport', 'Reduce energy consumption', 'Buy less, choose quality over quantity'];
    }

    setResult({
      daily: total.toFixed(1),
      weekly: weekly.toFixed(1),
      monthly: monthly.toFixed(1),
      yearly: yearly.toFixed(1),
      assessment,
      tips
    });
    setShowResult(true);
  };

  const handleAnswerChange = (category, value) => {
    setAnswers(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const resetCalculator = () => {
    setAnswers({
      transportation: '',
      home: '',
      diet: '',
      consumption: ''
    });
    setResult(null);
    setShowResult(false);
  };

  const allAnswered = Object.values(answers).every(answer => answer !== '');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>🌍 Carbon Footprint Calculator</h1>
          <p className={styles.subtitle}>Calculate your daily environmental impact</p>
        </div>

        {!showResult ? (
          <div className={styles.card}>
            <div className={styles.questionGrid}>
              {Object.entries(questions).map(([key, question]) => {
                const IconComponent = question.icon;
                return (
                  <div key={key} className={styles.questionSection}>
                    <div className={styles.questionHeader}>
                      <IconComponent className={styles.questionIcon} size={24} />
                      <h3 className={styles.questionTitle}>{question.title}</h3>
                    </div>
                    <div>
                      {question.options.map((option, index) => (
                        <label key={index} className={`${styles.option} ${answers[key] === option.points.toString() ? styles.selected : ''}`}>
                          <input
                            type="radio"
                            name={key}
                            value={option.points}
                            checked={answers[key] === option.points.toString()}
                            onChange={(e) => handleAnswerChange(key, e.target.value)}
                            className={styles.radio}
                          />
                          <span className={styles.optionLabel}>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.btnCenter}>
              <button
                onClick={calculateFootprint}
                disabled={!allAnswered}
                className={styles.calculateBtn}
              >
                <Calculator size={20} />
                Calculate My Footprint
              </button>
              {!allAnswered && (
                <p className={styles.helpText}>Please answer all questions to calculate</p>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <Leaf className={styles.resultIcon} size={48} />
              <h2 className={styles.resultTitle}>Your Carbon Footprint</h2>
            </div>

            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.statDaily}`}>
                <div className={styles.statValue}>{result.daily}</div>
                <div className={styles.statLabel}>kg CO₂/day</div>
              </div>
              <div className={`${styles.statCard} ${styles.statWeekly}`}>
                <div className={styles.statValue}>{result.weekly}</div>
                <div className={styles.statLabel}>kg CO₂/week</div>
              </div>
              <div className={`${styles.statCard} ${styles.statMonthly}`}>
                <div className={styles.statValue}>{result.monthly}</div>
                <div className={styles.statLabel}>kg CO₂/month</div>
              </div>
              <div className={`${styles.statCard} ${styles.statYearly}`}>
                <div className={styles.statValue}>{result.yearly}</div>
                <div className={styles.statLabel}>kg CO₂/year</div>
              </div>
            </div>

            <div className={styles.assessment}>
              <h3 className={styles.assessmentTitle}>Assessment</h3>
              <p className={styles.assessmentText}>{result.assessment}</p>
            </div>

            <div className={styles.tips}>
              <h3 className={styles.tipsTitle}>💡 Improvement Tips</h3>
              <ul className={styles.tipsList}>
                {result.tips.map((tip, index) => (
                  <li key={index} className={styles.tipsItem}>
                    <span className={styles.tipsBullet}>•</span>
                    <span className={styles.tipsText}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.btnCenter}>
              <button
                onClick={resetCalculator}
                className={styles.resetBtn}
              >
                Calculate Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonFootprintCalculator;
