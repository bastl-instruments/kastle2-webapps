// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * We are listening for keydown events. But only for xeat purposes! We don't track the keys pressed.
 */
function Xeats({ xeats }) {
    const keysPressed = useRef('');
    useEffect(() => {
        const handleKeyDown = (event) => {
            keysPressed.current += event.key.toLowerCase(); // Convert to lowercase
            for (const code in xeats) {
                if (keysPressed.current.endsWith(code.toLowerCase())) {
                    xeats[code]();
                    keysPressed.current = ''; // Reset the sequence
                    return;
                }
            }
            if (keysPressed.current.length > Math.max(...Object.keys(xeats).map((code) => code.length))) {
                keysPressed.current = keysPressed.current.slice(-Math.max(...Object.keys(xeats).map((code) => code.length)));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [xeats]);

    // This component doesn't render anything
    return null;
}

Xeats.propTypes = {
    xeats: PropTypes.object.isRequired
};

export default Xeats;