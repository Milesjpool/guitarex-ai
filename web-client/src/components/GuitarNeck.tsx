import React from 'react';
import { GuitarNeckProps } from '../types';
import './GuitarNeck.css';

const GuitarNeck: React.FC<GuitarNeckProps> = () => {
  const strings = ['E', 'A', 'D', 'G', 'B', 'E'].reverse();
  const frets = Array.from({ length: 13 }, (_, i) => i);

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
              {frets.map((fret) => (
                <div key={fret} className="fret" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuitarNeck; 