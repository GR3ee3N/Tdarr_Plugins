"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
var details = function () { return ({
    name: 'Compress lossless parameters',
    description: 'Generate ffmpeg parameters to compress all lossless audio tracks. Parameters will be saved in flow variable for use in ffmpeg command plugin.',
    style: {
        borderColor: 'orange',
    },
    tags: 'audio',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: 'faQuestion',
    inputs: [
        {
            label: 'Encoder for 1.0',
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
                    'libmp3lame'
                ],
            },
            tooltip: 'Specify the encoder for 1.0 audio streams',
        },
        {
            label: 'Bitrate for 1.0',
            name: 'bitrate10',
            type: 'string',
            defaultValue: '128k',
            inputUI: {
                type: 'text'
            },
            tooltip: 'Specify the audio bitrate for 1.0 audio streams',
        },
        {
            label: 'Encoder for 2.0',
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
                    'libmp3lame'
                ],
            },
            tooltip: 'Specify the encoder for 2.0 audio streams',
        },
        {
            label: 'Bitrate for 2.0',
            name: 'bitrate20',
            type: 'string',
            defaultValue: '256k',
            inputUI: {
                type: 'text'
            },
            tooltip: 'Specify the audio bitrate for 2.0 audio streams',
        },
        {
            label: 'Encoder for 5.1',
            name: 'encoder51',
            type: 'string',
            defaultValue: 'ac3',
            inputUI: {
                type: 'dropdown',
                options: [
                    'aac',
                    'libfdk_aac',
                    'ac3',
                    'eac3',
                    'opus',
                    'libopus',
                    'libmp3lame'
                ],
            },
            tooltip: 'Specify the encoder for 5.1 audio streams',
        },
        {
            label: 'Bitrate for 5.1',
            name: 'bitrate51',
            type: 'string',
            defaultValue: '448k',
            inputUI: {
                type: 'text'
            },
            tooltip: 'Specify the audio bitrate for 5.1 audio streams',
        },
        {
            label: 'Encoder for 7.1',
            name: 'encoder71',
            type: 'string',
            defaultValue: 'eac3',
            inputUI: {
                type: 'dropdown',
                options: [
                    'aac',
                    'libfdk_aac',
                    'eac3',
                    'opus',
                    'libopus'
                ],
            },
            tooltip: 'Specify the encoder for 7.1 audio streams',
        },
        {
            label: 'Bitrate for 7.1',
            name: 'bitrate71',
            type: 'string',
            defaultValue: '640k',
            inputUI: {
                type: 'text'
            },
            tooltip: 'Specify the audio bitrate for 7.1 audio streams',
        },
        {
            label: 'Parameter variable name',
            name: 'variableName',
            type: 'string',
            defaultValue: 'compressLosslessParameters',
            inputUI: {
                type: 'text'
            },
            tooltip: 'Name of the variable that the ffmpeg paramters will be written to',
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
    var variable = 'compressLosslessParameters';
    if (!args.inputFileObj.ffProbeData.streams) {
        return {
            outputFileObj: args.inputFileObj,
            outputNumber: 1,
            variables: args.variables,
        };
    }
    var ffmpegParameter = '';
    args.inputFileObj.ffProbeData.streams.forEach(function (stream, index) {
        var losslessCodecs = ['dca', 'dts', 'truehd', 'flac'];
        if (stream.codec_type === 'audio' && (losslessCodecs.includes(stream.codec_name) || stream.codec_name.startsWith('pcm_'))) {
            switch (stream.channels) {
                case 1:
                    ffmpegParameter += " -c:".concat(index, " ").concat(args.inputs.encoder10, " -b:").concat(index, " ").concat(args.inputs.bitrate10);
                    break;
                case 2:
                    ffmpegParameter += " -c:".concat(index, " ").concat(args.inputs.encoder20, " -b:").concat(index, " ").concat(args.inputs.bitrate20);
                    break;
                case 6:
                    ffmpegParameter += " -c:".concat(index, " ").concat(args.inputs.encoder51, " -b:").concat(index, " ").concat(args.inputs.bitrate51);
                    break;
                case 8:
                    ffmpegParameter += " -c:".concat(index, " ").concat(args.inputs.encoder71, " -b:").concat(index, " ").concat(args.inputs.bitrate71);
                    break;
                default:
                    break;
            }
        }
    });
    if (!args.variables.user)
        // eslint-disable-next-line no-param-reassign
        args.variables.user = {};
    args.jobLog("Setting variable ".concat(variable, " to ").concat(ffmpegParameter));
    // eslint-disable-next-line no-param-reassign
    args.variables.user[variable] = ffmpegParameter;
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: 1,
        variables: args.variables,
    };
};
exports.plugin = plugin;
