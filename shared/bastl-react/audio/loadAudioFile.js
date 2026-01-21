// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import getAudioInfo from './getAudioInfo';
import getAudioContext from './getAudioContext';

/**
 * Using FileReader it loads file and decodes it to raw samples.
 * It also gets audio info like duration and channels.
 *
 * @param {File} file - The file to load.
 * @returns {Promise<Object>} - The loaded audio data.
 */
export default async function loadAudioFile(file) {
    try {
        const rdr = new FileReader();
        const soundData = await new Promise((resolve, reject) => {
            rdr.onload = (ev) => resolve(ev.target.result);
            rdr.onerror = reject;
            rdr.readAsArrayBuffer(file);
        });
        const audioInfo = await getAudioInfo(soundData, file.type);
        const audioContext = await getAudioContext();
        const decodedAudio = await audioContext.decodeAudioData(soundData.slice(0));
        return {
            soundData,
            size: file.size,
            duration: decodedAudio.duration,
            info: audioInfo
        };
    } catch (e) {
        throw new Error(`Error loading audio file: ${e.message}`);
    }
}