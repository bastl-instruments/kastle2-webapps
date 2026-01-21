// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { sharedScales } from '@bastl-react/data/scales';
import { FirmwareBinaryReader, FirmwareBinaryWriter } from '@bastl-react/utils/firmwareBinaryFormat';
import { alchemistScales } from '../data/scales.js';

const allScales = [...alchemistScales, ...sharedScales];

/**
 * Writer for Alchemist firmware format
 */
export class AlchemistBinaryWriter extends FirmwareBinaryWriter {
    constructor() {
        super({
            magicHeader: 'k2ac',
            endMarker: 'ahoj',
            headerSize: 20
        });
    }

    calculateSize(data) {
        const { scales, rhythms } = data;
        let totalSize = this.headerSize; // Main Header size
        totalSize += scales.length * 4; // Scales
        totalSize += rhythms.length * 4; // Rhythms
        totalSize += 4; // End Marker size
        return totalSize;
    }

    writeHeader(data) {
        const { scales, rhythms, sequencerLength } = data;

        this.offset = this.writeMagicHeader(this.view, this.offset);

        this.view.setUint32(this.offset, this.calculateSize(data), true); // File Size
        this.offset += 4;
        this.view.setUint8(this.offset++, scales.length); // Scales count
        this.view.setUint8(this.offset++, rhythms.length); // Rhythms count

        // Alchemist has additional fixed parameters
        const fx_delay_n = 3;
        const fx_delay_d = 2;

        this.view.setUint8(this.offset++, sequencerLength); // Sequencer length
        this.view.setUint8(this.offset++, fx_delay_n); // FX Delay N
        this.view.setUint8(this.offset++, fx_delay_d); // FX Delay D

        // Fill remaining header bytes
        while (this.offset < this.headerSize) {
            this.view.setUint8(this.offset++, 0);
        }

        // Reset to header size for data writing
        this.offset = this.headerSize;

        return this.offset;
    }

    writeCustomData(data) {
        const { scales, rhythms } = data;

        this.offset = this.writeScales(this.view, this.offset, scales);
        this.offset = this.writeRhythms(this.view, this.offset, rhythms);

        return this.offset;
    }
}

/**
 * Reader for Alchemist firmware format
 */
export class AlchemistBinaryReader extends FirmwareBinaryReader {
    constructor() {
        super({
            magicHeader: 'k2ac',
            endMarker: 'ahoj',
            headerSize: 20
        });
    }

    readHeader() {
        // Skip totalSize
        this.offset += 4;

        const scalesCount = this.view.getUint8(this.offset++);
        const rhythmsCount = this.view.getUint8(this.offset++);

        // Read additional alchemist parameters
        const sequencerLength = this.view.getUint8(this.offset++);
        const fxDelayN = this.view.getUint8(this.offset++);
        const fxDelayD = this.view.getUint8(this.offset++);

        // Jump to data start after header
        this.offset = this.headerSize;

        return {
            scalesCount,
            rhythmsCount,
            sequencerLength,
            fxDelayN,
            fxDelayD
        };
    }

    readCustomData(headerData) {
        const { scalesCount, rhythmsCount } = headerData;

        // Read scales
        const scalesResult = this.readScales(this.view, this.offset, scalesCount, allScales);
        this.offset = scalesResult.nextOffset;

        // Read rhythms
        const rhythmsResult = this.readRhythms(this.view, this.offset, rhythmsCount);
        this.offset = rhythmsResult.nextOffset;

        return {
            scales: scalesResult.scales,
            rhythms: rhythmsResult.rhythms
        };
    }
}