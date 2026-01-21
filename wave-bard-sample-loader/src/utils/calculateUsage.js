// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

function calculateMemoryUsage(banks, scales, rhythms) {
    let used = 0;
    used += 20; // main header
    used += scales.length * 4; // scales
    used += rhythms.length * 4; // scales
    banks.forEach((bank) => {
        used += 12; // bank header
        bank.samples.forEach((sample) => {
            used += 16; // sample header
            used += sample.processed?.soundData?.length || 0;
            used -= 44; // - wave header
        });
    });
    used += 4; // end marker
    if (used < 0) {
        used = 0;
    }
    return used;
}

export { calculateMemoryUsage };
export default calculateMemoryUsage;