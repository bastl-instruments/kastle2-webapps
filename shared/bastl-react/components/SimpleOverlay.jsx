// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import style from './SimpleOverlay.module.scss';
import Button from './Button';

function SimpleOverlay({ active, message, animated, error, onCloseClick }) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (active && animated) {
            const interval = setInterval(() => {
                setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
            }, 500);
            return () => clearInterval(interval);
        }
        setDots('');
    }, [active, animated]);

    useEffect(() => {
        document.body.classList.toggle('overlay-active', active);
    }, [active]);

    return (
        <div
            className={classNames(style.overlay, {
                [style.active]: active,
                [style.error]: error,
                [style.animated]: animated
            })}
        >
            <div className={style.inner}>
                {message}{dots}
                {onCloseClick && (
                    <div className={style.buttons}>
                        <Button
                            onClick={onCloseClick}
                            label="Close"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

SimpleOverlay.propTypes = {
    active: PropTypes.bool,
    message: PropTypes.any,
    animated: PropTypes.bool,
    error: PropTypes.bool,
    onCloseClick: PropTypes.func,
};

export default SimpleOverlay;