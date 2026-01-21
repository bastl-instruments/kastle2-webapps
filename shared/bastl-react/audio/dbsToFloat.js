// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)


/**
 * Converts decibels to a float value.
 * @param {number} dbs - -Infinity to 0.
 * @returns {number} - A float value between 0 and 1.
 */
function dbsToFloat(dbs) {
    if (dbs >= 0) {
        return 1;
    }
    return Math.pow(10, dbs / 20);
}

export default dbsToFloat;