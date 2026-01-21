// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import log from 'loglevel';
import { useEffect, useState } from 'react';
import config from '../config';
import noCacheFetch from '@bastl-react/utils/noCacheFetch';

export default function useFirmwares() {
    const [firmwares, setFirmwares] = useState([]);
    // Load firmwares on startup
    useEffect(() => {
        const loadData = async () => {
            try {
                const firmwaresResponse = await noCacheFetch(config.firmwaresList);
                const firmwaresData = await firmwaresResponse.json();
                if (!firmwaresData.list?.length) {
                    log.error('No firmwares found in the list');
                    return;
                }
                if (firmwaresData.list.filter((x) => x.default).length !== 1) {
                    log.error('Cannot find default firmware');
                    return;
                }
                for (const fw of firmwaresData.list) {
                    fw.label = fw.filename.replace('firmwares/', '').replace('-no-samples', '').replace('.uf2', '');
                }
                setFirmwares(firmwaresData.list);
            } catch (error) {
                log.error('Failed to load presets or firmwares', error);
            }
        };
        loadData();
    }, []);
    return {
        firmwares
    };
}
