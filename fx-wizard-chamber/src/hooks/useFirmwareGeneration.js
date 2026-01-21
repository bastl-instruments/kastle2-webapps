// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useContext } from 'react';
import { FxWizardContext } from '../FxWizardContext';
import { generateBinaryData } from '../utils/generateFirmware';
import { generateUf2, validateUf2, mergeUf2, UF2_FAMILY_ID, USER_DATA_BEGIN } from '@bastl-react/utils/uf2Utils';
import { saveAs } from 'file-saver';
import useFirmwares from './useFirmwares';

function useFirmwareGeneration() {
    const fxWizardContext = useContext(FxWizardContext);
    const { firmwares } = useFirmwares();
    const firmware = fxWizardContext.firmware || firmwares.find((x) => x.default);

    const generateUf2Firmware = async () => {

        // Convert the data and make a UF2 file from them
        const binArray = generateBinaryData(fxWizardContext);
        const uf2Blob = generateUf2(UF2_FAMILY_ID, USER_DATA_BEGIN, binArray);
        const firmwareFilePath = firmware?.filename;
        const outputFileName = firmware?.output || 'firmware.uf2';

        // Download firmware
        const response = await fetch(firmwareFilePath);
        const firmwareBlob = await response.blob();
        // Merge the firmware and data
        const mergedUf2Blob = await mergeUf2([firmwareBlob, uf2Blob], true);
        // Validate it
        const isValid = await validateUf2(mergedUf2Blob);
        if (isValid) {
            // Offer for download
            saveAs(mergedUf2Blob, outputFileName);
        }
    };

    const generateBinarySamples = () => {
        const firmwareArray = generateBinaryData(fxWizardContext);
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