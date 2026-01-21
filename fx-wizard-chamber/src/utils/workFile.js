// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import generateId from '@bastl-react/utils/generateId';
import getCurrentTimestamp from '@bastl-react/utils/getCurrentTimestamp';
import { fxWizardSequencerLength } from '../data/sequencer';

const workfileData = 'data.json';
const workfileExtension = 'fxwizard';
const workfileName = 'draft';

function saveWorkFile(fxWizardContext) {
    return new Promise((resolve) => {
        const replacer = (key, value) => {
            if (value instanceof Uint8Array) {
                return Array.from(value);
            }
            if (value instanceof ArrayBuffer) {
                return Array.from(new Uint8Array(value));
            }
            return value;
        };

        const jsonData = JSON.stringify({
            rhythms: fxWizardContext.rhythms,
            sequencerLength: fxWizardContext.sequencerLength
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

function loadWorkFile(file, fxWizardContext) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            loadBlob(event.target.result, fxWizardContext).then(() => {
                resolve();
            });
        };
        reader.readAsArrayBuffer(file);
    });
}

function loadBlob(blob, fxWizardContext) {
    return new Promise((resolve) => {
        JSZip.loadAsync(blob).then((zip) => {
            zip.file(workfileData).async('text').then((data) => {
                const json = JSON.parse(data);
                if (json) {

                    // Process rhythms data
                    if (json.rhythms) {
                        json.rhythms.forEach((rhythm) => {
                            if (!rhythm.id) {
                                rhythm.id = generateId();
                            }
                        });
                    }

                    fxWizardContext.setRhythms(json.rhythms || []);
                    fxWizardContext.setSequencerLength(json.sequencerLength || fxWizardSequencerLength);

                    setTimeout(resolve, 1000);
                }
            });
        });
    });
}

export { loadBlob, saveWorkFile, loadWorkFile, workfileExtension };