import React, { useState, useEffect, useContext } from 'react';
import { Leaf, Award, RotateCcw, Puzzle, Brain, Search, Trash2, Trophy, Sun } from 'lucide-react';
import styles from './EcoPuzzle.module.css';
import { awardPoints } from '../../utils/api'; // Your centralized API function
import UserContext from '../../context/UserContext'; // The context to refresh data

const EcoPuzzle = () => {
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // --- 1. Get the refresh function from the context ---
  const { refreshStudentData } = useContext(UserContext);

  const puzzleData = [
    { id: 1, image: '🌳', correctPosition: 0 }, { id: 2, image: '🌱', correctPosition: 1 },
    { id: 3, image: '🌿', correctPosition: 2 }, { id: 4, image: '🌸', correctPosition: 3 },
    { id: 5, image: '🌻', correctPosition: 4 }, { id: 6, image: '🌺', correctPosition: 5 },
    { id: 7, image: '🌼', correctPosition: 6 }, { id: 8, image: '🌹', correctPosition: 7 },
    { id: 9, image: '🌷', correctPosition: 8 }
  ];

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const shuffled = [...puzzleData].sort(() => Math.random() - 0.5);
    setPuzzlePieces(shuffled);
    setCompleted(false);
    setScore(0);
  };

  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (!draggedPiece) return;

    const newPieces = [...puzzlePieces];
    const draggedIndex = newPieces.findIndex(p => p.id === draggedPiece.id);
    
    // Swap the pieces
    [newPieces[draggedIndex], newPieces[targetIndex]] = [newPieces[targetIndex], newPieces[draggedIndex]];

    setPuzzlePieces(newPieces);
    setDraggedPiece(null);

    // Check if the puzzle is now complete
    const isComplete = newPieces.every((p, i) => p.correctPosition === i);

    if (isComplete) {
      setCompleted(true);
      const pointsToAward = 25;
      setScore(pointsToAward);

      try {
        // --- 2. Await the API call to save points to the database ---
        const response = await awardPoints(pointsToAward);

        if (response) {
          console.log(`API Success: Awarded ${pointsToAward} points. New total: ${response.newTotalPoints}`);
          
          // --- 3. CRUCIAL STEP: Refresh the global user data ---
          // This tells your entire app (including the dashboard) to get the new points total.
          await refreshStudentData();
          console.log("UI Refresh Triggered: Student data has been updated.");
        }
      } catch (error) {
        console.error("Failed to award points or refresh data:", error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}><Leaf size={28} /> Eco Puzzle</h1>
          <p className={styles.subtitle}>Arrange the plants to complete the garden!</p>
          <div className={styles.scoreContainer}>
            <div className={styles.scoreBox}>
              <Award size={16} />
              <span className={styles.scoreValue}>{score} points</span>
            </div>
          </div>
        </div>

        <div className={styles.puzzleBoard}>
          {puzzlePieces.map((piece, index) => (
            <div
              key={piece.id}
              draggable={!completed}
              onDragStart={(e) => handleDragStart(e, piece)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className={`${styles.puzzlePiece} ${completed ? styles.completed : ''}`}
            >
              {piece.image}
            </div>
          ))}
        </div>

        {completed && (
          <div className={styles.completionModal}>
            <Award className={styles.completionIcon} />
            <h2 className={styles.completionTitle}>Puzzle Complete! 🎉</h2>
            <p className={styles.completionText}>
              Great job! You've arranged the garden perfectly and earned {score} eco-points!
            </p>
            <button onClick={initializePuzzle} className={styles.playAgainButton}>
              <RotateCcw size={18} />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoPuzzle;
