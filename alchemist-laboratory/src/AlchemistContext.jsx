// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { alchemistScales } from './data/scales';
import { alchemistRhythms } from './data/rhythms';
import { defaultSequencerLength } from '@bastl-react/data/sequencer';

const AlchemistContext = createContext();

const AlchemistContextProvider = ({ children }) => {
    const [scales, setScales] = useState(alchemistScales);
    const [rhythms, setRhythms] = useState(alchemistRhythms);
    const [firmware, setFirmware] = useState(null);
    const [sequencerLength, setSequencerLength] = useState(defaultSequencerLength);

    return (
        <AlchemistContext.Provider
            value={{
                scales,
                rhythms,
                firmware,
                sequencerLength,
                setScales,
                setRhythms,
                setFirmware,
                setSequencerLength
            }}
        >
            {children}
        </AlchemistContext.Provider>
    );
};

AlchemistContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AlchemistContext, AlchemistContextProvider };