import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueLightAllowedValues } from '../helpers/get-light-allowed-values';

const options = {
  lightId: {
    display_name: 'Light',
    short_desc: 'Select the light to update',
    desc: 'Choose which light you want to control',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueLightAllowedValues,
  },
  on: {
    display_name: 'Power State',
    short_desc: 'Turn the light on or off',
    desc: 'Set whether the light should be on or off',
    type: 'bool',
    required: false,
    preselected: true,
  },
  brightness: {
    display_name: 'Brightness',
    short_desc: 'Set brightness level (0-100)',
    desc: 'Brightness percentage - cannot be 0, minimum brightness will be used instead',
    type: 'number',
    required: false,
    preselected: true,
  },
  color_temperature: {
    display_name: 'Color Temperature',
    short_desc: 'Set color temperature in mirek (153-500)',
    desc: 'Color temperature in mirek units - lower values are cooler, higher values are warmer',
    type: 'integer',
    required: false,
  },
  color_x: {
    display_name: 'Color X Coordinate',
    short_desc: 'X position in color gamut (0-1)',
    desc: 'X coordinate in the CIE color space',
    type: 'number',
    required: false,
  },
  color_y: {
    display_name: 'Color Y Coordinate',
    short_desc: 'Y position in color gamut (0-1)',
    desc: 'Y coordinate in the CIE color space',
    type: 'number',
    required: false,
  },
  effect: {
    display_name: 'Light Effect',
    short_desc: 'Apply a visual effect',
    desc: 'Choose a special effect for the light',
    type: 'string',
    required: false,
    allowed_values: [
      { value: 'no_effect', display_name: 'No Effect' },
      { value: 'prism', display_name: 'Prism' },
      { value: 'opal', display_name: 'Opal' },
      { value: 'glisten', display_name: 'Glisten' },
      { value: 'sparkle', display_name: 'Sparkle' },
      { value: 'fire', display_name: 'Fire' },
      { value: 'candle', display_name: 'Candle' },
      { value: 'underwater', display_name: 'Underwater' },
      { value: 'cosmos', display_name: 'Cosmos' },
      { value: 'sunbeam', display_name: 'Sunbeam' },
      { value: 'enchant', display_name: 'Enchant' },
    ],
  },
  transition_duration: {
    display_name: 'Transition Duration',
    short_desc: 'Duration of transition in milliseconds',
    desc: 'How long the transition to new settings should take',
    type: 'integer',
    required: false,
  },
} satisfies TQoreOptions;

const UpdateLight = QoreAppCreator.createAction({
  action: 'update_light',
  groups: ['Lights'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Update Light',
  short_desc: 'Control a Philips Hue light',
  desc: 'Update the state, brightness, color, or effects of a Philips Hue light',
  options,
  api_function: async (obj, _options, context) => {
    const { nickname, token, lightId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['nickname', 'token'],
      optionFields: ['lightId'],
      ErrorClass: OpenHueError,
    });

    const requestBody: Record<string, any> = {};

    if (obj?.on !== undefined) {
      requestBody.on = { on: obj.on };
    }

    if (obj?.brightness !== undefined) {
      requestBody.dimming = { brightness: obj.brightness };
    }

    if (obj?.color_temperature !== undefined) {
      requestBody.color_temperature = { mirek: obj.color_temperature };
    }

    if (obj?.color_x !== undefined && obj?.color_y !== undefined) {
      requestBody.color = {
        xy: {
          x: obj.color_x,
          y: obj.color_y,
        },
      };
    }

    if (obj?.effect !== undefined) {
      requestBody.effects = { effect: obj.effect };
    }

    if (obj?.transition_duration !== undefined) {
      requestBody.dynamics = { duration: obj.transition_duration };
    }

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      nickname,
      token,
      path: `resource/light/${lightId}`,
      method: 'PUT',
      body: requestBody,
    });

    return {
      success: true,
      updated_resources: data.data,
    };
  },
  response_type: {
    type: 'hash',
    fields: {
      success: { type: 'bool' },
      updated_resources: {
        type: {
          type: 'list',
          element_type: {
            type: 'hash',
            fields: {
              rid: { type: 'string' },
              rtype: { type: 'string' },
            },
          },
        },
      },
    },
  },
});

export default UpdateLight;
