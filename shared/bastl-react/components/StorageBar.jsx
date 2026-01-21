// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import style from './StorageBar.module.scss';

function StorageBar({ used, total, label }) {
    const width = ((used / total) * 100).toFixed(2) + '%';
    return (
        <div className={style.bar}>
            <div
                className={style.progress}
                style={{ transform: 'scaleX(' + width + ')' }}
            />
            <div className={style.overlay}>
                <div className={style.label}>
                    {label}
                </div>
                <div className={style.value}>
                    {width}
                </div>
            </div>
        </div>
    );
}

StorageBar.propTypes = {
    used: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    label: PropTypes.node,
};

export default StorageBar;