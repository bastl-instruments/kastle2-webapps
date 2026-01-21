// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import styles from './IconButton.module.scss';
import classNames from 'classnames';

function IconButton({ icon, onClick, title, className, style, id, disabled, inactive, iconProps }) {
    const IconType = icon;
    return (
        <button
            className={classNames(styles.iconButton, className, {
                [styles.disabled]: !onClick || disabled,
                [styles.inactive]: inactive,
            })}
            onClick={onClick}
            style={style}
            title={title}
            id={id}
        >
            <IconType
                {...iconProps}
            />
        </button>
    );
}

IconButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    iconProps: PropTypes.object,
    onClick: PropTypes.func,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    inactive: PropTypes.bool,
};

export default IconButton;