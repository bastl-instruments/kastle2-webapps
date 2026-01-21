// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import iconButtonStyles from './IconButton.module.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Folder from '@bastl-react/icons/Folder';


function FilePickerIconButton({ children, onChange, accept, multiple, className, label, icon = Folder }) {
    const IconEl = icon;
    return (
        <label
            className={classNames(className, iconButtonStyles.iconButton)}
            style={{ overflow: 'hidden', position: 'relative' }}
        >
            <IconEl />
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
            {label &&
                <span className={iconButtonStyles.label}>
                    {label}
                </span>
            }
            {children}
        </label>
    );
}

FilePickerIconButton.propTypes = {
    onChange: PropTypes.func.isRequired,
    children: PropTypes.any,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.elementType
};

export default FilePickerIconButton;