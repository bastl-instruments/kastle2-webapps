// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import playNote from '../audio/playNote';
import Cross from '../icons/Cross';
import Move from '../icons/Move';
import generateId from '../utils/generateId';
import objectToString from '../utils/objectToString';
import { minRhythms, maxRhythms } from '../data/rhythms';
import Button from './Button';
import Dialog from './Dialog';
import IconButton from './IconButton';
import Knob from './Knob';
import styles from './RhythmsEditor.module.scss';
import scalesEditorStyles from './ScalesEditor.module.scss';
import Plus from '../icons/Plus';
import { UiContext } from '../UiContext';

// Configuration
const STEPS = 16;
const BASE_NOTE = 60; // C3
const KEY_PLAY_INTERVAL = 100; // ms

// Create an array of 16 steps - for rendering the steps
const steps = Array.from({ length: STEPS });

// Helper function to get the bit for a step index
// The steps are actually reversed compared to the scale semitones
const stepBit = (i) => 1 << (STEPS - 1 - i);

function Rhythm({ rhythm, index, totalRhythms, setStep, removeRhythm, handleProps, isDragging, onPlayStop, isPlaying, activeStep, sequencerLength }) {
    const invalid = rhythm.steps === 0;

    useEffect(() => {
        if (activeStep >= 0 && activeStep < STEPS) {
            if ((rhythm.steps & stepBit(activeStep)) !== 0) {
                playNote(BASE_NOTE, 0.3, -0.1);
            }
        }
        // We dont want rhythm.steps here so it doesn't trigger the effect when already playing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep]);

    return (
        <div
            className={classNames(scalesEditorStyles.scale, invalid ? scalesEditorStyles.invalid : '', isDragging ? scalesEditorStyles.dragging : '')}
        >
            <div className={scalesEditorStyles.smallKnobSpace}>
                <Knob
                    className={scalesEditorStyles.knob}
                    index={index}
                    total={totalRhythms}
                />
            </div>
            <span
                {...handleProps}
                className={scalesEditorStyles.move}
            >
                <Move />
            </span>
            <button
                role="button"
                className={scalesEditorStyles.name}
                onClick={() => onPlayStop(rhythm.id)}
                disabled={invalid}
            >
                {isPlaying ? 'Stop' : 'Play'}
            </button>
            <div
                className={styles.steps}
            >
                {steps.map((_, stepIndex) => {
                    const isChecked = (rhythm.steps & stepBit(stepIndex)) !== 0;
                    return (
                        <Fragment
                            key={stepIndex}
                        >
                            {stepIndex % 4 === 0 && <div className={styles.separator} />}
                            <label
                                data-step-index={stepIndex}
                                className={`${styles.step}  ${isChecked ? styles.checked : ''}  ${activeStep === stepIndex ? styles.active : ''}  ${stepIndex >= sequencerLength ? styles.inactive : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                        setStep(rhythm.id, stepIndex);
                                    }}
                                />
                            </label>
                        </Fragment>
                    );
                })}
            </div>
            <IconButton
                className={scalesEditorStyles.remove}
                onClick={removeRhythm}
                disabled={!removeRhythm}
                icon={Cross}
            />
        </div >
    );
}

Rhythm.propTypes = {
    rhythm: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    totalRhythms: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    removeRhythm: PropTypes.func,
    handleProps: PropTypes.object.isRequired,
    isDragging: PropTypes.bool,
    onPlayStop: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    activeStep: PropTypes.number.isRequired,
    sequencerLength: PropTypes.number.isRequired
};

function SortableRhythm({ rhythm, index, totalRhythms, setStep, removeRhythm, onPlayStop, isPlaying, activeStep, sequencerLength }) {
    const { attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging } = useSortable({ id: rhythm.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 6 : 0
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <Rhythm
                handleProps={listeners}
                rhythm={rhythm}
                isDragging={isDragging}
                index={index}
                totalRhythms={totalRhythms}
                setStep={setStep}
                removeRhythm={removeRhythm}
                onPlayStop={onPlayStop}
                isPlaying={isPlaying}
                activeStep={activeStep}
                sequencerLength={sequencerLength}
            />
        </div>
    );
}

SortableRhythm.propTypes = {
    rhythm: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    totalRhythms: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    removeRhythm: PropTypes.func,
    onPlayStop: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    activeStep: PropTypes.number.isRequired,
    sequencerLength: PropTypes.number.isRequired
};


function RhythmsEditor({ isOpen, onCloseClick, rhythms, setRhythms, defaultRhythms, sequencerLength = 16 }) {
    const [playingRhythmId, setPlayingRhythmId] = useState(null);
    const [activeStep, setActiveStep] = useState(-1);
    const intervalId = useRef(null);
    const rhythmsContainerRef = useRef(null);
    const { advancedMode } = useContext(UiContext);

    if(sequencerLength < 1 || sequencerLength > STEPS) {
        sequencerLength = STEPS;
    }

    const setStep = useCallback((scaleId, stepIndex) => {
        setRhythms((prev) => {
            const newRhythms = [...prev];
            const rhythmIndex = newRhythms.findIndex((rhythm) => rhythm.id === scaleId);
            if (rhythmIndex === -1) {
                return newRhythms;
            }

            const newRhythm = { ...newRhythms[rhythmIndex] };
            newRhythm.steps = newRhythm.steps ^ stepBit(stepIndex);
            newRhythms[rhythmIndex] = newRhythm;
            return newRhythms;
        });
    }, [setRhythms]);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setRhythms((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, [setRhythms]);

    const addRhythm = useCallback(() => {
        setRhythms((prev) => {
            const newRhythm = {
                id: generateId(),
                steps: 0b1000100010001000
            };
            // Scroll to the new scale
            setTimeout(() => {
                if (rhythmsContainerRef.current) {
                    rhythmsContainerRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                        inline: 'nearest'
                    });
                }
            }, 0);
            return [...prev, newRhythm];
        });
    }, [setRhythms]);

    const handlePlayStop = useCallback((id) => {
        clearInterval(intervalId.current);
        if (playingRhythmId === id) {
            setPlayingRhythmId(null);
            setActiveStep(-1);
        } else {
            setPlayingRhythmId(id);
            setActiveStep(0);
            intervalId.current = setInterval(() => {
                setActiveStep((prevStep) => (prevStep + 1) % sequencerLength);
            }, KEY_PLAY_INTERVAL);
        }
    }, [playingRhythmId, sequencerLength]);

    useEffect(() => {
        return () => clearInterval(intervalId.current);
    }, []);

    return (
        <Dialog
            isOpen={isOpen}
            onCloseClick={onCloseClick}
            width="wide"
            fullscreen
            buttons={
                <>
                    <Button
                        inverse
                        icon={Plus}
                        onClick={addRhythm}
                        label="Add Rhythm"
                        disabled={rhythms.length >= maxRhythms}
                    />
                    {advancedMode &&
                        <Button
                            inverse
                            onClick={() => {
                                log.info(objectToString(rhythms, 16, ['steps']));
                            }}
                            label="Dump rhythms into log"
                        />
                    }
                    <Button
                        inverse
                        label="Confirm rhythms"
                        onClick={onCloseClick}
                    />
                    <Button
                        inverse
                        label="Revert to default"
                        onClick={() => setRhythms([...defaultRhythms])}
                    />
                </>
            }
        >
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={rhythms}
                    strategy={verticalListSortingStrategy}
                >
                    <div
                        className={scalesEditorStyles.scales}
                        ref={rhythmsContainerRef}
                    >
                        {rhythms.map((rhythm, rhythmIndex) => (
                            <SortableRhythm
                                key={rhythm.id}
                                index={rhythmIndex}
                                totalRhythms={rhythms.length}
                                setStep={setStep}
                                removeRhythm={rhythms.length > minRhythms ? () => {
                                    if (playingRhythmId === rhythm.id) {
                                        clearInterval(intervalId.current);
                                        setPlayingRhythmId(null);
                                        setActiveStep(-1);
                                    }
                                    setRhythms((prev) => prev.filter((s) => s.id !== rhythm.id));
                                } : null}
                                rhythm={rhythm}
                                onPlayStop={handlePlayStop}
                                isPlaying={playingRhythmId === rhythm.id}
                                activeStep={playingRhythmId === rhythm.id ? activeStep : -1}
                                sequencerLength={sequencerLength}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </Dialog>
    );
};

RhythmsEditor.propTypes = {
    isOpen: PropTypes.bool,
    onCloseClick: PropTypes.func.isRequired,
    rhythms: PropTypes.array.isRequired,
    setRhythms: PropTypes.func.isRequired,
    defaultRhythms: PropTypes.array.isRequired,
    sequencerLength: PropTypes.number
};

export default RhythmsEditor;
