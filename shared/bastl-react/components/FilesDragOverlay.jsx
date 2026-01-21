// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import styles from './FilesDragOverlay.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function FilesDragOverlay({ label, dark }) {
    const l = label || 'Drop files here';
    return (
        <div className={classNames(styles.filesDragOverlay, { [styles.dark]: dark })}>
            <div className={styles.filesDragOverlayLabel}>
                {l}
            </div>
        </div>
    );
}

FilesDragOverlay.propTypes = {
    label: PropTypes.string,
    dark: PropTypes.bool,
};

export default FilesDragOverlay;