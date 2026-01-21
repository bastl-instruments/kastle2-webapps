// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

function FilesDrop({ children, onFilesDrop, onDragChange }) {
    const [dragCounter, setDragCounter] = useState(0);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => prev + 1);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => {
            const newcount = prev - 1;
            if (newcount < 0) {
                return 0;
            }
            return newcount;
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(0);
        onFilesDrop(e?.dataTransfer?.files || []);
    };

    const isDrag = dragCounter > 0;
    useEffect(() => {
        if (onDragChange) {
            onDragChange(isDrag);
        }
    }, [isDrag, onDragChange]);

    const child = React.Children.only(children);

    return React.cloneElement(child, {
        onDragOver: handleDragOver,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop
    });
}

FilesDrop.propTypes = {
    children: PropTypes.element.isRequired,
    onFilesDrop: PropTypes.func.isRequired,
    onDragChange: PropTypes.func.isRequired,
};

export default FilesDrop;