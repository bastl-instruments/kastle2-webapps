// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

export default function decodeXeat(txt) {
    return txt?.split('*').join('');
}