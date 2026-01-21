// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useContext } from 'react';
import log from 'loglevel';
import { AlchemistContext } from '../AlchemistContext';
import { UiContext } from '@bastl-react/UiContext';
import { parseFirmware } from '../utils/parseFirmware';
import { saveWorkFile, loadWorkFile, workfileExtension } from '../utils/workFile';
import { defaultSequencerLength } from '@bastl-react/data/sequencer';


export default function useFileOperations() {
    const alchemistContext = useContext(AlchemistContext);
    const uiContext = useContext(UiContext);

    const loadFile = async (file, unsupportedMessage = null) => {
        if (!file?.name) {
            return;
        }

        const isUf2 = file.name.endsWith('.uf2');
        const isDraft = file.name.endsWith(`.${workfileExtension}`);

        if (!isUf2 && !isDraft) {
            uiContext.setErrorMessage(
                unsupportedMessage || 'Unsupported file type. Please use a UF2 or a draft file.'
            );
            return;
        }

        try {
            uiContext.setLoadingMessage('Loading');

            if (isUf2) {
                const firmware = await parseFirmware(file);
                if (firmware) {
                    alchemistContext.setScales(firmware.scales || []);
                    alchemistContext.setRhythms(firmware.rhythms || []);
                    alchemistContext.setSequencerLength(firmware.sequencerLength || defaultSequencerLength);
                } else {
                    throw new Error('Failed to parse firmware');
                }
            } else if (isDraft) {
                await loadWorkFile(file, alchemistContext);
            }
        } catch (error) {
            log.error('Error loading file:', error);
            uiContext.setErrorMessage('Failed to load file, probably corrupted or incorrect.');
        } finally {
            uiContext.setLoadingMessage('');
        }
    };

    const saveCurrentWorkFile = async () => {
        try {
            uiContext.setLoadingMessage('Compressing');
            await saveWorkFile(alchemistContext);
        } catch (error) {
            log.error('Error saving work file:', error);
            uiContext.setErrorMessage('Failed to save work file.');
        } finally {
            uiContext.setLoadingMessage('');
        }
    };

    return {
        loadFile,
        saveCurrentWorkFile
    };
}