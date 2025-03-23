import { checkFfmpegCommandInit } from '../../../../FlowHelpers/1.0.0/interfaces/flowUtils';
import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from '../../../../FlowHelpers/1.0.0/interfaces/interfaces';

const details = (): IpluginDetails => ({
  name: 'Set Encoder Level',
  description:
    'Set the encoder level for the video stream (h265 only). ',
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
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = (args: IpluginInputArgs): IpluginOutputArgs => {
  const lib = require('../../../../../methods/lib')();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details);

  checkFfmpegCommandInit(args);

  for (let i = 0; i < args.variables.ffmpegCommand.streams.length; i += 1) {
    const stream = args.variables.ffmpegCommand.streams[i];

    if (stream.codec_type !== 'video' || stream.codec_name !== 'hevc') {
      // eslint-disable-next-line no-continue
      continue;
    }

    const currentLevel = Number(stream.level);
    const updateCondition = args.inputs.updateCondition;
    const newLevel = Number(args.inputs.encoderLevel) * 30;

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

    args.variables.ffmpegCommand.overallOuputArguments.push(`-bsf:${i}`, `hevc_metadata=level=${newLevel / 30}`);

    // eslint-disable-next-line no-param-reassign
    args.variables.ffmpegCommand.shouldProcess = true;
  }

  return {
    outputFileObj: args.inputFileObj,
    outputNumber: 1,
    variables: args.variables,
  };
};
export { details, plugin };
