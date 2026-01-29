// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

const sequencerLengths = [
    { label: 'Classics', value: 'Classics', separator: true },
    { label: '8 Steps', value: 8 },
    { label: '16 Steps', value: 16 },
    { label: '32 Steps', value: 32 },
    { label: '64 Steps', value: 64 },
    { label: 'Others', value: 'Others', separator: true },
    { label: '5 Steps', value: 5 },
    { label: '6 Steps', value: 6 },
    { label: '7 Steps', value: 7 },
    { label: '9 Steps', value: 9 },
    { label: '10 Steps', value: 10 },
    { label: '11 Steps', value: 11 },
    { label: '12 Steps', value: 12 },
    { label: '13 Steps', value: 13 },
    { label: '14 Steps', value: 14 },
    { label: '15 Steps', value: 15 },
    { label: '17 Steps', value: 17 },
    { label: '20 Steps', value: 20 },
    { label: '21 Steps', value: 21 },
    { label: '24 Steps', value: 24 },
    { label: '36 Steps', value: 36 },
    { label: '42 Steps', value: 42 },
    { label: '48 Steps', value: 48 },
    { label: '54 Steps', value: 54 },
    { label: '60 Steps', value: 60 },
    { label: '63 Steps', value: 63 }
];

const defaultSequencerLength = 16;

export { sequencerLengths, defaultSequencerLength };