// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

function deepClone(value, hash = new WeakMap()) {
    // primitives are returned as is
    if (Object(value) !== value) {return value;}

    // Handle Dates
    if (value instanceof Date) {return new Date(value);}

    // Handle RegExp
    if (value instanceof RegExp) {return new RegExp(value.source, value.flags);}

    // Handle already cloned objects to prevent circular reference issues.
    if (hash.has(value)) {return hash.get(value);}

    // Handle Arrays
    if (Array.isArray(value)) {
        const arr = [];
        hash.set(value, arr);
        for (let i = 0; i < value.length; i++) {
            arr[i] = deepClone(value[i], hash);
        }
        return arr;
    }

    // Handle Maps
    if (value instanceof Map) {
        const result = new Map();
        hash.set(value, result);
        value.forEach((v, k) => {
            result.set(deepClone(k, hash), deepClone(v, hash));
        });
        return result;
    }

    // Handle Sets
    if (value instanceof Set) {
        const result = new Set();
        hash.set(value, result);
        value.forEach((v) => {
            result.add(deepClone(v, hash));
        });
        return result;
    }

    // Handle ArrayBuffer
    if (value instanceof ArrayBuffer) {
        return value.slice(0);
    }

    // Handle TypedArrays and other ArrayBuffer views
    if (ArrayBuffer.isView(value)) {
        return new value.constructor(value.buffer.slice(0));
    }

    // Handle plain objects (or objects with a custom prototype)
    const result = Object.create(Object.getPrototypeOf(value));
    hash.set(value, result);
    for (const key of Reflect.ownKeys(value)) {
        // Include non-enumerable and symbol properties.
        result[key] = deepClone(value[key], hash);
    }
    return result;
}

export default function cloneObj(object) {
    if (typeof structuredClone === 'function') {
        return structuredClone(object);
    }
    return deepClone(object);
}