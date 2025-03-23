"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
var flowUtils_1 = require("../../../../FlowHelpers/1.0.0/interfaces/flowUtils");
var details = function () { return ({
    name: 'Set Encoder Level',
    description: 'Set the encoder level for the video stream (h265 only). ',
    style: {
        borderColor: '#6efefc',
    },
    tags: 'video',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '',
    inputs: [
        {
            label: 'Encoder level',
            name: 'encoderLevel',
            type: 'string',
            defaultValue: '5.1',
            inputUI: {
                type: 'dropdown',
                options: [
                    '4',
                    '4.1',
                    '5',
                    '5.1',
                    '5.2',
                    '6',
                    '6.1',
                    '6.2',
                ],
            },
            tooltip: 'Specify the encoder level for the video stream.',
        },
        {
            label: 'Update condition',
            name: 'updateCondition',
            type: 'string',
            defaultValue: 'Only if current level is higher',
            inputUI: {
                type: 'dropdown',
                options: [
                    'Only if current level is lower',
                    'Only if current level is higher',
                    'Always',
                ],
            },
            tooltip: 'Specify the update contition.',
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
        if (stream.codec_type !== 'video' || stream.codec_name !== 'hevc') {
            // eslint-disable-next-line no-continue
            continue;
        }
        var currentLevel = Number(stream.level);
        var updateCondition = args.inputs.updateCondition;
        var newLevel = Number(args.inputs.encoderLevel) * 30;
        if (updateCondition === 'Only if current level is lower' && currentLevel >= newLevel) {
            // eslint-disable-next-line no-continue
            continue;
        }
        if (updateCondition === 'Only if current level is higher' && currentLevel <= newLevel) {
            // eslint-disable-next-line no-continue
            continue;
        }
        if (updateCondition === 'Always' && currentLevel === newLevel) {
            // eslint-disable-next-line no-continue
            continue;
        }
        args.variables.ffmpegCommand.overallOuputArguments.push("-bsf:".concat(i), "hevc_metadata=level=".concat(newLevel / 30));
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
