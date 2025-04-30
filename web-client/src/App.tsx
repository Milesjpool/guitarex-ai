import React, { useState, useEffect } from 'react';
import { Exercise, ErrorType } from './types';
import GuitarNeck from './components/GuitarNeck';
import './App.css';

// Get the API URL based on the environment
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000'  // Flask server URL in development
  : '';  // Use relative URL in production

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

function App(): JSX.Element {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<ErrorType>(null);

  const generateExercise = async (): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setExercise(data);
    } catch (error) {
      console.error('Error generating exercise:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    generateExercise();
  }, []);

  return (
    <div className="container">
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
                  key={pos} 
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
      <button onClick={generateExercise}>Generate New Exercise</button>
    </div>
  );
}

export default App; 