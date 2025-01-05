"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
var flowUtils_1 = require("../../../../FlowHelpers/1.0.0/interfaces/flowUtils");
var details = function () { return ({
    name: 'Compress lossless codecs',
    description: 'Compress lossless audio codecs (DTS-HD MA, TrueHD, FLAC, PCM) to lossy audio codecs.',
    style: {
        borderColor: '#6efefc',
    },
    tags: 'audio',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '',
    inputs: [
        {
            label: 'Compress DTS-HD MA',
            name: 'compressDTSHDMA',
            type: 'boolean',
            defaultValue: 'true',
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Toggle whether DTS-HD MA audio streams will be compressed or not.',
        },
        {
            label: 'Compress TrueHD',
            name: 'compressTrueHD',
            type: 'boolean',
            defaultValue: 'true',
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Toggle whether TrueHD audio streams will be compressed or not.',
        },
        {
            label: 'Compress FLAC',
            name: 'compressFLAC',
            type: 'boolean',
            defaultValue: 'true',
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Toggle whether FLAC audio streams will be compressed or not.',
        },
        {
            label: 'Compress PCM',
            name: 'compressPCM',
            type: 'boolean',
            defaultValue: 'true',
            inputUI: {
                type: 'switch',
            },
            tooltip: 'Toggle whether PCM audio streams will be compressed or not.',
        },
        {
            label: 'Encoder for 1.0 audio streams',
            name: 'encoder10',
            type: 'string',
            defaultValue: 'libfdk_aac',
            inputUI: {
                type: 'dropdown',
                options: [
                    'aac',
                    'libfdk_aac',
                    'ac3',
                    'eac3',
                    'opus',
                    'libopus',
                    'libmp3lame',
                ],
            },
            tooltip: 'Specify the encoder used for 1.0 audio streams',
        },
        {
            label: 'Bitrate for 1.0 audio streams',
            name: 'bitrate10',
            type: 'string',
            defaultValue: '128k',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Specify the bitrate for 1.0 audio streams',
        },
        {
            label: 'Encoder for 2.0 audio streams',
            name: 'encoder20',
            type: 'string',
            defaultValue: 'libfdk_aac',
            inputUI: {
                type: 'dropdown',
                options: [
                    'aac',
                    'libfdk_aac',
                    'ac3',
                    'eac3',
                    'opus',
                    'libopus',
                    'libmp3lame',
                ],
            },
            tooltip: 'Specify the encoder used for 2.0 audio streams',
        },
        {
            label: 'Bitrate for 2.0 audio streams',
            name: 'bitrate20',
            type: 'string',
            defaultValue: '256k',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Specify the bitrate for 2.0 audio streams',
        },
        {
            label: 'Encoder for 5.1 audio streams',
            name: 'encoder51',
            type: 'string',
            defaultValue: 'eac3',
            inputUI: {
                type: 'dropdown',
                options: [
                    'aac',
                    'libfdk_aac',
                    'ac3',
                    'eac3',
                    'opus',
                    'libopus',
                    'libmp3lame',
                ],
            },
            tooltip: 'Specify the encoder used for 5.1 audio streams',
        },
        {
            label: 'Bitrate for 5.1 audio streams',
            name: 'bitrate51',
            type: 'string',
            defaultValue: '448k',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Specify the bitrate for 5.1 audio streams',
        },
        {
            label: 'Encoder for 7.1 audio streams',
            name: 'encoder71',
            type: 'string',
            defaultValue: 'eac3',
            inputUI: {
                type: 'dropdown',
                options: ['aac', 'libfdk_aac', 'eac3', 'opus', 'libopus'],
            },
            tooltip: 'Specify the encoder used for 7.1 audio streams',
        },
        {
            label: 'Bitrate for 7.1 audio streams',
            name: 'bitrate71',
            type: 'string',
            defaultValue: '640k',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Specify the bitrate for 7.1 audio streams',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: 'Continue to next plugin',
        },
    ],
}); };
exports.details = details;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var plugin = function (args) {
    var lib = require('../../../../../methods/lib')();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
    args.inputs = lib.loadDefaultValues(args.inputs, details);
    (0, flowUtils_1.checkFfmpegCommandInit)(args);
    for (var i = 0; i < args.variables.ffmpegCommand.streams.length; i += 1) {
        var stream = args.variables.ffmpegCommand.streams[i];
        if (stream.codec_type !== 'audio') {
            // eslint-disable-next-line no-continue
            continue;
        }
        var compressDTSHDMA = Boolean(args.inputs.compressDTSHDMA);
        var compressTrueHD = Boolean(args.inputs.compressTrueHD);
        var compressFLAC = Boolean(args.inputs.compressFLAC);
        var compressPCM = Boolean(args.inputs.compressPCM);
        var processStream = compressDTSHDMA && stream.codec_name === 'dts' && stream.profile === 'DTS-HD MA';
        processStream = processStream || (compressTrueHD && stream.codec_name === 'truehd');
        processStream = processStream || (compressFLAC && stream.codec_name === 'flac');
        processStream = processStream || (compressPCM && stream.codec_name.startsWith('pcm_'));
        if (!processStream) {
            // eslint-disable-next-line no-continue
            continue;
        }
        switch (stream.channels) {
            case 1:
                stream.outputArgs.push('-c:{outputIndex}', String(args.inputs.encoder10));
                stream.outputArgs.push('-b:{outputIndex}', String(args.inputs.bitrate10));
                break;
            case 2:
                stream.outputArgs.push('-c:{outputIndex}', String(args.inputs.encoder20));
                stream.outputArgs.push('-b:{outputIndex}', String(args.inputs.bitrate20));
                break;
            case 6:
                stream.outputArgs.push('-c:{outputIndex}', String(args.inputs.encoder51));
                stream.outputArgs.push('-b:{outputIndex}', String(args.inputs.bitrate51));
                break;
            case 8:
                stream.outputArgs.push('-c:{outputIndex}', String(args.inputs.encoder71));
                stream.outputArgs.push('-b:{outputIndex}', String(args.inputs.bitrate71));
                break;
            default:
                break;
        }
        // eslint-disable-next-line no-param-reassign
        args.variables.ffmpegCommand.shouldProcess = true;
    }
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: 1,
        variables: args.variables,
    };
};
exports.plugin = plugin;
