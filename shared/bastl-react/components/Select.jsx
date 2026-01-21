// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import style from './Select.module.scss';

function Select({ options, value, onChange, id }) {
    return (
        <select
            value={value}
            className={style.select}
            onChange={(e) => onChange(e.target.value)}
            id={id}
        >
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}

const ValuePropType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
Select.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: ValuePropType.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: ValuePropType.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string,
};

export default Select;