// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import { v4 as uuidv4 } from 'uuid';

export default function generateId() {
    return uuidv4();
}