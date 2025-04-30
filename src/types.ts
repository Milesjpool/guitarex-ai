import { Note, ScalePosition, ScaleType } from './utils/scales';

export interface Exercise {
  root_note: Note;
  scale_positions: ScalePosition[];
  scale_type: ScaleType;
}

export type ErrorType = string | null;

export interface GuitarNeckProps {
  rootNote: Note;
  scalePositions: ScalePosition[];
  scaleType: ScaleType;
}

export type StringName = 'E' | 'A' | 'D' | 'G' | 'B' | 'E';
export type FretNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; 