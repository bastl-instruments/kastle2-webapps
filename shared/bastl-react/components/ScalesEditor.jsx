// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useCallback, useContext, useRef, useState } from 'react';
import { sharedScales, minScales, maxScales } from '../data/scales';
import styles from './ScalesEditor.module.scss';
import playNote from '../audio/playNote';
import Button from './Button';
import Dialog from './Dialog';
import IconButton from './IconButton';
import Knob from './Knob';
import Cross from '../icons/Cross';
import Move from '../icons/Move';
import Plus from '../icons/Plus';
import Play from '../icons/Play';
import generateId from '../utils/generateId';
import objectToString from '../utils/objectToString';
import { UiContext } from '../UiContext';

// Configuration
const BASE_NOTE = 60; // C4
const KEY_PLAY_INTERVAL = 150; // ms

// Create an array of 12 keys - for rendering the keys
const keys = Array.from({ length: 12 });

// Helper function to get the bit for a key index
const keyBit = (i) => 1 << (i);


function Scale({ scale, index, totalScales, setSemitone, removeScale, handleProps, isDragging, onNameChange }) {
    const invalid = scale.semitones === 0;
    const [activeKey, setActiveKey] = useState(-1);
    const timeoutIds = useRef([]);
    const playScale = useCallback(() => {
        // Clear any existing timeouts
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];
        let i = 0;
        keys.forEach((_, keyIndex) => {
            if ((scale.semitones & keyBit(keyIndex)) !== 0) {
                const timeoutId = setTimeout(() => {
                    playNote(BASE_NOTE + keyIndex, 0.6);
                    setActiveKey(keyIndex);
                }, KEY_PLAY_INTERVAL * i);
                timeoutIds.current.push(timeoutId);
                i++;
            }
        });
        // Clear the activeKey after the last note
        const clearActiveKeyTimeoutId = setTimeout(() => {
            setActiveKey(-1);
        }, KEY_PLAY_INTERVAL * i);
        timeoutIds.current.push(clearActiveKeyTimeoutId);
    }, [scale.semitones]);

    return (
        <div
            className={classNames(styles.scale, invalid ? styles.invalid : '', isDragging ? styles.dragging : '')}
        >
            <div className={styles.knobSpace}>
                <Knob
                    className={styles.knob}
                    index={index}
                    total={totalScales}
                />
            </div>
            <span
                {...handleProps}
                className={styles.move}
            >
                <Move />
            </span>
            {onNameChange ? (
                <>
                    <IconButton
                        icon={Play}
                        className={styles.play}
                        onClick={playScale}
                    />
                    <input
                        type="text"
                        className={styles.nameInput}
                        value={scale.name}
                        onChange={(e) => onNameChange(e.target.value)}
                    />
                </>
            ) : (
                <button
                    role="button"
                    className={styles.name}
                    onClick={playScale}
                >
                    {scale.name}
                </button>
            )}
            <div
                className={styles.octave}
            >
                {keys.map((_, keyIndex) => {
                    const isChecked = (scale.semitones & keyBit(keyIndex)) !== 0;
                    const isBlack = [1, 3, 6, 8, 10].includes(keyIndex);
                    return (
                        <label
                            key={keyIndex}
                            data-key-index={keyIndex}
                            className={`${styles.key} ${isBlack ? styles.keyBlack : styles.keyWhite}  ${isChecked ? styles.keyChecked : ''}  ${activeKey === keyIndex ? styles.keyActive : ''}`}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                    setSemitone(scale.id, keyIndex);
                                    playNote(BASE_NOTE + keyIndex, 0.6);
                                }}
                            />
                        </label>
                    );
                })}
            </div>
            <IconButton
                className={styles.remove}
                onClick={removeScale}
                disabled={!removeScale}
                icon={Cross}
            />
        </div >
    );
}

Scale.propTypes = {
    scale: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    totalScales: PropTypes.number.isRequired,
    setSemitone: PropTypes.func.isRequired,
    removeScale: PropTypes.func,
    handleProps: PropTypes.object.isRequired,
    isDragging: PropTypes.bool,
    onNameChange: PropTypes.func
};


function SortableScale({ scale, index, totalScales, setSemitone, removeScale, onNameChange }) {
    const { attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging } = useSortable({ id: scale.id });

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
            <Scale
                handleProps={listeners}
                scale={scale}
                isDragging={isDragging}
                index={index}
                totalScales={totalScales}
                setSemitone={setSemitone}
                removeScale={removeScale}
                onNameChange={onNameChange}
            />
        </div>
    );
}

SortableScale.propTypes = {
    scale: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    totalScales: PropTypes.number.isRequired,
    setSemitone: PropTypes.func.isRequired,
    removeScale: PropTypes.func,
    onNameChange: PropTypes.func
};


function ScalesEditor({ scales, setScales, isOpen, onCloseClick, defaultScales }) {

    const scalesContainerRef = useRef(null);
    const allScales = [...defaultScales, ...sharedScales];
    const { advancedMode } = useContext(UiContext);

    // Semitone change action
    const setSemitone = useCallback((scaleId, keyIndex) => {
        setScales((prev) => {
            const newScales = [...prev];
            const scaleIndex = newScales.findIndex((scale) => scale.id === scaleId);
            if (scaleIndex === -1) {
                return newScales;
            }

            // Retrieve the new scale
            const newScale = { ...newScales[scaleIndex] };

            // Update the bit
            newScale.semitones = newScale.semitones ^ keyBit(keyIndex);

            // Try to find name
            const foundScale = allScales.find((scale) => scale.semitones === newScale.semitones);
            if (foundScale) {
                newScale.name = foundScale.name;
            } else if (newScale.semitones === 0) {
                newScale.name = 'Invalid';
            } else {
                newScale.name = 'Custom';
            }
            newScales[scaleIndex] = {
                ...newScale
            };
            return newScales;
        });
    }, [setScales]);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setScales((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, [setScales]);

    const addScale = useCallback(() => {
        setScales((prev) => {
            const newScale = {
                id: generateId(),
                name: 'Chromatic',
                semitones: 0b111111111111
            };
            // Scroll to the new scale
            setTimeout(() => {
                if (scalesContainerRef.current) {
                    scalesContainerRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                        inline: 'nearest'
                    });
                }
            }, 0);
            return [...prev, newScale];
        });
    }, [setScales]);

    return (
        <Dialog
            isOpen={isOpen}
            fullscreen
            buttons={
                <>
                    <Button
                        inverse
                        onClick={addScale}
                        label="Add Scale"
                        icon={Plus}
                        disabled={scales.length >= maxScales}
                    />
                    {advancedMode &&
                        <Button
                            inverse
                            onClick={() => {
                                log.info(objectToString(scales, 12, ['semitones']));
                            }}
                            label="Dump scales into log"
                        />
                    }
                    <Button
                        inverse
                        label="Confirm scales"
                        onClick={onCloseClick}
                    />
                    <Button
                        inverse
                        label="Revert to default"
                        onClick={() => setScales([...defaultScales])}
                    />
                </>
            }
        >
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={scales}
                    strategy={verticalListSortingStrategy}
                >
                    <div
                        className={styles.scales}
                        ref={scalesContainerRef}
                    >
                        {scales.map((scale, scaleIndex) => (
                            <SortableScale
                                key={scale.id}
                                index={scaleIndex}
                                totalScales={scales.length}
                                setSemitone={setSemitone}
                                removeScale={scales.length > minScales ? () => { setScales((prev) => prev.filter((s) => s.id !== scale.id)); } : null}
                                scale={scale}
                                onNameChange={advancedMode ? (newName) => {
                                    setScales((prev) => {
                                        const newScales = [...prev];
                                        const scaleIndex = newScales.findIndex((s) => s.id === scale.id);
                                        if (scaleIndex === -1) {
                                            return newScales;
                                        }
                                        newScales[scaleIndex] = {
                                            ...newScales[scaleIndex],
                                            name: newName
                                        };
                                        return newScales;
                                    });
                                } : null}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <div className={styles.scalesInfo}>
                The scale names are for an illustrative purpose only,<br /> the actual scale is defined by the semitones.
            </div>
        </Dialog>
    );
};

ScalesEditor.propTypes = {
    scales: PropTypes.array.isRequired,
    setScales: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    onCloseClick: PropTypes.func.isRequired,
    advancedMode: PropTypes.bool,
    defaultScales: PropTypes.array.isRequired
};

export default ScalesEditor;
