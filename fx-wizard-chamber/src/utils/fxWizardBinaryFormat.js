// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { FirmwareBinaryReader, FirmwareBinaryWriter } from '@bastl-react/utils/firmwareBinaryFormat';

/**
 * Writer for FX Wizard firmware format
 */
export class FxWizardBinaryWriter extends FirmwareBinaryWriter {
    constructor() {
        super({
            magicHeader: 'k2fx',
            endMarker: 'ahoj',
            headerSize: 20
        });
    }

    calculateSize(data) {
        const { rhythms } = data;
        let totalSize = this.headerSize; // Main Header size
        totalSize += rhythms.length * 4; // Rhythms
        totalSize += 4; // End Marker size
        return totalSize;
    }

    writeHeader(data) {
        const { rhythms, sequencerLength } = data;

        this.offset = this.writeMagicHeader(this.view, this.offset);

        this.view.setUint32(this.offset, this.calculateSize(data), true); // File Size
        this.offset += 4;

        this.view.setUint8(this.offset++, rhythms.length); // Rhythms count
        this.view.setUint8(this.offset++, sequencerLength); // Sequencer length


        // Fill remaining header bytes
        while (this.offset < this.headerSize) {
            this.view.setUint8(this.offset++, 0);
        }

        // Reset to header size for data writing
        this.offset = this.headerSize;

        return this.offset;
    }

    writeCustomData(data) {
        const { rhythms } = data;

        this.offset = this.writeRhythms(this.view, this.offset, rhythms);

        return this.offset;
    }
}

/**
 * Reader for FX Wizard firmware format
 */
export class FxWizardBinaryReader extends FirmwareBinaryReader {
    constructor() {
        super({
            magicHeader: 'k2fx',
            endMarker: 'ahoj',
            headerSize: 20
        });
    }

    readHeader() {
        // Skip totalSize
        this.offset += 4;

        const rhythmsCount = this.view.getUint8(this.offset++);
        const sequencerLength = this.view.getUint8(this.offset++);


        // Jump to data start after header
        this.offset = this.headerSize;

        return {
            rhythmsCount,
            sequencerLength
        };
    }

    readCustomData(headerData) {
        const { rhythmsCount } = headerData;

        // Read rhythms
        const rhythmsResult = this.readRhythms(this.view, this.offset, rhythmsCount);
        this.offset = rhythmsResult.nextOffset;

        return {
            rhythms: rhythmsResult.rhythms
        };
    }
}