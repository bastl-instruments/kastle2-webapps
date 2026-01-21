// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import { useEffect, useRef, useCallback } from 'react';
import log from 'loglevel';

function SoundButton({ shouldBeStopped, soundData, label, className, onClick }) {
    const audioRef = useRef(null);

    useEffect(() => {
        if (shouldBeStopped && audioRef.current) {
            audioRef.current.pause();
        }
    }, [shouldBeStopped]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [soundData]);

    const play = useCallback(() => {
        if (onClick) {
            onClick();
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        const audio = new Audio();
        audio.setAttribute('playsinline', ''); // enables inline playback on iOS
        audio.preload = 'auto';
        const blob = new Blob([soundData], { type: 'audio/wav' });
        audio.src = URL.createObjectURL(blob);
        audioRef.current = audio;
        audio.load();
        audio.play().catch((err) => {
            // Optional: handle playback errors here
            log.error('Audio play failed:', err);
        });
    }, [onClick, soundData]);

    return (
        <button
            className={className}
            disabled={!soundData}
            onClick={play}
        >
            <span>
                {label}
            </span>
        </button>
    );
}

SoundButton.propTypes = {
    soundData: PropTypes.oneOfType([PropTypes.instanceOf(ArrayBuffer), PropTypes.instanceOf(Uint8Array)]),
    label: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    shouldBeStopped: PropTypes.bool
};

export default SoundButton;