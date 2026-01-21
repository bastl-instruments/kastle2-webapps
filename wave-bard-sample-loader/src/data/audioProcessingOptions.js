// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

// Audio processing configuration options
export const audioProcessingOptions = [
    {
        key: 'fadeIn',
        label: 'Fade in',
        short: 'F-in',
        unitNote: 'to prevent clicks, ',
        unit: 's',
        stateKey: 'fadeIn',
        valueKey: 'fadeInSeconds'
    },
    {
        key: 'fadeOut',
        label: 'Fade out',
        short: 'F-out',
        unitNote: 'to prevent clicks, ',
        unit: 's',
        stateKey: 'fadeOut',
        valueKey: 'fadeOutSeconds'
    },
    {
        key: 'trim',
        label: 'Trim quiet',
        short: 'Trim',
        unitNote: 'under ',
        unit: 'dB',
        stateKey: 'trim',
        valueKey: 'trimDbs'
    },
    {
        key: 'normalize',
        label: 'Maximize volume',
        unitNote: 'to ',
        short: 'Max',
        unit: 'dB',
        stateKey: 'normalize',
        valueKey: 'normalizeDbs'
    }
];