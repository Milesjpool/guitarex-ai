let audioContext: AudioContext | null = null;
let activeOscillators: { osc: OscillatorNode, gain: GainNode }[] = [];
let masterGain: GainNode | null = null;
let isPlayingScale: boolean = false;

const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88
};

export function playNote(noteWithOctave: string, duration: number = 0.5): void {
  // Clean up any existing sounds first
  stopAllSounds();

  // Initialize audio context if needed
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Ensure audio context is running
  audioContext.resume().catch(console.warn);

  // Parse the note (e.g., 'A4' or 'C#5')
  const match = noteWithOctave.match(/^([A-G]#?)(\d*)$/);
  if (!match) return;

  const [, noteName, octaveStr] = match;
  const octave = octaveStr ? parseInt(octaveStr, 10) : 4;

  // Find the note in our frequency table
  const baseFrequency = NOTE_FREQUENCIES[noteName];
  if (baseFrequency === undefined) {
    console.warn(`Note ${noteName} not found`);
    return;
  }

  // Calculate frequency based on octave
  const frequency = baseFrequency * Math.pow(2, octave - 4);

  // Create nodes
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Configure oscillator
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // Apply envelope
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.7, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.9);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  // Connect and start
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Store for cleanup
  const audioNode = { osc: oscillator, gain: gainNode };
  activeOscillators.push(audioNode);

  // Schedule playback
  oscillator.start();
  oscillator.stop(now + duration + 0.1);

  // Clean up
  oscillator.onended = () => {
    activeOscillators = activeOscillators.filter(n => n.osc !== oscillator);
    gainNode.disconnect();
  };
}

export function stopAllSounds(): void {
  if (!audioContext) return;

  // Stop and clean up all oscillators
  activeOscillators.forEach(({ osc, gain }) => {
    try {
      osc.stop();
      gain.disconnect();
      osc.disconnect();
    } catch (e) {
      console.warn('Error cleaning up audio:', e);
    }
  });
  activeOscillators = [];

  // Clean up master gain if it exists
  if (masterGain) {
    try {
      masterGain.disconnect();
      masterGain = null;
    } catch (e) {
      console.warn('Error cleaning up master gain:', e);
    }
  }
}

export function playScale(rootNote: string, scaleType: string, tempo: number = 120): void {
  // Clean up any existing sounds first
  stopAllSounds();

  // Initialize audio context if needed
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Ensure audio context is running
  audioContext.resume().catch(console.warn);

  // Audio parameters
  const attackTime = 0.05;
  const releaseTime = 0.1;

  const SCALE_INTERVALS: Record<string, number[]> = {
    'major': [0, 2, 4, 5, 7, 9, 11, 12, 12, 11, 9, 7, 5, 4, 2, 0],
    'minor': [0, 2, 3, 5, 7, 8, 10, 12, 12, 10, 8, 7, 5, 3, 2, 0],
    'pentatonic': [0, 2, 4, 7, 9, 12, 9, 7, 4, 2, 0],
    'blues': [0, 3, 5, 6, 7, 10, 12, 10, 7, 6, 5, 3, 0]
  };

  const intervals = SCALE_INTERVALS[scaleType.toLowerCase()] || SCALE_INTERVALS.major;

  const match = rootNote.match(/^([A-G]#?)(\d*)$/);
  if (!match) return;

  const [, noteName] = match;
  const octave = match[2] ? parseInt(match[2], 10) : 4;

  const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootNoteIndex = CHROMATIC_SCALE.indexOf(noteName);
  if (rootNoteIndex === -1) return;

  const calculateFrequency = (semitonesFromRoot: number): number => {
    const A4_FREQ = 440;
    const SEMITONES_FROM_C0_TO_A4 = 9 + (4 * 12);
    const semitonesFromC0 = (octave * 12) + rootNoteIndex + semitonesFromRoot;
    return A4_FREQ * Math.pow(2, (semitonesFromC0 - SEMITONES_FROM_C0_TO_A4) / 12);
  };

  const noteDuration = 60 / (tempo * 1.5);
  const now = audioContext.currentTime + 0.1;

  // Create master gain if it doesn't exist
  if (!masterGain) {
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(audioContext.destination);
  }

  // Play each note in the scale
  intervals.forEach((semitone, index) => {
    const time = now + (index * noteDuration * 0.8);

    // Create oscillator and gain node for this note
    const oscillator = audioContext!.createOscillator();
    const gainNode = audioContext!.createGain();

    // Configure oscillator
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(calculateFrequency(semitone), time);

    // Apply envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.6, time + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + noteDuration - releaseTime);
    gainNode.gain.linearRampToValueAtTime(0, time + noteDuration);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(masterGain!);

    // Store for cleanup
    const audioNode = { osc: oscillator, gain: gainNode };
    activeOscillators.push(audioNode);

    // Schedule playback
    oscillator.start(time);
    oscillator.stop(time + noteDuration + 0.1);

    // Clean up when note ends
    oscillator.onended = () => {
      activeOscillators = activeOscillators.filter(n => n.osc !== oscillator);
      gainNode.disconnect();

      // Clean up master gain after last note
      if (index === intervals.length - 1) {
        setTimeout(() => {
          if (masterGain) {
            masterGain.disconnect();
            masterGain = null;
          }
        }, 100);
      }
    };
  });
}

export function playSelectedScalePositions(rootNote: string, scaleType: string, scalePositions: string[], tempo: number = 120): void {
  // Prevent multiple simultaneous scale plays
  if (isPlayingScale) {
    return;
  }

  isPlayingScale = true;

  // Clean up any existing sounds first
  stopAllSounds();

  // Initialize audio context if needed
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Ensure audio context is running
  audioContext.resume().catch(console.warn);

  // Audio parameters (same as playNote for consistency)
  const releaseTime = 0.1;

  // Define scale intervals for major and minor scales
  const SCALE_INTERVALS: Record<string, number[]> = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10]
  };

  const fullScaleIntervals = SCALE_INTERVALS[scaleType.toLowerCase()] || SCALE_INTERVALS.major;

  // Map scale position names to their indices in the full scale
  const SCALE_POSITION_INDICES: Record<string, number> = {
    'Root': 0,
    '2nd': 1,
    '3rd': 2,
    '4th': 3,
    '5th': 4,
    '6th': 5,
    '7th': 6
  };

  // Get the intervals for only the selected positions
  const selectedIntervals = scalePositions.map(position => {
    const index = SCALE_POSITION_INDICES[position];
    return fullScaleIntervals[index];
  });

  const match = rootNote.match(/^([A-G]#?)(\d*)$/);
  if (!match) return;

  const [, noteName] = match;
  const octave = match[2] ? parseInt(match[2], 10) : 4;

  const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootNoteIndex = CHROMATIC_SCALE.indexOf(noteName);
  if (rootNoteIndex === -1) return;

  const calculateFrequency = (semitonesFromRoot: number): number => {
    const A4_FREQ = 440;
    const SEMITONES_FROM_C0_TO_A4 = 9 + (4 * 12);
    const semitonesFromC0 = (octave * 12) + rootNoteIndex + semitonesFromRoot;
    return A4_FREQ * Math.pow(2, (semitonesFromC0 - SEMITONES_FROM_C0_TO_A4) / 12);
  };

  const noteDuration = 60 / (tempo * 1.5);
  const now = audioContext.currentTime + 0.1;

  // Create master gain if it doesn't exist
  if (!masterGain) {
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(audioContext.destination);
  }

  // Play each selected note in the scale
  selectedIntervals.forEach((semitone, index) => {
    const time = now + (index * noteDuration * 0.8);

    // Create oscillator and gain node for this note
    const oscillator = audioContext!.createOscillator();
    const gainNode = audioContext!.createGain();

    // Configure oscillator
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(calculateFrequency(semitone), time);

    // Apply envelope (same as playNote for consistency)
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.7, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + noteDuration - releaseTime);
    gainNode.gain.linearRampToValueAtTime(0, time + noteDuration);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(masterGain!);

    // Store for cleanup
    const audioNode = { osc: oscillator, gain: gainNode };
    activeOscillators.push(audioNode);

    // Schedule playback
    oscillator.start(time);
    oscillator.stop(time + noteDuration + 0.1);

    // Clean up when note ends
    oscillator.onended = () => {
      activeOscillators = activeOscillators.filter(n => n.osc !== oscillator);
      gainNode.disconnect();

      // Clean up master gain after last note
      if (index === selectedIntervals.length - 1) {
        setTimeout(() => {
          if (masterGain) {
            masterGain.disconnect();
            masterGain = null;
          }
          // Reset the playing flag
          isPlayingScale = false;
        }, 100);
      }
    };
  });
}

export function playScaleDegree(rootNote: string, scaleType: string, scalePosition: string, duration: number = 0.5): void {
  // Clean up any existing sounds first
  stopAllSounds();

  // Initialize audio context if needed
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Ensure audio context is running
  audioContext.resume().catch(console.warn);

  // Define scale intervals for major and minor scales
  const SCALE_INTERVALS: Record<string, number[]> = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10]
  };

  // Map scale position names to their indices in the full scale
  const SCALE_POSITION_INDICES: Record<string, number> = {
    'Root': 0,
    '2nd': 1,
    '3rd': 2,
    '4th': 3,
    '5th': 4,
    '6th': 5,
    '7th': 6
  };

  const fullScaleIntervals = SCALE_INTERVALS[scaleType.toLowerCase()] || SCALE_INTERVALS.major;
  const positionIndex = SCALE_POSITION_INDICES[scalePosition];
  const semitoneInterval = fullScaleIntervals[positionIndex];

  const match = rootNote.match(/^([A-G]#?)(\d*)$/);
  if (!match) return;

  const [, noteName] = match;
  const octave = match[2] ? parseInt(match[2], 10) : 4;

  const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootNoteIndex = CHROMATIC_SCALE.indexOf(noteName);
  if (rootNoteIndex === -1) return;

  const calculateFrequency = (semitonesFromRoot: number): number => {
    const A4_FREQ = 440;
    const SEMITONES_FROM_C0_TO_A4 = 9 + (4 * 12);
    const semitonesFromC0 = (octave * 12) + rootNoteIndex + semitonesFromRoot;
    return A4_FREQ * Math.pow(2, (semitonesFromC0 - SEMITONES_FROM_C0_TO_A4) / 12);
  };

  // Calculate the frequency for this scale degree
  const frequency = calculateFrequency(semitoneInterval);

  // Create nodes
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Configure oscillator
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // Apply envelope (same as playNote for consistency)
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.7, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.9);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);

  // Connect and start
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Store for cleanup
  const audioNode = { osc: oscillator, gain: gainNode };
  activeOscillators.push(audioNode);

  // Schedule playback
  oscillator.start();
  oscillator.stop(now + duration + 0.1);

  // Clean up
  oscillator.onended = () => {
    activeOscillators = activeOscillators.filter(n => n.osc !== oscillator);
    gainNode.disconnect();
  };
}