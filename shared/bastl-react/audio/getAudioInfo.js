// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import log from 'loglevel';

/**
 * Tries to get audio information from a buffer and a MIME type
 *
 * @param {*} soundData Buffer with the data
 * @param {string} fileType MIME type
 * @returns {Promise<{format: string, sampleRate: number, bitDepth: number, channels: number}>} Audio information
 */
export default async function getAudioInfo(soundData, fileType) {
    const dataView = new DataView(soundData);
    let format;
    let sampleRate;
    let bitDepth;
    let channels;
    let header;
    let sampleRateIndex;
    let channelMode;
    let sampleRates;

    switch (fileType) {
        case 'audio/wav':
        case 'audio/x-wav':
        case 'audio/wave':
        case 'audio/x-pn-wav':
        case 'audio/vnd.wav':
        case 'audio/vnd.wave':
            format = 'WAV';
            ({ sampleRate, bitDepth, channels } = parseWavHeader(dataView));
            break;
        case 'audio/mpeg':
            format = 'MP3';
            header = dataView.getUint32(0, false);
            sampleRateIndex = (header >> 10) & 0x3;
            channelMode = (header >> 6) & 0x3;
            sampleRates = [44100, 48000, 32000];
            sampleRate = sampleRates[sampleRateIndex];
            bitDepth = '16?'; // MP3 bit depth is not explicitly stored
            channels = channelMode === 3 ? 1 : 2; // Mono or Stereo
            break;
        case 'audio/ogg':
            format = 'OGG';
            sampleRate = dataView.getUint32(28, true);
            bitDepth = '16?'; // OGG often uses 16-bit samples
            channels = dataView.getUint8(37);
            break;
        case 'audio/aac':
            format = 'AAC';
            header = dataView.getUint16(0, false);
            sampleRateIndex = (header >> 10) & 0xF;
            channels = (header >> 6) & 0x7;
            sampleRates = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
            sampleRate = sampleRates[sampleRateIndex];
            bitDepth = '16?'; // AAC bit depth is not explicitly stored
            break;
        default:
            return false;
    }

    return {
        format,
        sampleRate,
        bitDepth,
        channels
    };
}

/**
 * Parses a WAV file header while handling JUNK and unknown chunks.
 * @param {DataView} dataView - DataView representing the WAV file.
 * @returns {{ sampleRate: number, bitDepth: number, channels: number }}
 */
function parseWavHeader(dataView) {
    let offset = 0;

    // Read RIFF header
    if (getString(dataView, offset, 4) !== 'RIFF') {
        log.error('Invalid WAV file (no RIFF header)');
        return {};
    }
    offset += 8; // Skip "RIFF" + file size

    if (getString(dataView, offset, 4) !== 'WAVE') {
        log.error('Invalid WAV file (no WAVE header)');
        return {};
    }
    offset += 4;

    let sampleRate, bitDepth, channels;

    // Scan through chunks
    while (offset + 8 <= dataView.byteLength) {
        const chunkId = getString(dataView, offset, 4);
        offset += 4;
        const chunkSize = dataView.getUint32(offset, true);
        offset += 4;
        let format;

        switch (chunkId) {
            case 'fmt ':
                format = dataView.getUint16(offset, true);
                // 1 = PCM, 3 = IEEE float, 6 = A-law, 7 = mu-law
                if (format !== 1 && format !== 3 && format !== 6 && format !== 7) {
                    log.error('Unsupported WAV format', format);
                }

                channels = dataView.getUint16(offset + 2, true);
                sampleRate = dataView.getUint32(offset + 4, true);
                bitDepth = dataView.getUint16(offset + 14, true);
                offset += chunkSize;
                break;

            case 'data':
                // Found data chunk, stop scanning
                offset += chunkSize;
                break;

            default:
                // Skip unknown chunks (e.g., JUNK)
                offset += chunkSize;
                break;
        }
    }

    return { sampleRate, bitDepth, channels };
}

/**
 * Extracts a string from a DataView.
 * @param {DataView} view - DataView containing binary data.
 * @param {number} start - Start offset.
 * @param {number} length - Number of bytes to extract.
 * @returns {string} - Extracted string.
 */
function getString(view, start, length) {
    return new TextDecoder().decode(view.buffer.slice(start, start + length));
}

