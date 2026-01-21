// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import styles from './Bubble.module.scss';
import PropTypes from 'prop-types';

function Bubble({ children, className, onClick, position }) {
    return (
        <div
            className={`${styles.bubble} ${styles[position]} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
        >
            {children}
        </div>
    );
}
Bubble.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
};

export default Bubble;