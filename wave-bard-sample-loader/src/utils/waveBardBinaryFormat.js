// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { WaveFile } from 'wavefile';
import log from 'loglevel';
import { FirmwareBinaryWriter, FirmwareBinaryReader } from '@bastl-react/utils/firmwareBinaryFormat';
import cloneObj from '@bastl-react/utils/cloneObj';
import bankColors from '../data/bankColors.js';
import generateId from '@bastl-react/utils/generateId';
import { sharedScales } from '@bastl-react/data/scales';
import { waveBardScales } from '../data/scales.js';

const allScales = [...waveBardScales, ...sharedScales];

/**
 * Writer for Wave Bard firmware format
 */
export class WaveBardBinaryWriter extends FirmwareBinaryWriter {
    constructor() {
        super({
            magicHeader: 'k2wb',
            endMarker: 'ahoj',
            headerSize: 20
        });
    }

    calculateSize(data) {
        const { banks, scales, rhythms } = data;
        let totalSize = this.headerSize; // Main Header size
        totalSize += scales.length * 4; // Scales
        totalSize += rhythms.length * 4; // Rhythms

        let samplesPerBank = -1;
        const processedBanks = cloneObj(banks);

        processedBanks.forEach((bank) => {
            if (samplesPerBank === -1) {
                samplesPerBank = bank.samples.length;
            } else if (samplesPerBank !== bank.samples.length) {
                log.error('All banks must have the same number of samples');
                throw new Error('All banks must have the same number of samples');
            }
            totalSize += 12; // Bank Header size
            bank.samples?.forEach((sample) => {
                totalSize += 16; // Sample Header size
                if (sample.processed?.soundData) {
                    const wav = new WaveFile(sample.processed?.soundData);
                    sample.wavSamples = wav.getSamples(true, Int16Array);
                    const sampleCount = sample.wavSamples.length;
                    const sampleSize = sampleCount * data.bitDepth / 8;
                    const padding = (4 - (sampleSize % 4)) % 4;
                    totalSize += sampleSize + padding;
                }
            });
        });

        totalSize += 4; // End Marker size
        return totalSize;
    }

    writeHeader(data) {
        const { banks, scales, rhythms, sequencerLength, bitDepth, sampleRate } = data;
        const processedBanks = cloneObj(banks);
        const samplesPerBank = processedBanks[0]?.samples?.length || 0;

        this.offset = this.writeMagicHeader(this.view, this.offset);

        this.view.setUint32(this.offset, this.calculateSize(data), true); // File Size
        this.offset += 4;
        this.view.setUint32(this.offset, sampleRate, true); // Sample Rate
        this.offset += 4;
        this.view.setUint8(this.offset++, bitDepth); // Bit Depth
        this.view.setUint8(this.offset++, processedBanks.length); // Num Banks
        this.view.setUint8(this.offset++, samplesPerBank); // Num Samples in bank
        this.view.setUint8(this.offset++, scales.length); // Scales
        this.view.setUint8(this.offset++, rhythms.length); // Rhythms
        this.view.setUint8(this.offset++, sequencerLength); // Sequencer Length
        this.view.setUint8(this.offset++, 0); // Reserved
        this.view.setUint8(this.offset++, 0); // Reserved

        return this.offset;
    }

    writeCustomData(data) {
        const { banks, scales, rhythms, bitDepth } = data;
        const processedBanks = cloneObj(banks);

        // Process samples and prepare WAV data
        processedBanks.forEach((bank) => {
            bank.samples?.forEach((sample) => {
                if (sample.processed?.soundData) {
                    const wav = new WaveFile(sample.processed?.soundData);
                    sample.wavSamples = wav.getSamples(true, Int16Array);
                }
            });
        });

        this.offset = this.writeScales(this.view, this.offset, scales);
        this.offset = this.writeRhythms(this.view, this.offset, rhythms);

        // Write banks
        processedBanks.forEach((bank) => {
            // Bank Header
            this.offset = this.writeString(this.view, this.offset, bank.label || '', 8);

            // Extract RGB values from bank.color.real
            const color = bank.color?.real || '#FFFFFF';
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            this.view.setUint8(this.offset++, r); // Color R
            this.view.setUint8(this.offset++, g); // Color G
            this.view.setUint8(this.offset++, b); // Color B
            this.view.setUint8(this.offset++, 0); // Reserved

            bank.samples.forEach((sample) => {
                const sampleCount = sample.wavSamples?.length || 0;
                const sampleSize = sampleCount * bitDepth / 8;
                const padding = (4 - (sampleSize % 4)) % 4;

                this.view.setUint32(this.offset, sampleSize + padding, true);
                this.offset += 4;
                this.view.setUint8(this.offset++, sample.stereo ? 2 : 1); // Sample Channels

                this.offset = this.writeString(this.view, this.offset, sample.label || '', 8);

                this.view.setUint8(this.offset++, 0); // Reserved
                this.view.setUint8(this.offset++, 0); // Reserved
                this.view.setUint8(this.offset++, 0); // Reserved

                // Write sample data
                for (let i = 0; i < sampleCount; i++) {
                    this.view.setInt16(this.offset, sample.wavSamples?.[i] || 0, true);
                    this.offset += 2;
                }

                // Padding
                for (let i = 0; i < padding; i++) {
                    this.view.setUint8(this.offset++, 0);
                }
            });
        });

        return this.offset;
    }
}

/**
 * Reader for Wave Bard firmware format
 */
export class WaveBardBinaryReader extends FirmwareBinaryReader {
    constructor() {
        super({
            magicHeader: 'k2wb',
            endMarker: 'ahoj',
            headerSize: 20
        });
    }

    readHeader() {
        // Skip totalSize
        this.offset += 4;

        const sampleRate = this.view.getUint32(this.offset, true);
        this.offset += 4;
        const bitDepth = this.view.getUint8(this.offset++);
        const numBanks = this.view.getUint8(this.offset++);
        const samplesPerBank = this.view.getUint8(this.offset++);
        const scalesCount = this.view.getUint8(this.offset++);
        const rhythmsCount = this.view.getUint8(this.offset++);
        const sequencerLength = this.view.getUint8(this.offset++);
        this.offset += 2; // Skip reserved bytes

        return {
            sampleRate,
            bitDepth,
            numBanks,
            samplesPerBank,
            scalesCount,
            rhythmsCount,
            sequencerLength
        };
    }

    readCustomData(headerData) {
        const { numBanks, samplesPerBank, scalesCount, rhythmsCount, bitDepth, sampleRate } = headerData;

        // Read scales
        const scalesResult = this.readScales(this.view, this.offset, scalesCount, allScales);
        this.offset = scalesResult.nextOffset;

        // Read rhythms
        const rhythmsResult = this.readRhythms(this.view, this.offset, rhythmsCount);
        this.offset = rhythmsResult.nextOffset;

        // Read banks
        const banks = [];
        for (let bankIndex = 0; bankIndex < numBanks; bankIndex++) {
            // Bank label
            const labelResult = this.readString(this.view, this.offset, 8);
            this.offset = labelResult.nextOffset;

            // Bank color
            const r = this.view.getUint8(this.offset++);
            const g = this.view.getUint8(this.offset++);
            const b = this.view.getUint8(this.offset++);
            const colorHex = '#' + [r, g, b]
                .map((n) => n.toString(16).padStart(2, '0'))
                .join('')
                .toUpperCase();

            let color = bankColors.find((x) => x.real === colorHex);
            if (!color) {
                color = {
                    real: colorHex,
                    name: 'Custom',
                    display: colorHex
                };
            }

            this.offset++; // Skip reserved byte

            const samples = [];
            for (let sampleIndex = 0; sampleIndex < samplesPerBank; sampleIndex++) {
                const sampleDataSize = this.view.getUint32(this.offset, true);
                this.offset += 4;

                const channels = this.view.getUint8(this.offset++);
                const sampleLabelResult = this.readString(this.view, this.offset, 8);
                this.offset = sampleLabelResult.nextOffset;

                this.offset += 3; // Skip reserved bytes

                // Calculate actual sample data length
                const bytesPerSample = bitDepth / 8;
                let dataLength = null;
                for (let possible = sampleDataSize; possible >= sampleDataSize - 3; possible--) {
                    const padding = (4 - (possible % 4)) % 4;
                    if (possible + padding === sampleDataSize && possible % bytesPerSample === 0) {
                        dataLength = possible;
                        break;
                    }
                }
                if (dataLength === null) {
                    throw new Error(`Could not determine sample data length for sample ${sampleLabelResult.value}`);
                }
                const sampleCount = dataLength / bytesPerSample;

                // Read sample data
                const wavSamples = [];
                for (let i = 0; i < sampleCount; i++) {
                    if (bitDepth === 16) {
                        wavSamples.push(this.view.getInt16(this.offset, true));
                        this.offset += 2;
                    } else {
                        throw new Error('Unsupported bit depth: ' + bitDepth);
                    }
                }

                // Skip padding
                const padding = sampleDataSize - dataLength;
                this.offset += padding;

                // Construct wavefile from the samples
                const wav = new WaveFile();
                wav.fromScratch(channels, sampleRate, bitDepth.toString(), wavSamples);
                const outputWave = wav.toBuffer();


                samples.push({
                    id: generateId(),
                    label: sampleLabelResult.value,
                    stereo: channels === 2,
                    needsProcessing: false,
                    isProcessing: false,
                    original: {
                        soundData: outputWave.buffer,
                        info: {
                            format: 'WAV',
                            sampleRate,
                            bitDepth: bitDepth,
                            channels
                        }
                    },
                    processed: {
                        soundData: outputWave,
                        info: {
                            format: 'WAV',
                            sampleRate,
                            bitDepth: bitDepth,
                            channels
                        }
                    }
                });
            }

            banks.push({
                id: generateId(),
                label: labelResult.value,
                color,
                samples
            });
        }

        return {
            banks,
            scales: scalesResult.scales,
            rhythms: rhythmsResult.rhythms
        };
    }
}