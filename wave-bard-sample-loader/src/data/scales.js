// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import generateId from '@bastl-react/utils/generateId';

export const waveBardScales = [
    { id: generateId(), name: 'Minor Chord', semitones: 0b000010001001 },
    { id: generateId(), name: 'Minor Pentatonic', semitones: 0b010010101001 },
    { id: generateId(), name: 'Minor Diatonic', semitones: 0b010110101101 },
    { id: generateId(), name: 'Chromatic', semitones: 0b111111111111 },
    { id: generateId(), name: 'Major Diatonic', semitones: 0b101010110101 },
    { id: generateId(), name: 'Major Pentatonic', semitones: 0b001010010101 },
    { id: generateId(), name: 'Major Chord', semitones: 0b000010010001 }
];