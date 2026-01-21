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
    { label: '12 Steps', value: 12 },
    { label: '15 Steps', value: 15 },
];

const defaultSequencerLength = 16;

export { sequencerLengths, defaultSequencerLength };