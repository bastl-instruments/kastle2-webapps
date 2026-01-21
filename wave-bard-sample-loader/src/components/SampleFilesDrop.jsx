// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useCallback } from 'react';
import loadAudioFile from '@bastl-react/audio/loadAudioFile';
import config from '../config';
import cleanName from '@bastl-react/utils/cleanName';
import generateId from '@bastl-react/utils/generateId';
import FilesDrop from './FilesDrop';
import PropTypes from 'prop-types';

function SampleFilesDrop({ onSamplesDrop, onDragChange, onLoadingChange, children }) {

    const loadFiles = useCallback(async (files) => {
        onLoadingChange(true);
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
        onSamplesDrop(newsamples);
        onLoadingChange(false);
    }, [onSamplesDrop, onLoadingChange]);

    const handleFilesDrop = (files) => {
        const droppedFiles = Array.from(files).filter((file) =>
            new RegExp(`\\.(${config.allowedFormats.map((format) => format.value).join('|')})$`, 'i').test(file.name)
        );
        if (droppedFiles.length > 0) {
            loadFiles(droppedFiles);
        }
    };


    return (
        <FilesDrop
            onFilesDrop={handleFilesDrop}
            onDragChange={onDragChange}
        >
            {children}
        </FilesDrop>
    );
}

SampleFilesDrop.propTypes = {
    onSamplesDrop: PropTypes.func.isRequired,
    onDragChange: PropTypes.func.isRequired,
    onLoadingChange: PropTypes.func.isRequired,
    children: PropTypes.any
};


export default SampleFilesDrop;