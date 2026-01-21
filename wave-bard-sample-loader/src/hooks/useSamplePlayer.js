// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useRef, useContext } from 'react';
import log from 'loglevel';
import { WaveBardContext } from '../WaveBardContext';

export default function useSamplePlayer() {
    const audioRef = useRef(null);
    const { banks } = useContext(WaveBardContext);

    const playSample = (bankNum, sampleNum) => {
        // Stop any currently playing sample
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // Check if there are any samples to play
        if (banks.length === 0 || banks.every((bank) => bank.samples.length === 0)) {
            return;
        }

        const bank = banks[bankNum];
        if (!bank?.samples?.length) {
            return;
        }

        const sample = bank.samples[sampleNum];
        if (sample?.processed?.soundData) {
            const audio = new Audio();
            audio.setAttribute('playsinline', ''); // enables inline playback on iOS
            audio.preload = 'auto';
            const blob = new Blob([sample.processed.soundData], { type: 'audio/wav' });
            audio.src = URL.createObjectURL(blob);
            audioRef.current = audio;
            audio.load();
            audio.play().catch((err) => {
                // Optional: handle playback errors here
                log.error('Audio play failed:', err);
            });
        }
    };

    const playRandomSample = () => {
        // Check if there are any samples to play
        if (banks.length === 0 || banks.every((bank) => bank.samples.length === 0)) {
            return;
        }
        // Pick random bank
        const bankNum = Math.floor(Math.random() * banks.length);
        const bank = banks[bankNum];
        if (!bank.samples.length) {
            return;
        }
        // Pick random sample from bank
        const sampleNum = Math.floor(Math.random() * bank.samples.length);
        playSample(bankNum, sampleNum);
    };



    return { playRandomSample, playSample };
}
