// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import styles from './Button.module.scss';
import classNames from 'classnames';


function Button({
    active,
    style,
    id,
    elementType,
    title,
    label,
    onClick,
    icon,
    className,
    inactive,
    disabled,
    error,
    plain,
    children,
    full,
    inverse,
}) {

    const Icon = icon;
    const Tag = elementType || 'button';

    return (
        <Tag
            className={classNames(styles.button,
                active ? styles.active : '',
                icon ? styles.hasIcon : '',
                label ? styles.hasLabel : '',
                inactive ? styles.inactive : '',
                disabled ? styles.disabled : '',
                error ? styles.error : '',
                plain ? styles.plain : '',
                full ? styles.full : '',
                inverse ? styles.inverse : '',
                className)}
            onClick={onClick}
            disabled={disabled}
            title={title}
            id={id}
            style={style}
        >
            {icon && <span className={styles.icon}><Icon /></span>}
            {label && <span className={styles.label}>{label}</span>}
            {children}
        </Tag>
    );
}

Button.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    label: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    icon: PropTypes.elementType,
    active: PropTypes.bool,
    inactive: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    plain: PropTypes.bool,
    full: PropTypes.bool,
    inverse: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.any,
    elementType: PropTypes.elementType
};

export default Button;