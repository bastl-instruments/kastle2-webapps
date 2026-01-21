// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import log from 'loglevel';

// Kastle 2 / RP2040 specific constants
export const UF2_FAMILY_ID = 0xE48BFF56;
export const USER_DATA_BEGIN = 0x10080000;
export const PROGRAM_MAX_SIZE = 0x00080000;

// General UF2 constants
export const UF2_MAGIC_START0 = 0x0A324655;
export const UF2_MAGIC_START1 = 0x9E5D5157;
export const UF2_MAGIC_END = 0x0AB16F30;
export const BLOCK_SIZE = 512;
export const PAYLOAD_SIZE = 256;

/**
 * Reads a UF2 firmware file and returns the firmware data.
 * @param {Uint8Array} uf2Array - The UF2 file to read.
 * @returns {Uint8Array} The firmware data.
 */
export async function readUf2(uf2Array) {
    if (uf2Array.length % BLOCK_SIZE !== 0) {
        log.error('UF2 file size is not an exact multiple of the block size.');
        return null;
    }
    const blockCount = Math.floor(uf2Array.length / BLOCK_SIZE);
    const blocks = [];
    let minAddress = Infinity;
    let maxAddress = 0;

    // Process each block in the UF2 file
    for (let i = 0; i < blockCount; i++) {
        const offset = i * BLOCK_SIZE;
        const block = uf2Array.slice(offset, offset + BLOCK_SIZE);
        const view = new DataView(block.buffer);

        // Validate magic numbers
        if (
            view.getUint32(0, true) !== UF2_MAGIC_START0 ||
            view.getUint32(4, true) !== UF2_MAGIC_START1 ||
            view.getUint32(BLOCK_SIZE - 4, true) !== UF2_MAGIC_END
        ) {
            log.error(`Invalid UF2 block detected at index ${i}`);
            return null;
        }

        // Validate the UF2 family ID
        const blockFamilyId = view.getUint32(28, true);
        if (blockFamilyId !== UF2_FAMILY_ID) {
            log.error(`UF2 block at index ${i} has mismatching family ID. Expected ${UF2_FAMILY_ID}, got ${blockFamilyId}`);
            return null;
        }

        // Retrieve block address
        const address = view.getUint32(12, true);
        minAddress = Math.min(minAddress, address);
        maxAddress = Math.max(maxAddress, address + PAYLOAD_SIZE);

        // Extract payload
        const payload = block.slice(32, 32 + PAYLOAD_SIZE);
        blocks.push({ address, payload });
    }

    if (blocks.length === 0) {
        log.error('No valid UF2 blocks found.');
        return new Uint8Array(0);
    }

    // Allocate buffer for firmware image (preserving gaps if any)
    const binarySize = maxAddress - minAddress;
    const binary = new Uint8Array(binarySize);
    binary.fill(0);

    // Copy each block's payload into the firmware image at the proper offset
    for (const { address, payload } of blocks) {
        const destOffset = address - minAddress;
        binary.set(payload, destOffset);
    }

    log.debug(`UF2 file read successfully. Binary size: ${binarySize} bytes.`);
    return binary;
}


/**
 * Generates a UF2 firmware file as a Blob.
 * @param {number} uf2FamilyID - The UF2 family ID.
 * @param {number} startAddress - The start address for the firmware.
 * @param {Uint8Array} data - The firmware data.
 * @returns {Blob} A Blob containing the UF2 file.
 */
export function generateUf2(uf2FamilyID, startAddress, data) {
    const totalBlocks = Math.ceil(data.length / PAYLOAD_SIZE);
    const uf2Array = new Uint8Array(totalBlocks * BLOCK_SIZE);
    log.info(`Generating UF2 file with ${totalBlocks} blocks`);

    for (let blockNum = 0; blockNum < totalBlocks; blockNum++) {
        const offset = blockNum * BLOCK_SIZE;
        const fileOffset = blockNum * PAYLOAD_SIZE;

        // Create a block with the required UF2 header
        const block = new Uint8Array(BLOCK_SIZE);
        const dataView = new DataView(block.buffer);

        dataView.setUint32(0x00, UF2_MAGIC_START0, true);
        dataView.setUint32(0x04, UF2_MAGIC_START1, true);
        dataView.setUint32(0x08, 0x00002000, true); // Flags
        dataView.setUint32(0x0C, startAddress + fileOffset, true);
        dataView.setUint32(0x10, PAYLOAD_SIZE, true);
        dataView.setUint32(0x14, blockNum, true);
        dataView.setUint32(0x18, totalBlocks, true); // Total blocks
        dataView.setUint32(0x1C, uf2FamilyID, true);

        // Copy data into the payload section (offset 32)
        const chunk = data.slice(fileOffset, fileOffset + PAYLOAD_SIZE);
        block.set(chunk, 32);

        // **Pad the last block with 0x00 if necessary**
        if (chunk.length < PAYLOAD_SIZE) {
            block.fill(0x00, 32 + chunk.length, 32 + PAYLOAD_SIZE);
        }

        // End magic number
        dataView.setUint32(BLOCK_SIZE - 4, UF2_MAGIC_END, true);

        // Copy block to final UF2 array
        uf2Array.set(block, offset);
    }
    log.info('UF2 file generation completed successfully');
    return new Blob([uf2Array], { type: 'application/octet-stream' });
}

export async function mergeUf2(uf2Blobs, fillGaps = false) {
    const allBlocks = [];
    let minAddress = Infinity;
    let maxAddress = 0;
    let familyId = null;

    log.info(`Merging ${uf2Blobs.length} UF2 files`);

    // First pass: collect all blocks and find address range
    for (let blobIndex = 0; blobIndex < uf2Blobs.length; blobIndex++) {
        const blob = uf2Blobs[blobIndex];
        const buffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const blockCount = uint8Array.length / BLOCK_SIZE;

        log.info(`Processing UF2 file ${blobIndex + 1}/${uf2Blobs.length} (${blockCount} blocks)`);

        for (let i = 0; i < uint8Array.length; i += BLOCK_SIZE) {
            const block = uint8Array.slice(i, i + BLOCK_SIZE);
            const view = new DataView(block.buffer);

            // Validate block structure
            if (
                view.getUint32(0, true) !== UF2_MAGIC_START0 ||
                view.getUint32(4, true) !== UF2_MAGIC_START1 ||
                view.getUint32(BLOCK_SIZE - 4, true) !== UF2_MAGIC_END
            ) {
                log.error(`Invalid UF2 block detected in file ${blobIndex + 1}, block ${i / BLOCK_SIZE}`);
                continue;
            }

            // Store family ID
            familyId = view.getUint32(28, true);

            const address = view.getUint32(12, true);
            minAddress = Math.min(minAddress, address);
            maxAddress = Math.max(maxAddress, address + PAYLOAD_SIZE);

            // Store block with its address for sorting
            allBlocks.push({ address, block });
        }
    }

    // Sort blocks by address
    allBlocks.sort((a, b) => a.address - b.address);

    // Create final block array with gap filling
    const finalBlocks = [];
    let currentAddress = minAddress;

    if (fillGaps) {
        for (let i = 0; i < allBlocks.length; i++) {
            const { address, block } = allBlocks[i];

            // Fill gap if needed
            while (currentAddress < address) {
                const emptyBlock = new Uint8Array(BLOCK_SIZE);
                const emptyView = new DataView(emptyBlock.buffer);

                // Set up empty block header
                emptyView.setUint32(0, UF2_MAGIC_START0, true);
                emptyView.setUint32(4, UF2_MAGIC_START1, true);
                emptyView.setUint32(8, 0x00002000, true);
                emptyView.setUint32(12, currentAddress, true);
                emptyView.setUint32(16, PAYLOAD_SIZE, true);
                emptyView.setUint32(28, familyId, true); // Use same family ID
                emptyView.setUint32(BLOCK_SIZE - 4, UF2_MAGIC_END, true);

                finalBlocks.push(emptyBlock);
                currentAddress += PAYLOAD_SIZE;
            }

            finalBlocks.push(block);
            currentAddress = address + PAYLOAD_SIZE;
        }
    } else {
        finalBlocks.push(...allBlocks.map((item) => item.block));
    }

    // Recalculate block numbers and total block count
    const totalBlocks = finalBlocks.length;
    log.info(`Recalculating block numbers for ${totalBlocks} total blocks`);

    for (let newBlockNo = 0; newBlockNo < totalBlocks; newBlockNo++) {
        const block = finalBlocks[newBlockNo];
        const view = new DataView(block.buffer);
        view.setUint32(20, newBlockNo, true); // Update block number
        view.setUint32(24, totalBlocks, true); // Update total block count
    }

    log.info('UF2 file merge completed successfully');
    return new Blob(finalBlocks, { type: 'application/octet-stream' });
}


/**
 * Validates a UF2 file by checking:
 * - Proper UF2 magic numbers
 * - Consistent total block count
 * - Correct sequential block numbers
 * @param {Blob} uf2Blob - The UF2 file to validate.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the UF2 file is valid, otherwise `false`.
 */
export async function validateUf2(uf2Blob) {
    const buffer = await uf2Blob.arrayBuffer();
    const dataView = new DataView(buffer);
    const blockCount = buffer.byteLength / BLOCK_SIZE;

    let expectedTotalBlocks = null;

    log.info(`Validating UF2 file: ${blockCount} blocks detected`);

    for (let i = 0; i < blockCount; i++) {
        const offset = i * BLOCK_SIZE;

        // Check magic numbers
        if (
            dataView.getUint32(offset, true) !== UF2_MAGIC_START0 ||
            dataView.getUint32(offset + 4, true) !== UF2_MAGIC_START1 ||
            dataView.getUint32(offset + BLOCK_SIZE - 4, true) !== UF2_MAGIC_END
        ) {
            log.error(`Invalid UF2 block detected at index ${i}`);
            return false;
        }

        const blockNo = dataView.getUint32(offset + 20, true);
        const reportedTotalBlocks = dataView.getUint32(offset + 24, true);

        // Ensure the total block count is consistent
        if (expectedTotalBlocks === null) {
            expectedTotalBlocks = reportedTotalBlocks;
        } else if (reportedTotalBlocks !== expectedTotalBlocks) {
            log.error(`Mismatch in total block count at index ${i}: expected ${expectedTotalBlocks}, found ${reportedTotalBlocks}`);
            return false;
        }

        // Ensure block numbers are sequential
        if (blockNo !== i) {
            log.error(`Block number mismatch at index ${i}: expected ${i}, found ${blockNo}`);
            return false;
        }
    }

    log.info('UF2 file validation successful');
    return true;
}