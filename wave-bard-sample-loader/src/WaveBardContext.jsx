// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { waveBardScales } from './data/scales';
import { waveBardRhythms } from './data/rhythms';
import { defaultAudioProcessing } from './data/audioProcessing';


const WaveBardContext = createContext();

const WaveBardContextProvider = ({ children }) => {
    const [banks, setBanks] = useState([]);
    const [scales, setScales] = useState(waveBardScales);
    const [rhythms, setRhythms] = useState(waveBardRhythms);
    const [sequencerLength, setSequencerLength] = useState(16);
    const [firmware, setFirmware] = useState(null);
    const [bitDepth, setBitDepth] = useState(16);
    const [sampleRate, setSampleRate] = useState(44100);
    const [name, setName] = useState('Default');
    const [audioProcessing, setAudioProcessing] = useState(defaultAudioProcessing);

    // Determine if any audio processing is enabled
    const audioProcessingEnabled = useMemo(() => {
        return audioProcessing.fadeIn || audioProcessing.fadeOut ||
            audioProcessing.trim || audioProcessing.normalize;
    }, [audioProcessing]);

    return (
        <WaveBardContext.Provider
            value={{
                banks,
                scales,
                rhythms,
                sequencerLength,
                firmware,
                bitDepth,
                sampleRate,
                name,
                audioProcessing,
                audioProcessingEnabled,
                setBanks,
                setScales,
                setRhythms,
                setSequencerLength,
                setBitDepth,
                setSampleRate,
                setName,
                setAudioProcessing,
                setFirmware
            }}
        >
            {children}
        </WaveBardContext.Provider >
    );
};

WaveBardContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { WaveBardContext, WaveBardContextProvider };