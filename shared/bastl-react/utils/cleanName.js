// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

export default function cleanName(input) {
    return input.replace(/\.[^/.]+$/, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').substring(0, 32);
}