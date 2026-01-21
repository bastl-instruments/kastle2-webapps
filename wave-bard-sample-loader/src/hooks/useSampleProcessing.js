// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useEffect, useContext } from 'react';
import log from 'loglevel';
import { UiContext } from '@bastl-react/UiContext';
import { WaveBardContext } from '../WaveBardContext';
import convertAudio from '@bastl-react/audio/convertAudio';
import processAudio from '@bastl-react/audio/processAudio';

export default function useSampleProcessing() {
    const uiContext = useContext(UiContext);
    const waveBardContext = useContext(WaveBardContext);
    const { banks, bitDepth, sampleRate, audioProcessing, setBanks, audioProcessingEnabled } = waveBardContext;
    const { setErrorMessage } = uiContext;

    // When changing the settings, flag samples for conversion
    useEffect(() => {
        setBanks((prevBanks) => {
            return prevBanks.map((bank) => ({
                ...bank,
                samples: bank.samples.map((sample) => ({
                    ...sample,
                    processed: null,
                    needsProcessing: !!sample.original
                }))
            }));
        });
    }, [bitDepth, sampleRate, audioProcessing, setBanks]);

    // Auto convert if necessary
    useEffect(() => {
        banks.forEach((bank, bankIndex) => {
            bank.samples.forEach((sample, sampleIndex) => {
                if ((sample.needsProcessing || !sample.processed) && sample.original && !sample.isProcessing) {
                    // Starts converting
                    setBanks((prevBanks) => {
                        const newBanks = [...prevBanks];
                        newBanks[bankIndex].samples[sampleIndex].isProcessing = true;
                        return newBanks;
                    });
                    convertAudio(sample.original.soundData,
                        bitDepth,
                        sampleRate,
                        sample.stereo ? 2 : 1
                    ).then((conversionResult) => {
                        // Do we want to process audio?
                        if (audioProcessingEnabled) {
                            // Yes, process the audio
                            processAudio(
                                conversionResult.soundData,
                                audioProcessing
                            ).then((processResult) => {
                                // Adding it
                                setBanks((prevBanks) => {
                                    const newBanks = [...prevBanks];
                                    newBanks[bankIndex].samples[sampleIndex] = {
                                        ...sample,
                                        processed: processResult,
                                        needsProcessing: false,
                                        isProcessing: false
                                    };
                                    return newBanks;
                                });
                            });
                        } else {
                            // Nope, just update the sample
                            setBanks((prevBanks) => {
                                const newBanks = [...prevBanks];
                                newBanks[bankIndex].samples[sampleIndex] = {
                                    ...sample,
                                    processed: conversionResult,
                                    needsProcessing: false,
                                    isProcessing: false
                                };
                                return newBanks;
                            });
                        }
                    }).catch((e) => {
                        log.error('Failed to convert audio sample.', e);
                        setBanks((prevBanks) => {
                            const newBanks = [...prevBanks];
                            newBanks[bankIndex].samples[sampleIndex].needsProcessing = false;
                            newBanks[bankIndex].samples[sampleIndex].isProcessing = false;
                            return newBanks;
                        });
                        setErrorMessage('Failed to convert audio sample.');
                    });
                }
            });
        });
    }, [banks, bitDepth, sampleRate, audioProcessing, audioProcessingEnabled, setBanks, setErrorMessage]);
}
