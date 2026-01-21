// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';

const UiContext = createContext();

const UiContextProvider = ({ children, defaultAdvancedMode }) => {
    // UI Messages state
    const [loadingMessage, setLoadingMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [customMessage, setCustomMessage] = useState(null);

    // UI state
    const [advancedMode, setAdvancedMode] = useState(defaultAdvancedMode || false);

    // Toggle advanced mode
    const toggleAdvancedMode = () => {
        setAdvancedMode((x) => {
            x = !x;
            log.info('👹 Advanced mode', x);
            return x;
        });
    };

    return (
        <UiContext.Provider
            value={{
                loadingMessage,
                errorMessage,
                customMessage,
                advancedMode,
                setLoadingMessage,
                setErrorMessage,
                setCustomMessage,
                setAdvancedMode,
                toggleAdvancedMode
            }}
        >
            {children}
        </UiContext.Provider>
    );
};

UiContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
    defaultAdvancedMode: PropTypes.bool,
};

const AdvancedModeContent = ({ children }) => {
    const { advancedMode } = useContext(UiContext);
    if (!advancedMode) {
        return <></>;
    }
    return (
        <>
            {children}
        </>
    );
};


export { UiContext, UiContextProvider, AdvancedModeContent };