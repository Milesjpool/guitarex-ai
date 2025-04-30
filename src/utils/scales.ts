export const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'] as const;
export type Note = typeof NOTES[number];

export const SCALE_POSITIONS = ['Root', '2nd', '3rd', '4th', '5th', '6th', '7th'] as const;
export type ScalePosition = typeof SCALE_POSITIONS[number];

export type ScaleType = 'major' | 'minor';

// Major scale intervals: W-W-H-W-W-W-H (where W = whole step, H = half step)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const;

// Natural minor scale intervals: W-H-W-W-H-W-W
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10] as const;

export const getScaleIntervals = (scaleType: ScaleType): number[] => {
  return scaleType === 'major' ? [...MAJOR_SCALE_INTERVALS] : [...MINOR_SCALE_INTERVALS];
};

export const getNoteAtInterval = (rootNote: Note, interval: number): Note => {
  const rootIndex = NOTES.indexOf(rootNote);
  const noteIndex = (rootIndex + interval) % 12;
  return NOTES[noteIndex];
};

export const generateScale = (rootNote: Note, scaleType: ScaleType): Note[] => {
  const intervals = getScaleIntervals(scaleType);
  return intervals.map(interval => getNoteAtInterval(rootNote, interval));
}; 