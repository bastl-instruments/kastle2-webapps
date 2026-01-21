// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

let audioContext = null;

/**
 * Returns the audio context so we can use it in multiple places without creating multiple instances.
 * Multiple instances break the browser's audio system and it won't allow us to create more.
 *
 * @returns {Promise<AudioContext>}
 */
async function getAudioContext() {
    if (!audioContext) {
        audioContext = new window.AudioContext();
    }
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
    return audioContext;
}

export default getAudioContext;