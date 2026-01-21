// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import styles from './CheckBox.module.scss';
import classNames from 'classnames';

function CheckBox({ style, wrapperType = 'label', onChange, value, id, name, type = 'checkbox' }) {

    const El = wrapperType;

    return (
        <El
            style={style}
            className={classNames(styles.checkbox, { [styles.checked]: value })}
        >
            <input
                type={type}
                name={name}
                onChange={(ev) => onChange(ev.target.checked)}
                checked={value}
                id={id}
            />
        </El>
    );
}

CheckBox.propTypes = {
    style: PropTypes.object,
    type: PropTypes.oneOf(['checkbox', 'radio']),
    wrapperType: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.bool.isRequired,
    id: PropTypes.string,
};

export default CheckBox;