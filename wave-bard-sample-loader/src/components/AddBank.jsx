// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import loadAudioFile from '@bastl-react/audio/loadAudioFile';
import BankDecoration from '@bastl-react/components/BankDecoration';
import FilesDragOverlay from '@bastl-react/components/FilesDragOverlay';
import FilesDrop from '@bastl-react/components/FilesDrop';
import Plus from '@bastl-react/icons/Plus';
import cleanName from '@bastl-react/utils/cleanName';
import generateId from '@bastl-react/utils/generateId';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import config from '../config';
import styles from './AddBank.module.scss';

function AddBank({ onClick, onSamplesDrop }) {

    const [drag, setDrag] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadFiles = useCallback(async (files) => {
        const newsamples = [];
        setLoading(true);
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
        setLoading(false);
    }, [onSamplesDrop]);

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
            onDragChange={setDrag}
        >
            <button
                className={styles.addBank}
                onClick={!loading && !drag ? onClick : null}
            >
                <BankDecoration
                    color="#3b3c3b"
                    className={styles.bankDecorationTop}
                />
                <BankDecoration
                    color="#3b3c3b"
                    className={styles.bankDecorationBottom}
                />
                {!drag && !loading &&
                    <>
                        <span className={styles.icon} >
                            <Plus />
                        </span>
                        Add Bank
                    </>
                }
                {drag && !loading &&
                    <FilesDragOverlay dark />
                }
                {loading &&
                    <FilesDragOverlay
                        label="Loading..."
                        dark
                    />
                }
            </button>
        </FilesDrop>
    );
};

AddBank.propTypes = {
    onClick: PropTypes.func,
    onSamplesDrop: PropTypes.func
};

export default AddBank;