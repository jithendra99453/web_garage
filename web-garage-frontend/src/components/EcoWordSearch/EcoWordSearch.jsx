import React, { useState, useEffect } from 'react';
import { Leaf, Award, RotateCcw, Search } from 'lucide-react';

const EcoWordSearch = () => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const wordList = [
    'RECYCLE', 'SOLAR', 'WIND', 'WATER', 'TREE', 'EARTH', 'GREEN', 'ECO',
    'CLIMATE', 'CARBON', 'OCEAN', 'FOREST', 'BIOME', 'HABITAT', 'SUSTAIN'
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newGrid = createGrid();
    const placedWords = placeWords(newGrid);
    setGrid(newGrid);
    setWords(placedWords);
    setFoundWords([]);
    setSelectedCells([]);
    setScore(0);
    setGameComplete(false);
  };

  const createGrid = () => {
    const grid = [];
    for (let i = 0; i < 15; i++) {
      grid[i] = [];
      for (let j = 0; j < 15; j++) {
        grid[i][j] = { letter: '', isSelected: false, isFound: false };
      }
    }
    return grid;
  };

  const placeWords = (grid) => {
    const placedWords = [];
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1] // right, down, diagonal down-right, diagonal down-left
    ];

    wordList.forEach(word => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * 15);
        const startCol = Math.floor(Math.random() * 15);

        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
          placeWord(grid, word, startRow, startCol, direction);
          placedWords.push({
            word,
            startRow,
            startCol,
            direction,
            endRow: startRow + direction[0] * (word.length - 1),
            endCol: startCol + direction[1] * (word.length - 1)
          });
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (grid[i][j].letter === '') {
          grid[i][j].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return placedWords;
  };

  const canPlaceWord = (grid, word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction[0] * i;
      const newCol = col + direction[1] * i;

      if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
        return false;
      }

      if (grid[newRow][newCol].letter !== '' && grid[newRow][newCol].letter !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction[0] * i;
      const newCol = col + direction[1] * i;
      grid[newRow][newCol].letter = word[i];
    }
  };

  const handleCellClick = (row, col) => {
    const newSelectedCells = [...selectedCells];
    const cellIndex = newSelectedCells.findIndex(cell => cell.row === row && cell.col === col);

    if (cellIndex > -1) {
      newSelectedCells.splice(cellIndex, 1);
    } else {
      newSelectedCells.push({ row, col });
    }

    setSelectedCells(newSelectedCells);

    // Check if selected cells form a word
    if (newSelectedCells.length >= 3) {
      checkForWord(newSelectedCells);
    }
  };

  const checkForWord = (cells) => {
    const sortedCells = [...cells].sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    const word = sortedCells.map(cell => grid[cell.row][cell.col].letter).join('');

    const foundWord = words.find(w => w.word === word && !foundWords.includes(word));
    if (foundWord) {
      setFoundWords(prev => [...prev, word]);
      setScore(prev => prev + word.length * 5);
      setSelectedCells([]);

      // Mark cells as found
      const newGrid = [...grid];
      sortedCells.forEach(cell => {
        newGrid[cell.row][cell.col].isFound = true;
      });
      setGrid(newGrid);
    }
  };

  useEffect(() => {
    if (foundWords.length === words.length) {
      setGameComplete(true);
    }
  }, [foundWords, words]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f3ff 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
            🔍 Eco Word Search
          </h1>
          <p style={{ color: '#6b7280' }}>Find environmental words in the grid!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <Award style={{ display: 'inline', width: '1rem', height: '1rem', color: '#16a34a' }} />
              <span style={{ marginLeft: '0.5rem', fontWeight: '500', color: '#15803d' }}>{score} points</span>
            </div>
            <div style={{ background: '#dbeafe', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <span style={{ fontWeight: '500', color: '#1e40af' }}>{foundWords.length}/{words.length} found</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '2px', maxWidth: '400px', margin: '0 auto' }}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '1px solid #d1d5db',
                        borderRadius: '2px',
                        background: cell.isFound ? '#dcfce7' :
                                   selectedCells.some(s => s.row === rowIndex && s.col === colIndex) ? '#dbeafe' : '#f9fafb',
                        color: cell.isFound ? '#15803d' : '#374151',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {cell.letter}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div style={{ flex: '1', minWidth: '250px' }}>
            <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#15803d', marginBottom: '1rem' }}>
                Words to Find:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                {words.map((wordObj, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      background: foundWords.includes(wordObj.word) ? '#dcfce7' : '#f3f4f6',
                      color: foundWords.includes(wordObj.word) ? '#15803d' : '#6b7280',
                      textDecoration: foundWords.includes(wordObj.word) ? 'line-through' : 'none',
                      fontWeight: '500'
                    }}
                  >
                    {wordObj.word}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {gameComplete && (
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
            <Award style={{ width: '4rem', height: '4rem', color: '#eab308', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginBottom: '1rem' }}>
              Word Search Complete! 🎉
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Fantastic! You found all the words and earned {score} eco-points!
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
        )}
      </div>
    </div>
  );
};

export default EcoWordSearch;
