// SPDX-License-Identifier: MIT
// Original code:
// Copyright (c) 2015 Jam3 (https://github.com/Experience-Monks/audiobuffer-to-wav)
// Added mono mix option:
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

function encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * bytesPerSample, true);
    if (format === 1) { // Raw PCM
        floatTo16BitPCM(view, 44, samples);
    } else {
        writeFloat32(view, 44, samples);
    }
    return buffer;
}

function interleave(inputL, inputR) {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;
    while (index < length) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
    }
    return result;
}

function mix(inputL, inputR) {
    const length = inputL.length;
    const result = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        result[i] = (inputL[i] + inputR[i]) / 2;
    }
    return result;
}

function writeFloat32(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 4) {
        output.setFloat32(offset, input[i], true);
    }
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

export default function customAudioBufferToWav(buffer, opt) {

    opt = opt || {};
    let numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = opt.float32 ? 3 : 1;
    const monoMix = !!opt.monoMix;
    const bitDepth = format === 3 ? 32 : 16;

    let result;
    if (numChannels === 2) {
        if (monoMix) {
            result = mix(buffer.getChannelData(0), buffer.getChannelData(1));
            numChannels = 1;
        } else {
            result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
        }
    } else {
        result = buffer.getChannelData(0);
    }

    return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
}
