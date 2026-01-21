// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { WaveFile } from 'wavefile';
import generateId from '@bastl-react/utils/generateId';
import log from 'loglevel';

/**
 * Base class for reading/writing binary firmware data
 */
export class FirmwareBinaryBase {
    constructor(options = {}) {
        this.magicHeader = options.magicHeader || 'k2xx';
        this.endMarker = options.endMarker || 'ahoj';
        this.headerSize = options.headerSize || 20;
    }

    // Shared utility methods
    writeString(view, offset, str, length) {
        for (let i = 0; i < length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i) || 0);
        }
        return offset + length;
    }

    readString(view, offset, length) {
        let str = '';
        for (let i = 0; i < length; i++) {
            const charCode = view.getUint8(offset + i);
            if (charCode !== 0) {
                str += String.fromCharCode(charCode);
            }
        }
        return { value: str, nextOffset: offset + length };
    }

    writeScales(view, offset, scales) {
        scales.forEach((scale) => {
            view.setUint32(offset, scale.semitones, true);
            offset += 4;
        });
        return offset;
    }

    readScales(view, offset, count, availableScales) {
        const scales = [];
        for (let i = 0; i < count; i++) {
            const semitones = view.getUint32(offset, true);
            offset += 4;
            const foundScale = availableScales.find((x) => x.semitones === semitones);
            scales.push({
                id: generateId(),
                name: foundScale?.name || 'Custom',
                semitones
            });
        }
        return { scales, nextOffset: offset };
    }

    writeRhythms(view, offset, rhythms) {
        rhythms.forEach((rhythm) => {
            view.setUint32(offset, rhythm.steps, true);
            offset += 4;
        });
        return offset;
    }

    readRhythms(view, offset, count) {
        const rhythms = [];
        for (let i = 0; i < count; i++) {
            const steps = view.getUint32(offset, true);
            offset += 4;
            rhythms.push({
                id: generateId(),
                steps
            });
        }
        return { rhythms, nextOffset: offset };
    }

    writeEndMarker(view, offset) {
        return this.writeString(view, offset, this.endMarker, 4);
    }

    readEndMarker(view, offset) {
        const result = this.readString(view, offset, 4);
        if (result.value !== this.endMarker) {
            throw new Error('Invalid firmware file: missing or wrong end marker');
        }
        return result.nextOffset;
    }

    writeMagicHeader(view, offset) {
        return this.writeString(view, offset, this.magicHeader, 4);
    }

    readMagicHeader(view, offset) {
        const result = this.readString(view, offset, 4);
        if (result.value !== this.magicHeader) {
            throw new Error(`Invalid firmware file: wrong magic header (expected ${this.magicHeader}, got ${result.value})`);
        }
        return result.nextOffset;
    }
}

/**
 * Writer class for creating binary firmware data
 */
export class FirmwareBinaryWriter extends FirmwareBinaryBase {
    constructor(options = {}) {
        super(options);
        this.data = null;
        this.buffer = null;
        this.view = null;
        this.offset = 0;
    }

    calculateSize(data) {
        // Override in subclasses to calculate total size
        throw new Error('calculateSize must be implemented by subclass');
    }

    writeHeader(data) {
        // Override in subclasses to write header
        throw new Error('writeHeader must be implemented by subclass');
    }

    writeCustomData(data) {
        // Override in subclasses to write custom data (banks, etc.)
        return this.offset;
    }

    generate(data) {
        this.data = data;
        const totalSize = this.calculateSize(data);

        this.buffer = new ArrayBuffer(totalSize);
        this.view = new DataView(this.buffer);
        this.offset = 0;

        this.offset = this.writeHeader(data);
        this.offset = this.writeCustomData(data);
        this.offset = this.writeEndMarker(this.view, this.offset);

        log.debug('Firmware size:', totalSize, 'bytes');
        log.debug('Final offset:', this.offset);

        return new Uint8Array(this.buffer);
    }
}

/**
 * Reader class for parsing binary firmware data
 */
export class FirmwareBinaryReader extends FirmwareBinaryBase {
    constructor(options = {}) {
        super(options);
        this.view = null;
        this.offset = 0;
    }

    readHeader() {
        // Override in subclasses to read header
        throw new Error('readHeader must be implemented by subclass');
    }

    readCustomData() {
        // Override in subclasses to read custom data
        return {};
    }

    parse(userData) {
        this.view = new DataView(
            userData.buffer,
            userData.byteOffset,
            userData.byteLength
        );
        this.offset = 0;

        this.offset = this.readMagicHeader(this.view, this.offset);
        const headerData = this.readHeader();
        const customData = this.readCustomData(headerData);
        this.readEndMarker(this.view, this.offset);

        return { ...headerData, ...customData };
    }
}