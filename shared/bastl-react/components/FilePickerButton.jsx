// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import Button from './Button';
import style from './FilePickerButton.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function FilePickerButton({ children, onChange, accept, multiple, buttonProps }) {
    return (
        <Button
            elementType="label"
            {...buttonProps}
            className={classNames(buttonProps.className, style.filePickerButton)}
        >
            <input
                type="file"
                style={{ position: 'absolute', right: '100%', bottom: '100%' }}
                accept={accept}
                multiple={multiple}
                onClick={(e) => {
                    e.target.value = null;
                }}
                onChange={(e) => {
                    if (e?.target?.files) {
                        onChange(Array.from(e.target.files));
                        return;
                    }
                    e.target.value = null;
                }}
            />
            {children}
        </Button>
    );
}

FilePickerButton.propTypes = {
    onChange: PropTypes.func.isRequired,
    children: PropTypes.any,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    buttonProps: PropTypes.object
};

export default FilePickerButton;