// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

/**
 * Performs a fetch request with aggressive cache-busting techniques
 * to ensure fresh data is always retrieved when online.
 * 
 * @param {string} url - The URL to fetch from
 * @param {RequestInit} options - Additional fetch options (optional)
 * @returns {Promise<Response>} The fetch response
 */
export default function noCacheFetch(url, options = {}) {
    // Add timestamp to force fresh reload and bypass all caching layers
    const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
    
    // Merge with existing headers if any
    const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...options.headers
    };
    
    // Merge with existing options
    const fetchOptions = {
        cache: 'no-store',
        ...options,
        headers
    };
    
    return fetch(cacheBustUrl, fetchOptions);
}