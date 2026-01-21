// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import loadAudioFile from '@bastl-react/audio/loadAudioFile';
import BankDecoration from '@bastl-react/components/BankDecoration';
import Button from '@bastl-react/components/Button';
import FilePickerIconButton from '@bastl-react/components/FilePickerIconButton';
import FilesDragOverlay from '@bastl-react/components/FilesDragOverlay';
import FilesDrop from '@bastl-react/components/FilesDrop';
import IconButton from '@bastl-react/components/IconButton';
import iconButtonStyles from '@bastl-react/components/IconButton.module.scss';
import Color from '@bastl-react/icons/Color';
import Cross from '@bastl-react/icons/Cross';
import Move from '@bastl-react/icons/Move';
import Plus from '@bastl-react/icons/Plus';
import cleanName from '@bastl-react/utils/cleanName';
import generateId from '@bastl-react/utils/generateId';
import classNames from 'classnames';
import { log } from 'loglevel';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState, useContext } from 'react';
import { Tooltip } from 'react-tooltip';
import config from '../config';
import styles from './Bank.module.scss';
import ColorPicker from '@bastl-react/components/ColorPicker';
import Sample from './Sample';
import bankColors from '../data/bankColors';
import { UiContext } from '@bastl-react/UiContext';

function SortableSample({ samplesCount, index, id, sample, updateSample, deleteSample, loadFile }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    return (
        <Sample
            {...sample}
            index={index}
            samplesCount={samplesCount}
            sortableParams={{
                ref: setNodeRef,
                style: {
                    transform: CSS.Transform.toString(transform),
                    transition,
                }
            }}
            handleParams={{
                ...attributes,
                ...listeners
            }}
            className={classNames(styles.sample)}
            isDragging={isDragging}
            updateSample={updateSample}
            deleteSample={deleteSample}
            loadFile={loadFile}
        />
    );
}

SortableSample.propTypes = {
    samplesCount: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    sample: PropTypes.object.isRequired,
    updateSample: PropTypes.func,
    deleteSample: PropTypes.func,
    loadFile: PropTypes.func,
};


function Bank({ setInteracting, id, isDragging, isPlaceholder, label, color, samples, handleParams, updateBank, removeBank }) {

    const colorElementId = `bank-color-${id}`;
    const deleteElementId = `bank-delete-${id}`;

    const [colorTooltipActive, setColorTooltipActive] = useState(false);
    const [deleteTooltipActive, setDeleteTooltipActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const uiContext = useContext(UiContext);

    useEffect(() => {
        if (setInteracting) {
            setInteracting(colorTooltipActive || deleteTooltipActive);
        }
    }, [colorTooltipActive, deleteTooltipActive, setInteracting]);

    const isEmpty = !samples || samples.length === 0 || samples.every((sample) => !sample.original);

    const updateSample = useCallback((sample_id, update) => {
        const newSamples = [...samples];
        const index = newSamples.findIndex((sample) => sample.id === sample_id);
        if (index === -1) {
            log.error('Sample not found');
            return;
        }
        newSamples[index] = { ...newSamples[index], ...update };
        updateBank(id, { samples: newSamples });
    }, [samples, updateBank, id]);

    const deleteSample = useCallback((sample_id) => {
        const newSamples = samples.filter((sample) => sample.id !== sample_id);
        updateBank(id, { samples: newSamples });
    }, [samples, updateBank, id]);

    const loadFile = useCallback((sample_id, file) => {
        loadAudioFile(file).then((original) => {
            updateSample(sample_id, {
                original,
                stereo: original?.info?.channels !== 1 || false,
                label: cleanName(file.name),
                needsProcessing: true
            });
        }).catch(() => {
            alert('Unsupported file format.');
        });
    }, [updateSample]);

    const loadFiles = useCallback(async (files) => {
        setIsLoading(true);
        const newsamples = [];
        for (const file of files) {
            try {
                const original = await loadAudioFile(file);
                newsamples.push({
                    id: generateId(),
                    original,
                    stereo: original?.info?.channels !== 1 || false,
                    label: cleanName(file.name),
                    needsProcessing: true
                });
            } catch {
                alert('Unsupported file format.');
            }
        }
        updateBank(id, { samples: [...samples, ...newsamples] });
        setIsLoading(false);
    }, [samples, updateBank, id]);

    const accept = config.allowedFormats.map((format) => `.${format.value}`).join(',');

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active?.id !== over?.id) {
            const oldIndex = samples.findIndex((x) => x.id === active.id);
            const newIndex = samples.findIndex((x) => x.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                const newSamples = arrayMove(samples, oldIndex, newIndex);
                updateBank(id, { samples: newSamples });
            }
        }
    }

    const handleFilesDrop = (files) => {
        const droppedFiles = Array.from(files).filter((file) =>
            new RegExp(`\\.(${config.allowedFormats.map((format) => format.value).join('|')})$`, 'i').test(file.name)
        );
        if (droppedFiles.length > 0) {
            loadFiles(droppedFiles);
        }
    };

    const [isDrag, setDrag] = useState(false);

    return (
        <FilesDrop
            onFilesDrop={handleFilesDrop}
            onDragChange={setDrag}
        >
            <div
                className={classNames(styles.bank, {
                    [styles.bankDragging]: isDragging,
                    [styles.bankPlaceholder]: isPlaceholder
                })}
            >
                {isLoading && <FilesDragOverlay label="Loading..." />}
                {isDrag && !isLoading && <FilesDragOverlay />}
                <BankDecoration
                    className={styles.decorationTop}
                    color={color?.display}

                />
                <BankDecoration
                    className={styles.decorationBottom}
                    color={color?.display}

                />
                <Tooltip
                    anchorSelect={`#${deleteElementId}`}
                    isOpen={deleteTooltipActive}
                    setIsOpen={setDeleteTooltipActive}
                    openOnClick
                    className={styles.tooltip}
                    place="bottom-center"
                >
                    <form
                        method="post"
                        onSubmit={(e) => { e.preventDefault(); setDeleteTooltipActive(false); removeBank(id); }}
                    >
                        <Button
                            label="Yes, delete"
                            style={{ marginRight: '4px' }}
                        />
                        <Button
                            label="Cancel"
                            onClick={(e) => { e.preventDefault(); setDeleteTooltipActive(false); return false; }}
                        />
                    </form>
                </Tooltip>
                <Tooltip
                    anchorSelect={`#${colorElementId}`}
                    isOpen={colorTooltipActive}
                    setIsOpen={setColorTooltipActive}
                    openOnClick
                    className={styles.tooltip}
                    place="bottom-center"
                >
                    <ColorPicker
                        color={color}
                        colors={bankColors}
                        advancedMode={uiContext.advancedMode}
                        onChange={(newColor) => {
                            updateBank(id, { color: newColor });
                        }}
                    />
                </Tooltip>
                <div className={styles.header}>
                    <div
                        className={classNames(iconButtonStyles.iconButton, styles.move, styles.headerIcon, styles.yellowHover)}
                        {...handleParams}
                    >
                        <Move />
                    </div>
                    <div className={styles.label}>
                        <input
                            type="text"
                            value={label}
                            className={styles.labelInput}
                            onChange={(e) => updateBank(id, { label: e.target.value })}
                        />
                    </div>
                    <IconButton
                        title="Change color"
                        icon={Color}
                        className={classNames(styles.headerIcon, styles.yellowHover)}
                        iconProps={{ fill: color?.display }}
                        id={colorElementId}
                        onClick={() => setColorTooltipActive(true)}
                    />
                    <IconButton
                        title="Delete bank"
                        icon={Cross}
                        className={classNames(styles.headerIcon, styles.yellowHover)}
                        id={deleteElementId}
                        onClick={() => isEmpty ? removeBank(id) : setDeleteTooltipActive(true)}
                    />
                </div>
                <div className={styles.samples}>
                    <DndContext
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={samples}
                            strategy={verticalListSortingStrategy}
                        >
                            {samples?.map((sample, index) => (
                                <SortableSample
                                    index={index}
                                    samplesCount={samples.length}
                                    key={sample.id}
                                    id={sample.id}
                                    sample={sample}
                                    updateSample={updateSample}
                                    deleteSample={deleteSample}
                                    loadFile={loadFile}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                    <div
                        className={styles.addSamples}
                    >
                        <FilePickerIconButton
                            accept={accept}
                            onChange={loadFiles}
                            label="Add samples"
                            icon={Plus}
                            // className={styles.yellowHover}
                            multiple
                        />
                        <span className={styles.count}>
                            {samples?.length} {samples?.length === 1 ? 'sample' : 'samples'}
                        </span>
                    </div>
                </div>
            </div>
        </FilesDrop>
    );
}

Bank.propTypes = {
    isPlaceholder: PropTypes.bool,
    isDragging: PropTypes.bool,
    label: PropTypes.string,
    color: PropTypes.shape({
        display: PropTypes.string,
        real: PropTypes.string,
        name: PropTypes.string,
    }),
    setInteracting: PropTypes.func,
    samples: PropTypes.array,
    handleParams: PropTypes.object,
    id: PropTypes.any,
    updateBank: PropTypes.func.isRequired,
    removeBank: PropTypes.func.isRequired,
};


export default Bank;