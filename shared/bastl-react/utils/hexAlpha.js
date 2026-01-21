// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

function hexAlpha(hex, alpha) {
    // Remove the hash if present
    hex = hex.replace(/^#/, '');

    // Ensure the hex is valid (3 or 6 characters)
    if (hex.length === 3) {
        hex = hex.split('').map((char) => char + char).join('');
    }
    if (hex.length !== 6) {
        throw new Error('Invalid hex color format');
    }

    // Convert alpha (0-1) to a 2-digit hex value
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');

    // Return the hex color with the alpha appended
    return `#${hex}${alphaHex}`;
};

export default hexAlpha;
