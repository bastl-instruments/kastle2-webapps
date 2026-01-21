// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

/**
 * Calculates the width of the browser's scrollbar
 * Works across different browsers and operating systems
 * @returns {number} The width of the scrollbar in pixels
 */
export function calculateScrollbarWidth() {
    // Create a temporary div with a scrollbar
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for Edge
    document.body.appendChild(outer);

    // Create inner div
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculate the scrollbar width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Remove the divs
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

/**
 * Sets the scrollbar width as a CSS variable on the root element
 */
export function setScrollbarWidthProperty() {
    const width = calculateScrollbarWidth();
    document.documentElement.style.setProperty('--scrollbar-width', `${width}px`);
    return width;
}

export default calculateScrollbarWidth;
