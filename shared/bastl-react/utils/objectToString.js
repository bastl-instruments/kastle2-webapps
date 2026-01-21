// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

export default function objectToString(obj, bitpadding = 16, bitfields = ['steps', 'semitones']) {
    return `[\n${obj.map((item) => {
        const entries = Object.entries(item).map(([key, value]) => {
            if (bitfields.includes(key) && typeof value === 'number') {
                return `${key}: 0b${value.toString(2).padStart(bitpadding, '0')}`; // Ensure 12 bits with leading zeros
            }
            if (key === 'id') {
                return `${key}: generateId()`;
            }
            return `${key}: '${value}'`;
        }).join(', ');
        return `    { ${entries} }`;
    }).join(',\n')}\n]`;
};