// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import style from './InputRow.module.scss';

function InputRow({ children, className }) {
    return (
        <div className={style.inputRow + ' ' + className}>
            {children}
        </div>
    );
};

InputRow.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default InputRow;