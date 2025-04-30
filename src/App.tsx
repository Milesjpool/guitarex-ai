import React, { useState, useEffect } from 'react';
import { Exercise, ErrorType } from './types';
import GuitarNeck from './components/GuitarNeck';
import AIBanner from './components/AIBanner';
import './App.css';

// Define musical notes and scale positions
const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const ALL_SCALE_POSITIONS = ['Root', '2nd', '3rd', '4th', '5th', '6th', '7th'];

// Map scale positions to colors
const getPositionColor = (position: string, index: number): string => {
  if (position === 'Root') return '#ff4444';
  const colors = [
    '#33b5e5', // 2nd
    '#00C851', // 3rd
    '#ffbb33', // 4th
    '#aa66cc', // 5th
    '#ff8800', // 6th
    '#0099cc', // 7th
    '#2BBBAD', // 8th
    '#CC0000'  // 9th
  ];
  return colors[index - 1] || '#ffffff';
};

const generateExercise = (): Exercise => {
  const root_note = NOTES[Math.floor(Math.random() * NOTES.length)];
  
  // Generate scale positions, starting with Root and moving up with random intervals
  const num_positions = Math.floor(Math.random() * 2) + 3; // Random number between 3 and 4
  let current_pos = 0;  // Start at Root
  const scale_positions = [ALL_SCALE_POSITIONS[current_pos]];
  
  // Add random ascending intervals
  for (let i = 0; i < num_positions - 1; i++) {
    // Choose a random interval to move up (at least 1 step)
    const interval = Math.floor(Math.random() * 3) + 1;
    current_pos = Math.min(current_pos + interval, ALL_SCALE_POSITIONS.length - 1);
    scale_positions.push(ALL_SCALE_POSITIONS[current_pos]);
  }
  
  return {
    root_note,
    scale_positions
  };
};

function App(): JSX.Element {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<ErrorType>(null);

  const handleGenerateExercise = (): void => {
    try {
      setError(null);
      const newExercise = generateExercise();
      setExercise(newExercise);
    } catch (error) {
      console.error('Error generating exercise:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    handleGenerateExercise();
  }, []);

  return (
    <div className="container">
      <AIBanner />
      <h1>Guitar Scale Practice</h1>
      <div className="exercise-box">
        <div className="key">
          {exercise ? `Key: ${exercise.root_note}` : 'Press Generate to start'}
        </div>
        <div className="positions">
          {exercise && (
            <>
              Scale positions:{' '}
              {exercise.scale_positions.map((pos, index) => (
                <span 
                  key={`${pos}-${index}`} 
                  style={{ color: getPositionColor(pos, index) }}
                >
                  {pos}{index < exercise.scale_positions.length - 1 ? ', ' : ''}
                </span>
              ))}
            </>
          )}
        </div>
        {error && <div className="error">{error}</div>}
        {exercise && (
          <GuitarNeck
            rootNote={exercise.root_note}
            scalePositions={exercise.scale_positions}
          />
        )}
        <div className="instructions">
          <h3>Instructions:</h3>
          <ol>
            <li>Find the root note on the low E string</li>
            <li>Play the scale positions in each octave</li>
            <li>Work your way up to the high E string</li>
          </ol>
        </div>
      </div>
      <button onClick={handleGenerateExercise}>Generate New Exercise</button>
    </div>
  );
}

export default App; 