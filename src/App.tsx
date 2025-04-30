import { useState, useEffect } from 'react';
import { Exercise, ErrorType } from './types';
import GuitarNeck from './components/GuitarNeck';
import AIBanner from './components/AIBanner';
import { NOTES, SCALE_POSITIONS, ScaleType } from './utils/scales';
import './App.css';

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

const generateExercise = (scaleType: ScaleType): Exercise => {
  const root_note = NOTES[Math.floor(Math.random() * NOTES.length)];
  
  // Generate scale positions, starting with Root and moving up with random intervals
  const num_positions = Math.floor(Math.random() * 2) + 3; // Random number between 3 and 4
  let current_pos = 0;  // Start at Root
  const scale_positions = [SCALE_POSITIONS[current_pos]];
  
  // Add random ascending intervals
  for (let i = 0; i < num_positions - 1; i++) {
    // Choose a random interval to move up (at least 1 step)
    const interval = Math.floor(Math.random() * 3) + 1;
    current_pos = Math.min(current_pos + interval, SCALE_POSITIONS.length - 1);
    scale_positions.push(SCALE_POSITIONS[current_pos]);
  }
  
  return {
    root_note,
    scale_positions,
    scale_type: scaleType
  };
};

function App(): JSX.Element {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<ErrorType>(null);
  const [scaleType, setScaleType] = useState<ScaleType>('major');

  const handleGenerateExercise = (): void => {
    try {
      setError(null);
      const newExercise = generateExercise(scaleType);
      setExercise(newExercise);
    } catch (error) {
      console.error('Error generating exercise:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    handleGenerateExercise();
  }, []);

  const handleScaleTypeChange = (newScaleType: ScaleType): void => {
    setScaleType(newScaleType);
    if (exercise) {
      // Generate new scale positions based on the new scale type
      const newPositions = exercise.scale_positions.map(pos => {
        const index = SCALE_POSITIONS.indexOf(pos);
        return SCALE_POSITIONS[index];
      });
      
      setExercise({
        ...exercise,
        scale_type: newScaleType,
        scale_positions: newPositions
      });
    }
  };

  return (
    <div className="container">
      <AIBanner />
      <h1>Guitar Scale Practice</h1>
      <div className="exercise-box">
        <div className="key">
          {exercise ? `${exercise.root_note} ${exercise.scale_type}` : 'Press Generate to start'}
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
        <div className="fretboard-container">
          {exercise && (
            <GuitarNeck
              rootNote={exercise.root_note}
              scalePositions={exercise.scale_positions}
              scaleType={exercise.scale_type}
            />
          )}
          <div className="scale-type-selector">
            <button 
              className={`scale-type-btn ${scaleType === 'major' ? 'active' : ''}`}
              onClick={() => handleScaleTypeChange('major')}
            >
              Major
            </button>
            <button 
              className={`scale-type-btn ${scaleType === 'minor' ? 'active' : ''}`}
              onClick={() => handleScaleTypeChange('minor')}
            >
              Minor
            </button>
          </div>
        </div>
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