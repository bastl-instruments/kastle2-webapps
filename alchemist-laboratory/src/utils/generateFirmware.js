// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import log from 'loglevel';
import { AlchemistBinaryWriter } from './alchemistBinaryFormat';

/**
 * Generates binary data array from Alchemist context
 * @param {Object} alchemistContext - The Alchemist context containing all configuration
 * @returns {Uint8Array} Binary data array
 */
export function generateBinaryData(alchemistContext) {

    const { scales, rhythms, sequencerLength } = alchemistContext;

    log.debug('Scales:', scales);
    log.debug('Rhythms:', rhythms);

    const writer = new AlchemistBinaryWriter();

    return writer.generate({
        scales,
        rhythms,
        sequencerLength
    });
}