// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import log from 'loglevel';
import { WaveFile } from 'wavefile';
import customAudioBufferToWav from './customAudioBufferToWav';
import getAudioContext from './getAudioContext';

/**
 * Converts audio data to a different bitDepth, sampleRate and channels.
 * It uses the Web Audio API to decode the audio data.
 *
 * @param {ArrayBuffer} source - The audio data to convert.
 * @param {number} bitDepth - The bit depth to convert to.
 * @param {number} sampleRate - The sample rate to convert to.
 * @param {number} channels - The number of channels to convert to.
 * @returns {Promise<Object>} - The converted audio data.
 */
export default async function convertAudio(source, bitDepth, sampleRate, channels) {
    try {
        const ctx = await getAudioContext();
        const decodedAudio = await ctx.decodeAudioData(source.slice(0));

        const wavData = customAudioBufferToWav(decodedAudio, { monoMix: channels === 1 });
        log.debug('🔊 WAV conversion start.', { bitDepth, sampleRate, channels });

        const wavFile = new WaveFile(new Uint8Array(wavData));
        wavFile.toBitDepth(bitDepth);
        wavFile.toSampleRate(sampleRate);
        const convertedWavData = wavFile.toBuffer();

        log.debug('🔊 WAV conversion complete. Length: ', convertedWavData.length);
        return { soundData: convertedWavData };
    } catch (e) {
        log.debug('Error with decoding audio data', e);
        throw e; // Propagate the error
    }
}