// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import CheckBox from './CheckBox';
import styles from './Selector.module.scss';
import ArrowDown from '@bastl-react/icons/ArrowDown';
import generateId from '@bastl-react/utils/generateId';

function Selector({ label, className, options, multiple, value, onChange, id }) {

    const htmlType = !multiple ? 'radio' : 'checkbox';
    const htmlName = useMemo(() => id ? `${id}-selector` : generateId(), [id]);
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => { setIsOpen((prev) => !prev); };
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    return (
        <div
            className={classNames(styles.selector, className, {
                [styles.open]: isOpen,
                [styles.multiple]: multiple
            })}
            id={id}
            ref={ref}
        >
            <button
                className={styles.opener}
                onClick={toggle}
            >
                <span className={styles.label}>
                    {label}
                </span>
                <span className={styles.value}>
                    {!multiple && (options.find((option) => option.value === value)?.label ?? '')}
                    {multiple && value.length === 0 && 'None'}
                    {multiple && value.length > 0 && `${value.length} selected`}
                </span>
                <span className={styles.arrow}>
                    <ArrowDown />
                </span>
            </button>
            <div className={styles.options}>
                <ul>
                    {options.map((option) => {

                        if (option.separator) {
                            return (
                                <li key={option.label} className={styles.separator}>
                                    {option.label}
                                </li>
                            );
                        }

                        const checked = multiple ? value.includes(option.value) : value === option.value;
                        const handleChange = () => {
                            if (multiple) {
                                onChange(value.includes(option.value)
                                    ? value.filter((v) => v !== option.value)
                                    : [...value, option.value]);
                            } else {
                                onChange(option.value);
                                setIsOpen(false);
                            }
                        };
                        return (
                            <li key={option.value}>
                                <label className={classNames(styles.option, { [styles.checked]: checked })}>
                                    {option.label}
                                    <CheckBox
                                        type={htmlType}
                                        name={htmlName}
                                        value={checked}
                                        onChange={handleChange}
                                    />
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

const ValuePropType = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))]);
Selector.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: ValuePropType.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    multiple: PropTypes.bool,
    value: ValuePropType,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string,
};

export default Selector;