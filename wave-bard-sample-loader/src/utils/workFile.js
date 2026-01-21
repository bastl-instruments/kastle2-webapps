// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import generateId from '@bastl-react/utils/generateId';
import getCurrentTimestamp from '@bastl-react/utils/getCurrentTimestamp';
import { defaultSequencerLength } from '@bastl-react/data/sequencer';

const workfileData = 'data.json';
const workfileExtension = 'wavebard';
const workfileName = 'draft';

function saveWorkFile(waveBardContext) {
    return new Promise((resolve) => {
        const replacer = (key, value) => {
            if (key === 'needsProcessing' ||
                key === 'isProcessing' ||
                key === 'processed' ||
                key === 'activeKnob'
            ) {
                return undefined;
            }
            if (value instanceof Uint8Array) {
                return Array.from(value);
            }
            if (value instanceof ArrayBuffer) {
                return Array.from(new Uint8Array(value));
            }
            return value;
        };

        const jsonData = JSON.stringify({
            bitDepth: waveBardContext.bitDepth,
            sampleRate: waveBardContext.sampleRate,
            name: waveBardContext.name,
            audioProcessing: waveBardContext.audioProcessing,
            sequencerLength: waveBardContext.sequencerLength,
            scales: waveBardContext.scales,
            rhythms: waveBardContext.rhythms,
            banks: waveBardContext.banks,
        }, replacer);
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        const zipFile = new JSZip();
        zipFile.file(workfileData, jsonBlob);
        zipFile.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then((content) => {
            saveAs(content, `${workfileName}-${getCurrentTimestamp()}.${workfileExtension}`);
            resolve();
        });
    });
};

function loadBlob(blob, waveBardContext) {
    return new Promise((resolve) => {
        JSZip.loadAsync(blob).then((zip) => {
            zip.file(workfileData).async('text').then((data) => {
                const json = JSON.parse(data);
                if (json) {
                    // Process banks data
                    json.banks.forEach((bank) => {
                        bank.samples.forEach((sample) => {
                            if (!sample.id) {
                                sample.id = generateId();
                            }
                            if (sample.original && sample.original.soundData) {
                                sample.needsProcessing = true;
                                sample.original.soundData = new Uint8Array(sample.original.soundData).buffer;
                            }
                        });
                    });

                    // Process scales data
                    if (json.scales) {
                        json.scales.forEach((scale) => {
                            if (!scale.id) {
                                scale.id = generateId();
                            }
                        });
                    }

                    // Process rhythms data
                    if (json.rhythms) {
                        json.rhythms.forEach((rhythm) => {
                            if (!rhythm.id) {
                                rhythm.id = generateId();
                            }
                        });
                    }

                    // Load all data through context
                    waveBardContext.setBanks(json.banks);
                    waveBardContext.setScales(json.scales || []);
                    waveBardContext.setRhythms(json.rhythms || []);
                    waveBardContext.setSequencerLength(json.sequencerLength || defaultSequencerLength);

                    // Old method for compatibility with older workfiles
                    if (json.settings !== undefined) {
                        waveBardContext.setBitDepth(json.settings?.bitDepth);
                        waveBardContext.setSampleRate(json.settings?.sampleRate);
                        waveBardContext.setName(json.settings?.name);
                        waveBardContext.setAudioProcessing(json.settings?.audioProcessing);
                    } else {
                        waveBardContext.setBitDepth(json.bitDepth);
                        waveBardContext.setSampleRate(json.sampleRate);
                        waveBardContext.setName(json.name);
                        waveBardContext.setAudioProcessing(json.audioProcessing);
                    }

                    setTimeout(resolve, 1000);
                }
            });
        });
    });
}

function loadWorkFile(file, waveBardContext) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            loadBlob(event.target.result, waveBardContext).then(() => {
                resolve();
            });
        };
        reader.readAsArrayBuffer(file);
    });
}

export { loadBlob, saveWorkFile, loadWorkFile, workfileExtension };