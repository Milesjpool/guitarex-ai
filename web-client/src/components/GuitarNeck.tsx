import React from 'react';
import './GuitarNeck.css';

interface GuitarNeckProps {
  rootNote: string;
}

const GuitarNeck: React.FC<GuitarNeckProps> = ({ rootNote }) => {
  const strings = ['E', 'A', 'D', 'G', 'B', 'E'].reverse();
  const frets = Array.from({ length: 13 }, (_, i) => i);
  const extendedFrets = [-1, ...frets];

  // Calculate the note at a given string and fret
  const getNoteAtPosition = (string: string, fret: number): string => {
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const stringIndex = notes.indexOf(string);
    const noteIndex = (stringIndex + fret + 1) % 12;
    return notes[noteIndex];
  };

  // Show root note positions across the fretboard
  const getRootNotePosition = (string: string, fret: number): boolean => {
    if (fret === 13) return false; // Skip the 13th fret
    const note = getNoteAtPosition(string, fret);
    return note === rootNote;
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
            <div className="string-name">{string}</div>
            <div className="string">
              {extendedFrets.map((fret) => (
                <div key={fret} className={`fret ${fret === -1 ? 'first-fret' : ''}`}>
                  {getRootNotePosition(string, fret) && (
                    <div className="fret-space">
                      <div className="root-note" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuitarNeck; 