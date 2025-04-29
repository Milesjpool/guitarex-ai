import React, { useState, useEffect } from 'react';
import GuitarNeck from './components/GuitarNeck';
import './App.css';

function App() {
  const [exercise, setExercise] = useState(null);

  const generateExercise = async () => {
    try {
      const response = await fetch('/generate', {
        method: 'POST'
      });
      const data = await response.json();
      setExercise(data);
    } catch (error) {
      console.error('Error generating exercise:', error);
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
          {exercise && `Scale positions: ${exercise.scale_positions.join(', ')}`}
        </div>
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