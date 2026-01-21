// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import generateId from '@bastl-react/utils/generateId';

// Should match the Alchemist App: AlchemistParameterMaps.h

export const alchemistScales = [
    { id: generateId(), name: 'Hungarian Minor', semitones: 0b100110101101 },
    { id: generateId(), name: 'Phrygian', semitones: 0b010110101011 },
    { id: generateId(), name: 'Aeolian', semitones: 0b010110101101 },
    { id: generateId(), name: 'Chromatic', semitones: 0b111111111111 },
    { id: generateId(), name: 'Ionian', semitones: 0b101010110101 },
    { id: generateId(), name: 'Lydian', semitones: 0b101011010101 },
    { id: generateId(), name: 'Wholetone', semitones: 0b010101010101 }
];