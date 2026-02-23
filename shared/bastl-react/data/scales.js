// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import generateId from '@bastl-react/utils/generateId';

const minScales = 3;
const maxScales = 32;

const sharedScales = [
    { id: generateId(), name: 'Octave', semitones: 0b000000000001 },
    { id: generateId(), name: 'Harmonic Minor', semitones: 0b110110110101 },
    { id: generateId(), name: 'Melodic Minor (Ascending)', semitones: 0b101110110101 },
    { id: generateId(), name: 'Dorian Electra', semitones: 0b011110110101 },
    { id: generateId(), name: 'Phrygian', semitones: 0b010111010101 },
    { id: generateId(), name: 'Lydian', semitones: 0b101011110101 },
    { id: generateId(), name: 'Mixolydian', semitones: 0b101110010101 },
    { id: generateId(), name: 'Locrian', semitones: 0b010111011001 },
    { id: generateId(), name: 'Whole Tone', semitones: 0b101001001011 },
    { id: generateId(), name: 'Blues', semitones: 0b010011101001 },
    { id: generateId(), name: 'Bebop Minor', semitones: 0b011110111101 },
    { id: generateId(), name: 'Hungarian Minor', semitones: 0b110111010101 },
    { id: generateId(), name: 'Neapolitan Major', semitones: 0b101111010011 },
    { id: generateId(), name: 'Neapolitan Minor', semitones: 0b110111010011 },
    { id: generateId(), name: 'Pentatonic', semitones: 0b001010010101 },
    { id: generateId(), name: 'Dorian', semitones: 0b011010101101 },
    { id: generateId(), name: 'Locrian', semitones: 0b010101101011 },
    // Common chords
    { id: generateId(), name: 'Diminished', semitones: 0b000010010010 },
    { id: generateId(), name: 'Augmented', semitones: 0b000100010001 },
    { id: generateId(), name: 'Suspended 2', semitones: 0b000010100001 },
    { id: generateId(), name: 'Suspended 4', semitones: 0b000010010101 },
    { id: generateId(), name: 'Major 7', semitones: 0b100010010001 },
    { id: generateId(), name: 'Minor 7', semitones: 0b010010010001 },
    { id: generateId(), name: 'Diminished 7', semitones: 0b100010010010 },
    { id: generateId(), name: 'Half-Diminished', semitones: 0b010010010010 },
    { id: generateId(), name: 'Minor 6', semitones: 0b001010010001 },
    { id: generateId(), name: 'Minor 9', semitones: 0b010010110001 },
    { id: generateId(), name: 'Add9', semitones: 0b000010110001 },
    // Rare chords
    { id: generateId(), name: 'Dominant 11', semitones: 0b010110110001 },
    { id: generateId(), name: 'Dominant 13', semitones: 0b011110110001 },
    { id: generateId(), name: 'Diminished Whole Tone (7♯9♯5)', semitones: 0b011100110101 },
    { id: generateId(), name: 'Augmented Major 7', semitones: 0b100100010001 },
    { id: generateId(), name: 'Augmented Minor 7', semitones: 0b010100010001 },
    { id: generateId(), name: 'Suspended 7 (7sus4)', semitones: 0b010010010101 },
    { id: generateId(), name: 'Hendrix Chord (7♯9)', semitones: 0b010010110101 },
    { id: generateId(), name: 'Phrygian Chord', semitones: 0b010011010001 },
    { id: generateId(), name: 'Neapolitan Chord', semitones: 0b000110000001 },
    { id: generateId(), name: 'Italian Augmented', semitones: 0b000110010001 },
    { id: generateId(), name: 'German Augmented', semitones: 0b010110010001 },
    { id: generateId(), name: 'Mystic Chord', semitones: 0b101010011011 },
    { id: generateId(), name: 'Whole Tone Chord', semitones: 0b101010010101 },
    { id: generateId(), name: 'Quartal Chord', semitones: 0b000110010101 },
    { id: generateId(), name: 'So What Chord', semitones: 0b001110010101 }

];
export { sharedScales, minScales, maxScales };