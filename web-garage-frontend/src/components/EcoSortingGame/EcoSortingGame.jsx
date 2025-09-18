import React, { useState, useEffect } from 'react';
import { Leaf, Award, RotateCcw, Trash2, Recycle, Home } from 'lucide-react';

const EcoSortingGame = () => {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [feedback, setFeedback] = useState('');

  const wasteItems = [
    { name: 'Plastic Bottle', category: 'recycle', icon: '🥤', explanation: 'Plastic bottles can be recycled into new plastic products.' },
    { name: 'Banana Peel', category: 'compost', icon: '🍌', explanation: 'Organic waste like banana peels should go to compost.' },
    { name: 'Glass Jar', category: 'recycle', icon: '🍯', explanation: 'Glass can be recycled infinitely without loss of quality.' },
    { name: 'Paper Towel', category: 'compost', icon: '🧻', explanation: 'Used paper towels are organic and should be composted.' },
    { name: 'Aluminum Can', category: 'recycle', icon: '🥤', explanation: 'Aluminum cans are highly recyclable and save energy.' },
    { name: 'Styrofoam Cup', category: 'trash', icon: '☕', explanation: 'Styrofoam is not recyclable in most places and goes to landfill.' },
    { name: 'Cardboard Box', category: 'recycle', icon: '📦', explanation: 'Cardboard is one of the most recycled materials worldwide.' },
    { name: 'Apple Core', category: 'compost', icon: '🍎', explanation: 'Food waste breaks down naturally in compost.' },
    { name: 'Plastic Bag', category: 'trash', icon: '🛍️', explanation: 'Thin plastic bags often cannot be recycled and contaminate other recyclables.' },
    { name: 'Newspaper', category: 'recycle', icon: '📰', explanation: 'Paper products like newspapers are easily recycled.' }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledItems = [...wasteItems].sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    setCurrentItem(0);
    setScore(0);
    setGameComplete(false);
    setFeedback('');
  };

  const handleBinClick = (selectedCategory) => {
    const item = items[currentItem];
    if (item.category === selectedCategory) {
      setScore(prev => prev + 10);
      setFeedback(`✅ Correct! ${item.explanation}`);
    } else {
      setFeedback(`❌ Incorrect. ${item.explanation}`);
    }

    setTimeout(() => {
      if (currentItem < items.length - 1) {
        setCurrentItem(prev => prev + 1);
        setFeedback('');
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const bins = [
    {
      category: 'recycle',
      label: 'Recycle',
      icon: Recycle,
      color: '#10b981',
      bgColor: '#dcfce7'
    },
    {
      category: 'compost',
      label: 'Compost',
      icon: Leaf,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      category: 'trash',
      label: 'Trash',
      icon: Trash2,
      color: '#ef4444',
      bgColor: '#fee2e2'
    }
  ];

  if (gameComplete) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f3ff 100%)', padding: '1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', textAlign: 'center' }}>
            <Award style={{ width: '4rem', height: '4rem', color: '#eab308', margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '1rem' }}>
              Sorting Complete! 🎉
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Great job! You sorted all items and earned {score} eco-points!
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
        </div>
      </div>
    );
  }

  const currentWasteItem = items[currentItem];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f3ff 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
            🗂️ Eco Sorting Game
          </h1>
          <p style={{ color: '#6b7280' }}>Sort waste items into the correct bins!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <Award style={{ display: 'inline', width: '1rem', height: '1rem', color: '#16a34a' }} />
              <span style={{ marginLeft: '0.5rem', fontWeight: '500', color: '#15803d' }}>{score} points</span>
            </div>
            <div style={{ background: '#dbeafe', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <span style={{ fontWeight: '500', color: '#1e40af' }}>{currentItem + 1}/{items.length}</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{currentWasteItem?.icon}</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
              {currentWasteItem?.name}
            </h2>
            <p style={{ color: '#6b7280' }}>Where should this go?</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {bins.map((bin) => {
              const IconComponent = bin.icon;
              return (
                <button
                  key={bin.category}
                  onClick={() => handleBinClick(bin.category)}
                  disabled={!!feedback}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '2px solid #d1d5db',
                    background: bin.bgColor,
                    color: bin.color,
                    cursor: feedback ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: feedback ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!feedback) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!feedback) {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <IconComponent style={{ width: '2rem', height: '2rem' }} />
                  <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>{bin.label}</span>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              background: feedback.includes('Correct') ? '#dcfce7' : '#fee2e2',
              color: feedback.includes('Correct') ? '#15803d' : '#dc2626',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {feedback}
            </div>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#15803d', marginBottom: '1rem' }}>
            💡 Sorting Tips
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0f9f0', borderRadius: '0.5rem' }}>
              <Recycle style={{ width: '1.5rem', height: '1.5rem', color: '#10b981', marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: '600', color: '#15803d', marginBottom: '0.25rem' }}>Recycle</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0' }}>
                Plastics, paper, glass, and metals
              </p>
            </div>
            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
              <Leaf style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b', marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.25rem' }}>Compost</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0' }}>
                Food waste and yard trimmings
              </p>
            </div>
            <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem' }}>
              <Trash2 style={{ width: '1.5rem', height: '1.5rem', color: '#ef4444', marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: '600', color: '#dc2626', marginBottom: '0.25rem' }}>Trash</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0' }}>
                Non-recyclable and contaminated items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoSortingGame;
