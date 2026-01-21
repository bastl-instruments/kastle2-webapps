// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

const memorySize = 7.5 * 1024 * 1024; // 7.5 MB

const sampleRates = [
    { value: 44100, label: 'HIGH (44.1 kHz)' },
    { value: 22050, label: 'LOW (22 kHz)' },
    { value: 11025, label: 'TELEPHONE (11 kHz)' },
];

const defaultBanks = 1;
const minBanks = 1;
const maxBanks = 32;

const defaultSamples = 8; // Not used now
const minSamples = 3;
const maxSamples = 32;

const minRhythms = 3;
const maxRhythms = 64;

const minScales = 3;
const maxScales = 32;

const allowedFormats = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAVE' },
    { value: 'ogg', label: 'OGG' },
    { value: 'aac', label: 'AAC' },
    { value: 'm4a', label: 'M4A' },
    { value: 'aiff', label: 'AIFF' }
];

const presetsList = './presets.json';
const firmwaresList = './firmwares.json';

export default {
    memorySize,
    sampleRates,
    defaultBanks,
    defaultSamples,
    presetsList,
    firmwaresList,
    maxBanks,
    maxSamples,
    minBanks,
    minSamples,
    allowedFormats,
    minRhythms,
    maxRhythms,
    minScales,
    maxScales
};