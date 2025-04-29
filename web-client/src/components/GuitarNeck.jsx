import React from 'react';
import './GuitarNeck.css';

const GuitarNeck = ({ rootNote, scalePositions }) => {
  const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
  const openNotes = ['E', 'A', 'D', 'G', 'B', 'E'];
  const noteOrder = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];

  const getFretPosition = (stringIndex) => {
    const openNote = openNotes[stringIndex];
    const openNoteIndex = noteOrder.indexOf(openNote);
    const rootNoteIndex = noteOrder.indexOf(rootNote);
    
    if (rootNoteIndex >= openNoteIndex) {
      return rootNoteIndex - openNoteIndex;
    }
    return (12 - openNoteIndex) + rootNoteIndex;
  };

  return (
    <div className="guitar-neck">
      <div className="strings">
        {strings.map((string, index) => (
          <div key={string} className="string" style={{ top: `${index * 40}px` }}>
            <span className="string-name">{string}</span>
            <div 
              className="root-note" 
              id={`root-note-marker-${string}`}
              style={{ left: `${(getFretPosition(index) * 25) + 80}px` }}
            >
              {rootNote}
            </div>
          </div>
        ))}
      </div>
      {[...Array(13)].map((_, i) => (
        <React.Fragment key={i}>
          <div className="fret" style={{ left: `${(i * 25) + 80}px` }} />
          {i > 0 && (
            <div className="fret-number" style={{ left: `${(i * 25) + 80}px` }}>
              {i}
            </div>
          )}
          {[3, 5, 7, 9].includes(i) && (
            <div className="fret-marker" style={{ left: `${(i * 25) + 80}px` }} />
          )}
          {i === 12 && (
            <div className="fret-marker double" style={{ left: `${(i * 25) + 80}px` }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GuitarNeck; 