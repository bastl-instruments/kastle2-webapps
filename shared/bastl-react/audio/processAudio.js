// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { WaveFile } from 'wavefile';
import log from 'loglevel';
import dbsToFloat from './dbsToFloat';

function logAtTime(t, total) {
    const base = 10;
    return Math.log10(total / (total + (base - 1) * t)) + 1;
}

export default function processAudio(source, {
    fadeIn, normalize, trim, normalizeDbs, trimDbs, fadeInSeconds, fadeOut, fadeOutSeconds
}) {
    log.debug('🛠️ Processing audio', {
        fadeIn, normalize, trim, normalizeDbs, trimDbs, fadeInSeconds, fadeOut, fadeOutSeconds
    });
    return new Promise((resolve, reject) => {

        const wavFile = new WaveFile(new Uint8Array(source));
        const bitDepth = wavFile.bitDepth;
        const sampleRate = wavFile.fmt.sampleRate;
        const channels = wavFile.fmt.numChannels;

        let audioSamples = wavFile.getSamples(true);

        let max = 0;
        let min = 0;
        let shift = 0;

        switch (bitDepth) {
            case '8':
                max = 127;
                min = -128;
                shift = 128;
                break;
            case '16':
                max = 32767;
                min = -32768;
                break;
            case '24':
                max = 8388607;
                min = -8388607;
                break;
            case '32f':
                max = 1;
                min = -1;
                break;
            default:
                reject();
                return;
        }

        // shift (for unsigned 8bit) - it's easier to proccess it like this
        if (shift) {
            for (let i = 0; i < audioSamples.length; i++) {
                audioSamples[i] -= shift;
            }
        }



        // 8b must be "fixed" aka zeroed :( there are some weird things on start and end
        if (bitDepth === '8') {
            for (let i = 0; i < 10 && i < audioSamples.length; i++) {
                audioSamples[i] = 0;
                audioSamples[audioSamples.length - i - 1] = 0;
            }
        }

        if (trim) {
            const trimThreshold = dbsToFloat(trimDbs) * max;
            let start = 0;
            let end = audioSamples.length - 1;
            let anyFound = false;
            for (let i = 0; i < audioSamples.length; i++) {
                if (audioSamples[i] >= trimThreshold || audioSamples[i] <= -trimThreshold) {
                    start = i;
                    anyFound = true;
                    break;
                }
            }
            for (let i = audioSamples.length - 1; i > 0; i--) {
                if (audioSamples[i] >= trimThreshold || audioSamples[i] <= -trimThreshold) {
                    end = i;
                    break;
                }
            }
            // round start and end to channels
            start -= start % channels;
            end += channels - (end % channels);

            if (anyFound) {
                audioSamples = audioSamples.slice(start, end);
            } else {
                audioSamples = Array(Math.round(sampleRate / 1000)).fill(0);
            }
        }


        if (normalize) {
            const normalizeVal = dbsToFloat(normalizeDbs);
            // find max
            let foundMax = 0;
            let foundMin = 0;
            for (let i = 0; i < audioSamples.length; i++) {
                if (audioSamples[i] > foundMax) {
                    foundMax = audioSamples[i];
                }
                if (audioSamples[i] < foundMin) {
                    foundMin = audioSamples[i];
                }
            }
            // find mult
            const multPos = (max * normalizeVal) / foundMax;
            const multNeg = (min * normalizeVal) / foundMin;

            // take the smaller one
            const mult = multPos < multNeg ? multPos : multNeg;

            // amplify all
            for (let i = 0; i < audioSamples.length; i++) {
                audioSamples[i] *= mult;
            }
        }

        if (fadeIn) {
            const fadeInLength = fadeInSeconds * sampleRate;
            for (let i = 0; i < fadeInLength && i < audioSamples.length; i++) {
                const mult = logAtTime(fadeInLength - i, fadeInLength);
                if (channels === 1) {
                    audioSamples[i] *= mult;
                } else if (channels === 2) {
                    audioSamples[2 * i] *= mult;
                    audioSamples[2 * i + 1] *= mult;
                }
            }
        }
        if (fadeOut) {
            const fadeOutLength = fadeOutSeconds * sampleRate;
            for (let i = 0; i < fadeOutLength && i < audioSamples.length; i++) {
                const mult = logAtTime(fadeOutLength - i, fadeOutLength);
                if (channels === 1) {
                    audioSamples[audioSamples.length - i] *= mult;
                } else if (channels === 2) {
                    audioSamples[audioSamples.length - 2 * i] *= mult;
                    audioSamples[audioSamples.length - 2 * (i + 1)] *= mult;
                }
            }
        }

        // shift (for unsigned 8bit) - it's easier to proccess it like this
        if (shift) {
            for (let i = 0; i < audioSamples.length; i++) {
                audioSamples[i] += shift;
            }
        }

        const outputWavFile = new WaveFile();
        outputWavFile.fromScratch(channels, sampleRate, bitDepth, audioSamples);

        const duration = audioSamples.length / sampleRate / channels;
        const soundData = outputWavFile.toBuffer();

        resolve({
            soundData,
            size: soundData.length,
            duration
        });
    });
}