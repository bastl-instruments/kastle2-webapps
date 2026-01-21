// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useContext } from 'react';
import { WaveBardContext } from '../WaveBardContext';
import { generateBinaryData } from '../utils/generateBinaryData';
import { generateUf2, validateUf2, mergeUf2, UF2_FAMILY_ID, USER_DATA_BEGIN } from '@bastl-react/utils/uf2Utils';
import { saveAs } from 'file-saver';

function useFirmwareGeneration() {
    const waveBardContext = useContext(WaveBardContext);

    const generateUf2Firmware = async () => {
        // Convert the samples and make a UF2 file from them
        const samplesBinArray = generateBinaryData(waveBardContext);
        const samplesUf2Blob = generateUf2(UF2_FAMILY_ID, USER_DATA_BEGIN, samplesBinArray);
        const firmwareFilePath = waveBardContext.firmware?.filename;
        const outputFileName = waveBardContext.firmware?.output || 'firmware.uf2';

        // Download firmware
        const response = await fetch(firmwareFilePath);
        const firmwareBlob = await response.blob();
        // Merge the firmware and samples
        const mergedUf2Blob = await mergeUf2([firmwareBlob, samplesUf2Blob], true);
        // Validate it
        const isValid = await validateUf2(mergedUf2Blob);
        if (isValid) {
            // Offer for download
            saveAs(mergedUf2Blob, outputFileName);
        }
    };

    const generateBinarySamples = () => {
        const firmwareArray = generateBinaryData(waveBardContext);
        const blob = new Blob([firmwareArray], { type: 'application/octet-stream' });
        // Offer for download
        saveAs(blob, 'USER_DATA.bin');
    };

    return {
        generateUf2Firmware,
        generateBinarySamples
    };
}

export default useFirmwareGeneration;