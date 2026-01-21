// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import log from 'loglevel';
import { FxWizardBinaryWriter } from './fxWizardBinaryFormat';

/**
 * Generates binary data array from FX Wizard context
 * @param {Object} fxWizardContext - The FX Wizard context containing all configuration
 * @returns {Uint8Array} Binary data array
 */
export function generateBinaryData(fxWizardContext) {

    const { rhythms, sequencerLength } = fxWizardContext;

    log.debug('Rhythms:', rhythms);

    const writer = new FxWizardBinaryWriter();

    return writer.generate({
        rhythms,
        sequencerLength
    });
}