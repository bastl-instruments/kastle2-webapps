// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import classNames from 'classnames';
import { useContext } from 'react';
import { UiContext } from '@bastl-react/UiContext';
import Move from '@bastl-react/icons/Move';
import Stereo from '@bastl-react/icons/Stereo';
import ButtonRow from '@bastl-react/components/ButtonRow';
import styles from './Sample.module.scss';
//import FilePickerIconButton from './FilePickerIconButton';
import Cross from '@bastl-react/icons/Cross';
import IconButton from '@bastl-react/components/IconButton';
import iconButtonStyles from '@bastl-react/components/IconButton.module.scss';
import Knob from '@bastl-react/components/Knob';
import SoundButton from './SoundButton';
import config from '../config';
import PropTypes from 'prop-types';

function Sample({
    sortableParams,
    handleParams,
    index,
    samplesCount,
    id,
    isProcessing,
    isDragging,
    stereo,
    original,
    needsProcessing,
    label,
    processed,
    updateSample,
    deleteSample,
    className,
    loadFile }) {

    const uiContext = useContext(UiContext);
    const stereoAvailable = original?.info?.channels === 2;
    const knobIndex = index < (config.maxSamples - 1) ? index : (config.maxSamples - 1);
    const knobCount = samplesCount < config.maxSamples ? samplesCount : config.maxSamples;

    return (
        <div
            key={id}
            {...sortableParams}
            className={classNames(styles.sample, className, {
                [styles.isProcessing]: isProcessing,
                [styles.isDragging]: isDragging,
                [styles.invalid]: index >= config.maxSamples
            })}
        >
            <Knob
                className={styles.knob}
                index={knobIndex}
                total={knobCount}
            />
            <ButtonRow
                shadow={isDragging}
                className={styles.buttonRow}
            >
                <span
                    {...handleParams}
                    className={`${styles.move} ${iconButtonStyles.iconButton}`}
                    title="Move sample"
                >
                    <Move />
                </span>
                {/*
                <FilePickerIconButton
                accept=".mp3,.wav,.ogg,.m4a,.aac,.aiff"
                onChange={loadFile ? ((files) => files && files.length === 1 ? loadFile(id, files[0]) : null) : null}
                />
                */}
                <IconButton
                    disabled={!stereoAvailable}
                    inactive={!stereo}
                    title={stereoAvailable ? (stereo ? 'Stereo enabled' : 'Stereo disabled') : 'Stereo not available'}
                    icon={Stereo}
                    onClick={loadFile ? (() => stereoAvailable ? updateSample(id, { stereo: !stereo, needsProcessing: true }) : null) : null}
                />
                {uiContext?.advancedMode && (
                    <input
                        type="text"
                        className={styles.labelEditor}
                        value={label}
                        onChange={(e) => updateSample(id, { label: e.target.value })}
                    />
                )}
                <SoundButton
                    shouldBeStopped={isProcessing || needsProcessing}
                    className={styles.label}
                    label={uiContext?.advancedMode ? 'Play' : label}
                    soundData={processed?.soundData}
                />
                <IconButton
                    title="Delete sample"
                    icon={Cross}
                    onClick={deleteSample ? () => deleteSample(id) : null}
                />
            </ButtonRow>
        </div>
    );
}

Sample.propTypes = {
    sortableParams: PropTypes.object,
    handleParams: PropTypes.object,
    index: PropTypes.number.isRequired,
    samplesCount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isProcessing: PropTypes.bool,
    isDragging: PropTypes.bool,
    stereo: PropTypes.bool,
    original: PropTypes.object,
    needsProcessing: PropTypes.bool,
    label: PropTypes.string,
    processed: PropTypes.object,
    updateSample: PropTypes.func,
    deleteSample: PropTypes.func,
    className: PropTypes.string,
    loadFile: PropTypes.func,
};

export default Sample;