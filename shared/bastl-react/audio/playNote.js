// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import getAudioContext from './getAudioContext';

/**
 * Convert a MIDI note to a frequency in Hz.
 * @param {number} midiNote - The MIDI note to convert (0-127).
 * @returns {number} - The frequency in Hz.
 */
const midiToFrequency = (midiNote) => {
    // Clamp MIDI note value between 0 and 127
    const clampedMidiNote = Math.max(0, Math.min(127, midiNote));
    return 440 * Math.pow(2, (clampedMidiNote - 69) / 12);
};

/**
 * Play a MIDI note using a simple FM synthesis.
 * @param {number} midiNote - The MIDI note to play (0-127).
 * @param {number} [length=0.5] - The length of the note in seconds.
 * @param {number} [pitchEnvelope=0] - The pitch envelope amount (0 means no change, -1 means pitch down by 2, -2 pitch down by 4, etc.).
 */
export default async function playNote(midiNote, length = 0.5, pitchEnvelope = 0) {
    const audioCtx = await getAudioContext();
    const frequency = midiToFrequency(midiNote);

    // Carrier oscillator (main tone)
    const carrier = audioCtx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Apply pitch envelope to carrier
    const finalCarrierFrequency = frequency * Math.pow(2, pitchEnvelope);
    carrier.frequency.exponentialRampToValueAtTime(finalCarrierFrequency, audioCtx.currentTime + length);

    // Modulator oscillator (FM effect)
    const modulator = audioCtx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(frequency * 3, audioCtx.currentTime); // 3rd harmonic modulation

    // Apply pitch envelope to modulator
    const finalModulatorFrequency = (frequency * 3) * Math.pow(2, pitchEnvelope);
    modulator.frequency.exponentialRampToValueAtTime(finalModulatorFrequency, audioCtx.currentTime + length);

    // Modulation depth (how much the modulator affects the carrier)
    const modGain = audioCtx.createGain();
    modGain.gain.setValueAtTime(frequency * 0.7, audioCtx.currentTime); // Adjust for a piano-like effect

    // Envelope for volume (mimic piano's natural decay)
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + length);

    // Connect FM synthesis: modulator → gain → carrier frequency
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    // Connect the final audio output
    carrier.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start and stop the oscillators
    carrier.start();
    modulator.start();
    carrier.stop(audioCtx.currentTime + length);
    modulator.stop(audioCtx.currentTime + length);
};