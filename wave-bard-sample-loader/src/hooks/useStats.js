// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useMemo, useContext } from 'react';
import calculateMemoryUsage from '../utils/calculateUsage';
import config from '../config';
import { WaveBardContext } from '../WaveBardContext';

export default function useStats() {

    const waveBardContext = useContext(WaveBardContext);
    const { banks, scales, rhythms, bitDepth, sampleRate } = waveBardContext;

    return useMemo(() => {

        const maxTimeMono = Math.floor(config.memorySize / sampleRate * 8 / bitDepth);
        const memoryUsage = calculateMemoryUsage(banks, scales, rhythms);
        const isProcessing = banks.some((bank) => bank.samples.some((sample) => sample.isProcessing));
        const inconsistentSamplesError = !banks.every((b1) => banks.every((b2) => b1.samples.length === b2.samples.length));
        const minimalSamplesBanks = banks.filter((bank) => bank.samples.length < config.minSamples).length;
        const maximalSamplesBanks = banks.filter((bank) => bank.samples.length > config.maxSamples).length;

        const memoryUsageError = memoryUsage > config.memorySize;
        const noBanksError = banks.length === 0;
        const scalesError = scales.some((scale) => scale.semitones === 0);
        const rhythmsError = rhythms.some((rhythm) => rhythm.steps === 0);
        const minimalRhythmsError = rhythms.length < config.minRhythms;
        const maximalRhythmsError = rhythms.length > config.maxRhythms;
        const minimalScalesError = scales.length < config.minScales;
        const maximalScalesError = scales.length > config.maxScales;

        const generateDisabled = (
            isProcessing ||
            memoryUsageError ||
            noBanksError ||
            scalesError ||
            rhythmsError ||
            inconsistentSamplesError ||
            minimalSamplesBanks > 0 ||
            maximalSamplesBanks > 0 ||
            minimalScalesError ||
            maximalScalesError ||
            minimalRhythmsError ||
            maximalRhythmsError
        );

        return {
            maxTimeMono,
            memoryUsage,
            isProcessing,
            generateDisabled,
            memoryUsageError,
            noBanksError,
            scalesError,
            rhythmsError,
            inconsistentSamplesError,
            minimalSamplesBanks,
            maximalSamplesBanks,
            minimalScalesError,
            maximalScalesError,
            minimalRhythmsError,
            maximalRhythmsError
        };
    }, [banks, scales, rhythms, bitDepth, sampleRate]);
}
