// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)


import PropTypes from 'prop-types';
import styles from './ButtonRow.module.scss';
import classNames from 'classnames';

function ButtonRow({ children, shadow, className }) {
    return (
        <div className={classNames(styles.buttonRow, { [styles.shadow]: shadow }, className)}>
            {children}
        </div>
    );
}

ButtonRow.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    shadow: PropTypes.bool,
};

export default ButtonRow;