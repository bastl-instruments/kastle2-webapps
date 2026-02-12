// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import classNames from 'classnames';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState, useMemo } from 'react';
import { Tooltip } from 'react-tooltip';

// Shared components
import Button from '@bastl-react/components/Button';
import FilePickerButton from '@bastl-react/components/FilePickerButton';
import InputRow from '@bastl-react/components/InputRow';
import Selector from '@bastl-react/components/Selector';
import SimpleOverlay from '@bastl-react/components/SimpleOverlay';
import StorageBar from '@bastl-react/components/StorageBar';
import AdvancedModeBadge from '@bastl-react/components/AdvancedModeBadge';
import Xeats from '@bastl-react/components/Xeats';
import FirmwareGeneratedDialog from '@bastl-react/components/FirmwareGeneratedDialog';
import Footer from '@bastl-react/components/Footer';
import Header from '@bastl-react/components/Header';
import RhythmsEditor from '@bastl-react/components/RhythmsEditor';
import ScalesEditor from '@bastl-react/components/ScalesEditor';
import Bubble from '@bastl-react/components/Bubble';

// Shared utils
import playNote from '@bastl-react/audio/playNote';
import { initAnalytics, trackEvent } from '@bastl-react/utils/analytics';

// App components
import Banks from './components/Banks';
import IntroDialog from './components/IntroDialog';

// App utils
import style from './App.module.scss';
import { UiContext, AdvancedModeContent } from '@bastl-react/UiContext';
import { WaveBardContext } from './WaveBardContext';
import config from './config';
import useFileOperations from './hooks/useFileOperations';
import useFirmwareGeneration from './hooks/useFirmwareGeneration';
import { workfileExtension } from './utils/workFile';

// Data
import { waveBardScales } from './data/scales';
import { waveBardRhythms } from './data/rhythms';
import { audioProcessingOptions } from './data/audioProcessing';
import { sequencerLengths } from '@bastl-react/data/sequencer';

// App hooks
import useStats from './hooks/useStats';
import usePresets from './hooks/usePresets';
import useSamplePlayer from './hooks/useSamplePlayer';
import useSampleProcessing from './hooks/useSampleProcessing';
import decodeXeat from '@bastl-react/utils/decodeXeat';


function App({ noIntro = false }) {
    const [showIntroDialog, setShowIntroDialog] = useState(false);
    const [disableFirmwareDialog, setDisableFirmwareDialog] = useState(false);
    const [showFirmwareDialog, setShowFirmwareDialog] = useState(false);
    const [scalesDialogActive, setScalesDialogActive] = useState(false);
    const [rhythmsDialogActive, setRhythmsDialogActive] = useState(false);

    // Contexts
    const uiContext = useContext(UiContext);
    const waveBardContext = useContext(WaveBardContext);

    // Initialize operations
    const fileOperations = useFileOperations();
    const { generateUf2Firmware, generateBinarySamples } = useFirmwareGeneration();

    // Custom hooks for processing and other functionalities
    const { playRandomSample } = useSamplePlayer();
    const { presets, preset, presetObj, setPreset, firmwares, xeatCallbacks } = usePresets();
    useSampleProcessing();
    const stats = useStats();

    // Show intro dialog on startup
    useEffect(() => {
        if (!noIntro) {
            setShowIntroDialog(true);
        }
    }, [noIntro]);


    // Set default firmware
    const setFirmware = waveBardContext.setFirmware;
    useEffect(() => {
        const defaultFirmware = firmwares.find((x) => x.default);
        if (defaultFirmware) {
            setFirmware(defaultFirmware);
        }
    }, [firmwares, setFirmware]);

    // When user clicks on the "Let's begin" button in the intro dialog
    const initApp = () => {
        playNote(2, 0.5); // Plays a short note forcing audio context to init
        initAnalytics();
        setShowIntroDialog(false);
        const defaultPreset = presets.find((x) => x.default);
        if (defaultPreset) {
            setPreset(defaultPreset.id);
        }
    };

    const handleGenerateFirmware = () => {
        if (!waveBardContext.firmware) {
            log.error('Cannot find default firmware');
            return;
        }
        trackEvent('firmware_download');
        generateUf2Firmware().then(() => {
            if (!disableFirmwareDialog) {
                setShowFirmwareDialog(true);
            }
        });
    };

    // Audio processing settings derived from state and configuration
    const audioProcessingSelector = useMemo(() =>
        audioProcessingOptions.map((option) => ({
            ...option,
            enabled: waveBardContext.audioProcessing[option.stateKey],
            displayValue: waveBardContext.audioProcessing[option.valueKey]
        })),
        [waveBardContext.audioProcessing]
    );

    return (
        <>
            <Xeats
                xeats={{
                    ...xeatCallbacks,
                    [decodeXeat('i*d*k*f*a')]: uiContext.toggleAdvancedMode
                }}
            />
            <IntroDialog
                isOpen={showIntroDialog}
                onCloseClick={initApp}
            />
            <FirmwareGeneratedDialog
                isOpen={showFirmwareDialog}
                onCloseClick={(dis) => {
                    setShowFirmwareDialog(false);
                    setDisableFirmwareDialog(dis);
                }}
            />
            <div
                className={classNames(style.app, { [style.appProcessing]: stats.isProcessing })}
                onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files[0];
                    fileOperations.loadFile(file, null);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <AdvancedModeBadge />
                <Header
                    onClicks={{
                        bird: playRandomSample
                    }}
                    title={
                        <>
                            Bastl<br />
                            Instruments<br />
                            Wave Bard<br />
                            Sample Loader
                        </>
                    }
                    customBanner={presetObj?.banner}
                    customLogo={presetObj?.logo}
                />
                <div className={style.controls}>
                    <div className={style.controlsLeft}>
                        <Selector
                            id="preset-selector"
                            label="Preset"
                            className={style.control}
                            onChange={setPreset}
                            value={preset}
                            options={presets.filter((x) => (!x.hidden || uiContext.advancedMode)).map((x) => ({
                                value: x.id,
                                label: x.name.toLocaleUpperCase()
                            }))}
                        />
                        <Selector
                            id="quality-selector"
                            label="Quality"
                            className={style.control}
                            onChange={(val) => {
                                waveBardContext.setSampleRate(parseInt(val, 10));
                            }}
                            value={waveBardContext.sampleRate}
                            options={config.sampleRates}
                        />
                        <Selector
                            id="process-samples-selector"
                            label="Process samples"
                            multiple
                            value={audioProcessingSelector.filter((setting) => setting.enabled).map((setting) => setting.key)}
                            className={style.control}
                            onChange={
                                (keys) => {
                                    waveBardContext.setAudioProcessing((oldAudioProcessing) => {
                                        const newAudioProcessing = { ...oldAudioProcessing };
                                        audioProcessingSelector.forEach((setting) => {
                                            newAudioProcessing[setting.key] = keys.includes(setting.key);
                                        });
                                        return newAudioProcessing;
                                    });
                                }
                            }
                            options={audioProcessingSelector.map((setting) => (
                                {
                                    value: setting.key,
                                    short: setting.short,
                                    label: `${setting.label} (${setting.unitNote}${setting.displayValue}${setting.unit})`
                                }
                            ))}
                        />
                        <InputRow>
                            <Button
                                id="scaleEditor"
                                onClick={() => setScalesDialogActive(true)}
                                label="Scales Editor"
                            />
                            <Button
                                id="rhythmEditor"
                                onClick={() => setRhythmsDialogActive(true)}
                                label="Rhythms Editor"
                            />
                        </InputRow>
                    </div>
                    <div className={style.controlsRight}>
                        <InputRow>
                            <StorageBar
                                used={stats.memoryUsage}
                                total={config.memorySize}
                                label={<>MEMORY USED (MAX {stats.maxTimeMono}s MONO)</>}
                            />
                        </InputRow>
                        <Selector
                            grid
                            id="sequencer-length-selector"
                            label="Sequencer"
                            className={style.control}
                            onChange={(val) => {
                                waveBardContext.setSequencerLength(val);
                            }}
                            value={waveBardContext.sequencerLength}
                            options={sequencerLengths}
                        />
                        <AdvancedModeContent>
                            <Selector
                                id="firmware-selector"
                                label="Firmware"
                                className={style.control}
                                onChange={(val) => {
                                    waveBardContext.setFirmware(firmwares.find((x) => x.filename === val));
                                }}
                                value={waveBardContext.firmware?.filename || ''}
                                options={firmwares.map((x) => ({
                                    value: x.filename,
                                    label: x.label
                                }))}
                            />
                        </AdvancedModeContent>
                        <InputRow
                            className={style.firmwareButtons}
                        >
                            <Button
                                disabled={stats.memoryUsageError}
                                label="SAVE"
                                className={style.squareButton}
                                id="save-draft-button"
                                onClick={fileOperations.saveCurrentWorkFile}
                            />
                            <FilePickerButton
                                buttonProps={{
                                    label: 'LOAD',
                                    id: 'load-draft-button',
                                    className: style.squareButton
                                }}
                                accept={`.${workfileExtension},.uf2`}
                                onChange={(files) => {
                                    const file = files ? files[0] : null;
                                    fileOperations.loadFile(file, 'Unsupported file type. Please use a UF2 or a draft file.');
                                }}
                            />

                            <Button
                                disabled={stats.generateDisabled}
                                label="GENERATE FIRMWARE"
                                id="generate-firmware-button"
                                style={{ flexGrow: 1 }}
                                onClick={handleGenerateFirmware}
                            />

                            <AdvancedModeContent>
                                <Button
                                    disabled={stats.generateDisabled}
                                    label="GENERATE BIN"
                                    onClick={generateBinarySamples}
                                />
                            </AdvancedModeContent>
                        </InputRow>
                        <Tooltip
                            anchorSelect="#generate-firmware-button"
                            className={stats.generateDisabled ? style.buttonTooltipError : style.buttonTooltip}
                            place="bottom-center"
                        >
                            {stats.generateDisabled &&
                                <ul>
                                    {(stats.minimalSamplesBanks > 0) && <li>Some banks don&apos;t contain enough samples (at least {config.minSamples}).</li>}
                                    {(stats.maximalSamplesBanks > 0) && <li>Some banks have too much samples (more than {config.maxSamples}).</li>}
                                    {stats.inconsistentSamplesError && <li>All banks need to have the same amount of samples.</li>}
                                    {stats.memoryUsageError && <li>Memory usage is too high.</li>}
                                    {stats.noBanksError && <li>There are no banks.</li>}
                                    {stats.scalesError && <li>Invalid scales.</li>}
                                    {stats.rhythmsError && <li>Invalid rhythms.</li>}
                                    {stats.minimalScalesError && <li>Not enough scales (at least {config.minScales}).</li>}
                                    {stats.maximalScalesError && <li>Too much scales (more than {config.maxScales}).</li>}
                                    {stats.minimalRhythmsError && <li>Not enough rhythms (at least {config.minRhythms}).</li>}
                                    {stats.maximalRhythmsError && <li>Too much rhythms (more than {config.maxRhythms}).</li>}
                                </ul>
                            }
                            {!stats.generateDisabled &&
                                <>
                                    Generate a UF2 firmware file<br />
                                    and upload it to the Wave Bard.<br />
                                    Be patient. Copying takes a lot of time!
                                </>
                            }
                        </Tooltip>
                        <Tooltip
                            anchorSelect="#load-draft-button"
                            className={style.buttonTooltip}
                            place="bottom-center"
                        >
                            Load a firmware file<br />
                            or a draft file<br />
                            you saved previously.
                        </Tooltip>
                        <Tooltip
                            anchorSelect="#save-draft-button"
                            className={style.buttonTooltip}
                            place="bottom-center"
                        >
                            Save a draft file<br />
                            to your computer,<br />
                            to continue later.
                        </Tooltip>
                    </div>
                </div>
                <Banks
                    banks={waveBardContext.banks}
                    setBanks={waveBardContext.setBanks}
                />
                <ScalesEditor
                    isOpen={scalesDialogActive}
                    onCloseClick={() => setScalesDialogActive(false)}
                    scales={waveBardContext.scales}
                    setScales={waveBardContext.setScales}
                    defaultScales={waveBardScales}
                />
                <RhythmsEditor
                    isOpen={rhythmsDialogActive}
                    onCloseClick={() => setRhythmsDialogActive(false)}
                    rhythms={waveBardContext.rhythms}
                    setRhythms={waveBardContext.setRhythms}
                    defaultRhythms={waveBardRhythms}
                    sequencerLength={waveBardContext.sequencerLength}
                />
                <SimpleOverlay
                    active={!!uiContext.loadingMessage}
                    message={uiContext.loadingMessage}
                    animated
                />
                <SimpleOverlay
                    active={!!uiContext.customMessage}
                    message={uiContext.customMessage}
                    onCloseClick={() => uiContext.setCustomMessage(null)}
                />
                <SimpleOverlay
                    error
                    active={!!uiContext.errorMessage}
                    message={uiContext.errorMessage}
                    onCloseClick={() => uiContext.setErrorMessage('')}
                />
                <Footer>
                    <p>
                        Supported browsers: Chrome 76+, Edge 79+, Firefox 76+, Safari 13+ and their derivatives (all desktop)
                        <br />
                        Supported audio formats: MP3, WAV, OGG, AAC, M4A, AIFF (can differ by browser/platform)
                    </p>
                    <p>
                        Memory size: {(config.memorySize / 1024 / 1024)} MiB
                        <br />
                        Banks: min {config.minBanks}, max {config.maxBanks}; Samples per bank: min {config.minSamples}, max {config.maxSamples} (must be the same for all banks)<br />
                        Scales: min {config.minScales}, max {config.maxScales}; Rhythms: min {config.minScales}, max {config.maxScales}
                    </p>
                </Footer>
                {presetObj && presetObj.content &&
                    <Bubble
                        position="bottom"
                    >
                        <div dangerouslySetInnerHTML={{ __html: presetObj.content }} />
                    </Bubble>
                }
            </div>
        </>
    );
}

App.propTypes = {
    noIntro: PropTypes.bool
};

export default App;
