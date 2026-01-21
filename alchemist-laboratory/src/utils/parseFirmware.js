// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { readUf2, PROGRAM_MAX_SIZE } from '@bastl-react/utils/uf2Utils.js';
import { AlchemistBinaryReader } from './alchemistBinaryFormat';
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
                const reader = new AlchemistBinaryReader();
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

export { parseFirmware };