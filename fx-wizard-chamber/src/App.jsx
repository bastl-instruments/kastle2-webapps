// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import classNames from 'classnames';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

// Shared components
import Button from '@bastl-react/components/Button';
import FilePickerButton from '@bastl-react/components/FilePickerButton';
import InputRow from '@bastl-react/components/InputRow';
import Selector from '@bastl-react/components/Selector';
import SimpleOverlay from '@bastl-react/components/SimpleOverlay';
import Xeats from '@bastl-react/components/Xeats';
import FirmwareGeneratedDialog from '@bastl-react/components/FirmwareGeneratedDialog';
import Footer from '@bastl-react/components/Footer';
import Header from '@bastl-react/components/Header';
import AdvancedModeBadge from '@bastl-react/components/AdvancedModeBadge';
import RhythmsEditor from '@bastl-react/components/RhythmsEditor';

// Shared utils
import { initAnalytics, trackEvent } from '@bastl-react/utils/analytics';

// App components
import IntroDialog from './components/IntroDialog';

// Contexts
import { UiContext, AdvancedModeContent } from '@bastl-react/UiContext';
import { FxWizardContext } from './FxWizardContext';

// Styles
import style from './App.module.scss';

// File handling
import useFileOperations from './hooks/useFileOperations';
import useFirmwareGeneration from './hooks/useFirmwareGeneration';
import { workfileExtension } from './utils/workFile';
import useFirmwares from './hooks/useFirmwares';

// Data
import { fxWizardRhythms } from './data/rhythms';
import { minRhythms, maxRhythms } from '@bastl-react/data/rhythms';
import useStats from './hooks/useStats';
import { sequencerLengths } from '@bastl-react/data/sequencer';


// App hooks
import decodeXeat from '@bastl-react/utils/decodeXeat';

function App({ noIntro = false }) {
    const [showIntroDialog, setShowIntroDialog] = useState(false);
    const [disableFirmwareDialog, setDisableFirmwareDialog] = useState(false);
    const [showFirmwareDialog, setShowFirmwareDialog] = useState(false);
    const [rhythmsDialogActive, setRhythmsDialogActive] = useState(false);

    // Contexts
    const uiContext = useContext(UiContext);
    const fxWizardContext = useContext(FxWizardContext);

    // Initialize operations
    const fileOperations = useFileOperations();
    const { generateUf2Firmware, generateBinarySamples } = useFirmwareGeneration();

    const { firmwares } = useFirmwares();
    const stats = useStats();


    // Show intro dialog on startup
    useEffect(() => {
        if (!noIntro) {
            setShowIntroDialog(true);
        }
    }, [noIntro]);


    // When user clicks on the "Let's begin" button in the intro dialog
    const initApp = () => {
        initAnalytics();
        setShowIntroDialog(false);
    };

    const handleGenerateFirmware = () => {
        const f = fxWizardContext.firmware || firmwares.find((x) => x.default);
        if (!f) {
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

    return (
        <>
            <Xeats
                xeats={{
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
                className={classNames(style.app, { [style.appProcessing]: false })}
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
                    title={
                        <>
                            Bastl<br />
                            Instruments<br />
                            FX Wizard<br />
                            Chamber
                        </>
                    }
                />
                <div className={style.controls}>
                    <InputRow>
                        <Button
                            id="rhythmEditor"
                            className={style.growButton}
                            onClick={() => setRhythmsDialogActive(true)}
                            label="Rhythms Editor"
                        />
                    </InputRow>
                    <InputRow>
                        <Selector
                            className={style.growButton}
                            id="sequencer-length-selector"
                            label="Sequencer"
                            onChange={(val) => {
                                fxWizardContext.setSequencerLength(val);
                            }}
                            value={fxWizardContext.sequencerLength}
                            options={sequencerLengths}
                        />
                    </InputRow>

                    <AdvancedModeContent>
                        <InputRow>
                            <Selector
                                id="firmware-selector"
                                label="Firmware"
                                className={style.growButton}
                                onChange={(val) => {
                                    fxWizardContext.setFirmware(firmwares.find((x) => x.filename === val));
                                }}
                                value={fxWizardContext.firmware?.filename || ''}
                                options={firmwares.map((x) => ({
                                    value: x.filename,
                                    label: x.label
                                }))}
                            />
                        </InputRow>
                    </AdvancedModeContent>
                    <InputRow
                        className={style.firmwareButtons}
                    >
                        <Button
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
                            label="GENERATE FIRMWARE"
                            id="generate-firmware-button"
                            className={style.growButton}
                            onClick={handleGenerateFirmware}
                        />

                        <AdvancedModeContent>
                            <Button
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
                                {stats.rhythmsError && <li>Invalid rhythms.</li>}
                                {stats.minimalRhythmsError && <li>Not enough rhythms (at least {minRhythms}).</li>}
                                {stats.maximalRhythmsError && <li>Too much rhythms (more than {maxRhythms}).</li>}
                            </ul>
                        }
                        {!stats.generateDisabled &&
                            <>
                                Generate a UF2 firmware file<br />
                                and upload it to the FX Wizard.<br />
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
                <RhythmsEditor
                    isOpen={rhythmsDialogActive}
                    onCloseClick={() => setRhythmsDialogActive(false)}
                    rhythms={fxWizardContext.rhythms}
                    setRhythms={fxWizardContext.setRhythms}
                    defaultRhythms={fxWizardRhythms}
                    sequencerLength={fxWizardContext.sequencerLength}
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
                        Rhythms: min {minRhythms}, max {maxRhythms}
                    </p>
                </Footer>
            </div>
        </>
    );
}

App.propTypes = {
    noIntro: PropTypes.bool
};


export default App;
