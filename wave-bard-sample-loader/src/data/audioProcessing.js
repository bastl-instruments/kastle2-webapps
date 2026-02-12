// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

export const defaultAudioProcessing =
{
    fadeIn: false,
    fadeInSeconds: 0.005, // s
    fadeOut: false,
    fadeOutSeconds: 0.005, // s
    trim: false, // trims quiet
    trimDbs: -48, // dB
    normalize: false,
    normalizeDbs: -0.1 // dB
};

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