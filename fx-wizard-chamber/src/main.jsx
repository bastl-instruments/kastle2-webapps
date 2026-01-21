// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { setScrollbarWidthProperty } from '@bastl-react/utils/calculateScrollbarWidth';
import log from 'loglevel';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App.jsx';
import './main.scss';
import { UiContextProvider } from '@bastl-react/UiContext';
import { FxWizardContextProvider } from './FxWizardContext';

// Params
const params = new URLSearchParams(window.location.search);

const defaultAdvancedMode = params.get('advanced') === '1';
const noIntro = params.get('no-intro') === '1';
const logLevel = params.get('log') || 'info';

// Initialize loglevel (trace, debug, info, warn, error, silent)
log.setLevel(logLevel);
log.info('Welcome to the FX Wizard Chamber! 🧙‍♂️');

// Calculate scrollbar width and set as CSS variable
document.addEventListener('DOMContentLoaded', () => {
    const scrollbarWidth = setScrollbarWidthProperty();
    log.debug('Scrollbar width:', scrollbarWidth);
});

// Create the app itself
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UiContextProvider
            defaultAdvancedMode={defaultAdvancedMode}
        >
            <FxWizardContextProvider>
                <App
                    noIntro={noIntro}
                />
            </FxWizardContextProvider>
        </UiContextProvider>
    </StrictMode>,
);
