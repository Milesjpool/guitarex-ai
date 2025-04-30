import React from 'react';
import { GuitarNeckProps } from '../types';
import { generateScale, NOTES, SCALE_POSITIONS } from '../utils/scales';
import './GuitarNeck.css';

const GuitarNeck: React.FC<GuitarNeckProps> = ({ rootNote, scalePositions, scaleType }) => {
  const scale = generateScale(rootNote, scaleType);
  const strings = ['E2', 'A2', 'D3', 'G3', 'B3', 'e4'].reverse();
  const frets = Array.from({ length: 13 }, (_, i) => i);
  const extendedFrets = [-1, ...frets];

  // Calculate the note at a given string and fret
  const getNoteAtPosition = (string: string, fret: number): string => {
    const stringNote = string.slice(0, -1).toUpperCase(); // Remove the octave number and convert to uppercase
    const stringIndex = NOTES.indexOf(stringNote as typeof NOTES[number]);
    const noteIndex = (stringIndex + fret + 1) % 12;
    return NOTES[noteIndex];
  };

  // Show note positions across the fretboard
  const getNotePosition = (string: string, fret: number): { note: string; order: number } | null => {
    if (fret === 12) return null; // Skip the 12th fret
    const note = getNoteAtPosition(string, fret);
    
    // Find the position of this note in the current scale
    const scaleIndex = scale.indexOf(note as typeof NOTES[number]);
    if (scaleIndex === -1) return null;
    
    // Get the scale position name (Root, 2nd, etc.)
    const position = SCALE_POSITIONS[scaleIndex];
    
    // Only show if this position is in our selected positions
    if (!scalePositions.includes(position)) return null;
    
    // Return the note and its order in our selected positions
    return {
      note,
      order: scalePositions.indexOf(position)
    };
  };

  return (
    <div className="guitar-neck">
      <div className="fret-board">
        {frets.map((fret) => (
          <div key={fret} className="fret">
            {fret === 0 && <div className="nut" />}
            {fret > 0 && <div className="fret-wire" />}
            <div className="fret-marker">
              {fret === 3 && <div className="dot" />}
              {fret === 5 && <div className="dot" />}
              {fret === 7 && <div className="dot" />}
              {fret === 9 && <div className="dot" />}
              {fret === 12 && (
                <div className="double-dot">
                  <div className="dot" />
                  <div className="dot" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="strings">
        {strings.map((string) => (
          <div key={string} className="string-container">
            <div className="string-name">{string.slice(0, -1)}</div>
            <div className="string">
              {extendedFrets.map((fret) => {
                const notePosition = getNotePosition(string, fret);
                return (
                  <div key={fret} className={`fret ${fret === -1 ? 'first-fret' : ''}`}>
                    {notePosition && (
                      <div className="fret-space">
                        <div 
                          className={`scale-note ${notePosition.order === 0 ? 'root' : ''}`}
                          data-order={notePosition.order === 0 ? undefined : notePosition.order}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuitarNeck; 