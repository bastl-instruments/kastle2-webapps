// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { WaveBardBinaryWriter } from './waveBardBinaryFormat';

/**
 * Generates binary data array from WaveBard context
 * @param {Object} waveBardContext - The WaveBard context containing all configuration
 * @returns {Uint8Array} Binary data array
 */
export function generateBinaryData(waveBardContext) {
    // Extract data from contexts
    const { banks, scales, rhythms, sequencerLength, bitDepth, sampleRate } = waveBardContext;

    const writer = new WaveBardBinaryWriter();

    const data = {
        banks,
        scales,
        rhythms,
        sequencerLength,
        bitDepth,
        sampleRate
    };

    return writer.generate(data);
}