import React from 'react';
import './GuitarNeck.css';

interface GuitarNeckProps {
  rootNote: string;
  scalePositions: string[];
}

const GuitarNeck: React.FC<GuitarNeckProps> = ({ rootNote, scalePositions }) => {
  const strings = ['E2', 'A2', 'D3', 'G3', 'B3', 'e4'].reverse();
  const frets = Array.from({ length: 13 }, (_, i) => i);
  const extendedFrets = [-1, ...frets];

  // Calculate the note at a given string and fret
  const getNoteAtPosition = (string: string, fret: number): string => {
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const stringNote = string.slice(0, -1).toUpperCase(); // Remove the octave number and convert to uppercase
    const stringIndex = notes.indexOf(stringNote);
    const noteIndex = (stringIndex + fret + 1) % 12;
    return notes[noteIndex];
  };

  // Convert scale positions to actual notes
  const getScaleNotes = (): string[] => {
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    
    // Map scale degrees to semitones for major scale
    const semitonesFromRoot: { [key: string]: number } = {
      'Root': 0,  // Root
      '2nd': 2,   // Major 2nd
      '3rd': 4,   // Major 3rd
      '4th': 5,   // Perfect 4th
      '5th': 7,   // Perfect 5th
      '6th': 9,   // Major 6th
      '7th': 11   // Major 7th
    };

    // The root note is already the actual note name (e.g., "C", "D", etc.)
    const rootIndex = notes.indexOf(rootNote);
    
    console.log('Root note:', rootNote);
    console.log('Root index:', rootIndex);
    console.log('Scale positions:', scalePositions);

    const scaleNotes = scalePositions.map(pos => {
      const semitones = semitonesFromRoot[pos];
      const noteIndex = (rootIndex + semitones) % 12;
      const note = notes[noteIndex];
      console.log(`Position ${pos}: ${semitones} semitones -> ${note}`);
      return note;
    });

    console.log('Calculated scale notes:', scaleNotes);
    return scaleNotes;
  };

  // Show note positions across the fretboard
  const getNotePosition = (string: string, fret: number): { note: string; order: number } | null => {
    if (fret === 12) return null; // Skip the 12th fret
    const note = getNoteAtPosition(string, fret);
    const scaleNotes = getScaleNotes();
    const order = scaleNotes.indexOf(note);
    if (order === -1) return null;
    return {
      note,
      order
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