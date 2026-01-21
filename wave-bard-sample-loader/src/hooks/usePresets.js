// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import log from 'loglevel';
import { useContext, useEffect, useState } from 'react';
import config from '../config';
import { UiContext } from '@bastl-react/UiContext.jsx';
import { trackEvent } from '@bastl-react/utils/analytics';
import generateId from '@bastl-react/utils/generateId';
import noCacheFetch from '@bastl-react/utils/noCacheFetch';
import bankColors from '../data/bankColors';
import { loadBlob } from '../utils/workFile';
import { waveBardScales } from '../data/scales.js';
import { waveBardRhythms } from '../data/rhythms.js';
import xeatPresets from '../xeatPresets';
import decodeXeat from '@bastl-react/utils/decodeXeat';
import { WaveBardContext } from '../WaveBardContext.jsx';
import { defaultSequencerLength } from '@bastl-react/data/sequencer.js';

const emptyPreset = {
    id: 'empty',
    name: 'Empty',
    banks: [
        {
            id: generateId(),
            color: bankColors[Math.floor(Math.random() * bankColors.length)],
            label: 'Bank',
            samples: []
        }
    ],
    scales: waveBardScales,
    rhythms: waveBardRhythms
};

const xeatPresetsNice = xeatPresets.map((x) => ({
    xeat: decodeXeat(x.xeat),
    id: decodeXeat(x.id),
    name: decodeXeat(x.name),
    filename: decodeXeat(x.xile),
    content: decodeXeat(x.content),
    banner: x.banner,
    logo: x.logo,
    play: x.play
}));

const xeatMap = xeatPresetsNice.map((x) => ({ id: x.id, xeat: x.xeat }));

export default function usePresets() {

    const uiContext = useContext(UiContext);
    const { setLoadingMessage } = uiContext;

    const waveBardContext = useContext(WaveBardContext);
    const { setBanks, setScales, setRhythms, setSequencerLength, setBitDepth, setSampleRate, setName, setAudioProcessing } = waveBardContext;

    const [presets, setPresets] = useState([emptyPreset]);
    const [preset, setPreset] = useState(emptyPreset.id);
    const [firmwares, setFirmwares] = useState([]);
    const presetObj = presets?.find((x) => x.id === preset);

    const xeatCallbacks = Object.fromEntries(
        xeatMap.map((xeatPreset) => [
            xeatPreset.xeat,
            () => {
                // Add preset to the list
                if (!presets.find((x) => x.id === xeatPreset.id)) {
                    setPresets((prevPresets) => (
                        [xeatPresetsNice.find((x) => x.id === xeatPreset.id), ...prevPresets])
                    );
                }
                // Load preset
                setPreset(xeatPreset.id);
            }
        ])
    );

    // Load presets on startup
    useEffect(() => {
        const loadData = async () => {
            try {
                const presetsResponse = await noCacheFetch(config.presetsList);
                const firmwaresResponse = await noCacheFetch(config.firmwaresList);
                const presetsData = await presetsResponse.json();
                const firmwaresData = await firmwaresResponse.json();
                if (!presetsData.list?.length) {
                    log.error('No presets found in the list');
                    return;
                }
                if (!firmwaresData.list?.length) {
                    log.error('No firmwares found in the list');
                    return;
                }
                if (firmwaresData.list.filter((x) => x.default).length !== 1) {
                    log.error('Cannot find default firmware');
                    return;
                }
                setPresets([...presetsData.list, emptyPreset]);
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

    // When user changes preset, load it
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const presetObj = presets.find((p) => p.id === preset);
        if (presetObj?.filename) {
            setLoadingMessage('Loading');
            fetch(presetObj.filename, { signal }).then((response) => {
                if (!response.ok) {
                    log.error('Failed to load preset');
                    return;
                }
                return response.blob();
            }).then((blob) => {
                // Set data-preset attribute on the body for the custom styles
                document.body.setAttribute('data-preset', preset);
                loadBlob(blob, waveBardContext).then(() => {
                    setLoadingMessage('');
                });
            }).catch((error) => {
                if (error.name !== 'AbortError') {
                    log.error('Fetch error:', error);
                }
            });
            if (!presetObj.default) {
                trackEvent('custom_preset_load', { preset });
            }
        }
        else {
            if (preset !== 'empty') {
                log.error('Preset not found', preset);
                setPreset('empty');
            } else {
                // It's empty
                setBanks(emptyPreset.banks);
                setScales(emptyPreset.scales);
                setRhythms(emptyPreset.rhythms);
                setSequencerLength(defaultSequencerLength);
                setBitDepth(16);
                setSampleRate(44100);
                setName('Empty Preset');
                setAudioProcessing(true);
            }
        }
        return () => {
            controller.abort();
        };
        // Dont put waveBardContext otherwise it crashes with circular dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preset,
        presets,
        setAudioProcessing,
        setBanks,
        setBitDepth,
        setLoadingMessage,
        setName,
        setRhythms,
        setSampleRate,
        setScales,
        setSequencerLength]);



    return {
        presets,
        presetObj,
        setPresets,
        preset,
        setPreset,
        firmwares,
        xeatMap,
        xeatCallbacks
    };
}
