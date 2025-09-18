import React, { useState, useEffect } from 'react';
import { Leaf, Award, RotateCcw } from 'lucide-react';
import styles from './EcoPuzzle.module.css';

const EcoPuzzle = () => {
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const puzzleData = [
    { id: 1, image: '🌳', correctPosition: 0 },
    { id: 2, image: '🌱', correctPosition: 1 },
    { id: 3, image: '🌿', correctPosition: 2 },
    { id: 4, image: '🌸', correctPosition: 3 },
    { id: 5, image: '🌻', correctPosition: 4 },
    { id: 6, image: '🌺', correctPosition: 5 },
    { id: 7, image: '🌼', correctPosition: 6 },
    { id: 8, image: '🌹', correctPosition: 7 },
    { id: 9, image: '🌷', correctPosition: 8 }
  ];

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const shuffled = [...puzzleData].sort(() => Math.random() - 0.5);
    setPuzzlePieces(shuffled.map((piece, index) => ({ ...piece, currentPosition: index })));
    setCompleted(false);
    setScore(0);
  };

  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedPiece) return;

    const newPieces = [...puzzlePieces];
    const draggedIndex = newPieces.findIndex(p => p.id === draggedPiece.id);
    const targetPiece = newPieces[targetIndex];

    // Swap positions
    newPieces[draggedIndex].currentPosition = targetIndex;
    newPieces[targetIndex].currentPosition = draggedIndex;

    // Swap in array
    [newPieces[draggedIndex], newPieces[targetIndex]] = [newPieces[targetIndex], newPieces[draggedIndex]];

    setPuzzlePieces(newPieces);
    setDraggedPiece(null);

    // Check if puzzle is complete
    const isComplete = newPieces.every(piece => piece.currentPosition === piece.correctPosition);
    if (isComplete) {
      setCompleted(true);
      setScore(prev => prev + 100);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            🌱 Eco Puzzle
          </h1>
          <p className={styles.subtitle}>Arrange the plants to complete the garden!</p>
          <div className={styles.scoreContainer}>
            <div className={styles.scoreBox}>
              <Award style={{ display: 'inline', width: '1rem', height: '1rem', color: '#16a34a' }} />
              <span className={styles.scoreValue}>{score} points</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '24rem', margin: '0 auto' }}>
            {puzzlePieces.map((piece, index) => (
              <div
                key={piece.id}
                draggable
                onDragStart={(e) => handleDragStart(e, piece)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                style={{
                  width: '6rem',
                  height: '6rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  cursor: 'move',
                  background: completed ? '#dcfce7' : '#f9fafb',
                  transition: 'all 0.2s'
                }}
              >
                {piece.image}
              </div>
            ))}
          </div>
        </div>

        {completed && (
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', textAlign: 'center' }}>
            <Award style={{ width: '4rem', height: '4rem', color: '#eab308', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginBottom: '1rem' }}>
              Puzzle Complete! 🎉
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Great job! You've arranged the garden perfectly and earned 100 eco-points!
            </p>
            <button
              onClick={initializePuzzle}
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

export default EcoPuzzle;
