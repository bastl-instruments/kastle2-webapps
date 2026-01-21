// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useMemo, useContext } from 'react';
import config from '../config';
import { AlchemistContext } from '../AlchemistContext';

export default function useStats() {

    const alchemistContext = useContext(AlchemistContext);
    const { scales, rhythms } = alchemistContext;

    return useMemo(() => {

        const scalesError = scales.some((scale) => scale.semitones === 0);
        const rhythmsError = rhythms.some((rhythm) => rhythm.steps === 0);
        const minimalRhythmsError = rhythms.length < config.minRhythms;
        const maximalRhythmsError = rhythms.length > config.maxRhythms;
        const minimalScalesError = scales.length < config.minScales;
        const maximalScalesError = scales.length > config.maxScales;

        const generateDisabled = (
            scalesError ||
            rhythmsError ||
            minimalScalesError ||
            maximalScalesError ||
            minimalRhythmsError ||
            maximalRhythmsError
        );

        return {
            generateDisabled,
            scalesError,
            rhythmsError,
            minimalScalesError,
            maximalScalesError,
            minimalRhythmsError,
            maximalRhythmsError
        };
    }, [scales, rhythms]);
}
