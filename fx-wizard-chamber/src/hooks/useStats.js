// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useMemo, useContext } from 'react';
import config from '../config';
import { FxWizardContext } from '../FxWizardContext';

export default function useStats() {

    const fxWizardContext = useContext(FxWizardContext);
    const { rhythms } = fxWizardContext;

    return useMemo(() => {


        const rhythmsError = rhythms.some((rhythm) => rhythm.steps === 0);
        const minimalRhythmsError = rhythms.length < config.minRhythms;
        const maximalRhythmsError = rhythms.length > config.maxRhythms;


        const generateDisabled = (
            rhythmsError ||
            minimalRhythmsError ||
            maximalRhythmsError
        );

        return {
            generateDisabled,
            rhythmsError,
            minimalRhythmsError,
            maximalRhythmsError
        };
    }, [rhythms]);
}
