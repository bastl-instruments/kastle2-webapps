// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import styleModule from './Input.module.scss';
import classNames from 'classnames';
import React from 'react';

const Input = React.forwardRef(function Input({ value, title, style, type = 'text', onChange, className, disabled }, ref) {
    return (
        <input
            ref={ref}
            type={type}
            style={style}
            className={classNames(styleModule.input,
                disabled ? styleModule.disabled : '',
                className)}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            title={title}
            value={value}
        />
    );
});

Input.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    type: PropTypes.string,
};

export default Input;