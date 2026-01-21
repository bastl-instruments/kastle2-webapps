// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { readUf2, PROGRAM_MAX_SIZE } from '@bastl-react/utils/uf2Utils.js';
import { WaveBardBinaryReader } from './waveBardBinaryFormat';
import { defaultSequencerLength } from '@bastl-react/data/sequencer.js';
import log from 'loglevel';

function parseFirmware(file) {
    return new Promise((resolve, reject) => {
        // Read file as a blob
        const reader = new FileReader();
        reader.onload = async () => {
            const uf2Data = new Uint8Array(reader.result);
            try {
                const wholeFirmware = await readUf2(uf2Data);
                // User data starts at PROGRAM_MAX_SIZE address
                const userData = wholeFirmware.slice(PROGRAM_MAX_SIZE);
                const reader = new WaveBardBinaryReader();
                const firmwareData = reader.parse(userData);
                resolve(firmwareData);
            } catch (e) {
                log.error('Error parsing firmware:', e);
                reject();
            }
        };
        reader.readAsArrayBuffer(file);
    });
}


async function loadFirmware(file, waveBardContext) {
    const firmware = await parseFirmware(file);
    if (firmware) {
        // Update settings if present
        if (firmware.sampleRate && waveBardContext.setSampleRate) {
            waveBardContext.setSampleRate(firmware.sampleRate);
        }
        if (firmware.bitDepth && waveBardContext.setBitDepth) {
            waveBardContext.setBitDepth(firmware.bitDepth);
        }
        if (waveBardContext.setAudioProcessing) {
            waveBardContext.setAudioProcessing((x) => ({ ...x, enabled: false }));
        }

        // Load data
        waveBardContext.setBanks(firmware.banks || []);
        waveBardContext.setScales(firmware.scales || []);
        waveBardContext.setRhythms(firmware.rhythms || []);
        waveBardContext.setSequencerLength(firmware.sequencerLength || defaultSequencerLength);
    } else {
        log.error('Failed to parse firmware');
    }
}

export { parseFirmware, loadFirmware };