// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { fxWizardRhythms } from './data/rhythms';
import { fxWizardSequencerLength } from './data/sequencer';

const FxWizardContext = createContext();

const FxWizardContextProvider = ({ children }) => {
    const [rhythms, setRhythms] = useState(fxWizardRhythms);
    const [firmware, setFirmware] = useState(null);
    const [sequencerLength, setSequencerLength] = useState(fxWizardSequencerLength);

    return (
        <FxWizardContext.Provider
            value={{
                rhythms,
                firmware,
                sequencerLength,
                setRhythms,
                setFirmware,
                setSequencerLength
            }}
        >
            {children}
        </FxWizardContext.Provider>
    );
};

FxWizardContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { FxWizardContext, FxWizardContextProvider };