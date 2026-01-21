// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import classNames from 'classnames';
import PropTypes from 'prop-types';
import style from './Knob.module.scss';

const KNOB_RANGE = [-135, 135]; // Degrees

function Knob({ rotation, index, total, className, onClick }) {
    const ElementType = onClick ? 'button' : 'div';
    let rot = rotation;
    if (total > 0) {
        const knobStep = (KNOB_RANGE[1] - KNOB_RANGE[0]) / (total - 1);
        rot = index * knobStep + KNOB_RANGE[0];
    }

    return (
        <ElementType
            className={classNames(style.knob, className)}
            onClick={onClick}
        >
            <div
                className={style.line}
                style={rot ? { transform: `rotate(${rot}deg)` } : null}
            />
        </ElementType>
    );
}

Knob.propTypes = {
    rotation: PropTypes.number,
    className: PropTypes.string,
    index: PropTypes.number,
    total: PropTypes.number,
    onClick: PropTypes.func
};

export default Knob;