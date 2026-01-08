import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueGroupedLightAllowedValues } from '../helpers/get-grouped-light-allowed-values';
import { getOpenHueLightAllowedValues } from '../helpers/get-light-allowed-values';

const options = {
  name: {
    display_name: 'Scene Name',
    short_desc: 'Name for the new scene',
    desc: 'Give your scene a descriptive name',
    type: 'string',
    required: true,
  },
  group_id: {
    display_name: 'Group',
    short_desc: 'Select the group for this scene',
    desc: 'Choose which group of lights this scene will control',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueGroupedLightAllowedValues,
  },
  actions: {
    display_name: 'Light Actions',
    short_desc: 'Configure actions for each light',
    desc: 'Define what each light should do when the scene is activated',
    type: {
      type: 'list',
      element_type: {
        type: 'hash',
        fields: {
          target_light_id: {
            type: 'string',
            required: true,
            display_name: 'Target Light',
            short_desc: 'Select the light to control',
            desc: 'Choose which light this action applies to',
            get_allowed_values: getOpenHueLightAllowedValues,
          },
          on: {
            type: 'bool',
            required: false,
            display_name: 'Power State',
            short_desc: 'Turn light on or off',
            desc: 'Set whether the light should be on or off in this scene',
          },
          brightness: {
            type: 'number',
            required: false,
            display_name: 'Brightness',
            short_desc: 'Set brightness (0-100)',
            desc: 'Brightness percentage for this light in the scene',
          },
          color_temperature: {
            type: 'integer',
            required: false,
            display_name: 'Color Temperature',
            short_desc: 'Color temperature in mirek (50-1000)',
            desc: 'Color temperature value in mirek units',
          },
          color_x: {
            type: 'number',
            required: false,
            display_name: 'Color X',
            short_desc: 'X coordinate in color space (0-1)',
            desc: 'X coordinate in CIE color gamut',
          },
          color_y: {
            type: 'number',
            required: false,
            display_name: 'Color Y',
            short_desc: 'Y coordinate in color space (0-1)',
            desc: 'Y coordinate in CIE color gamut',
          },
        },
      },
    },
    required: true,
  },
  speed: {
    display_name: 'Dynamic Speed',
    short_desc: 'Speed of dynamic palette (0-1)',
    desc: 'How fast the dynamic palette should transition between colors',
    type: 'number',
    required: false,
  },
  auto_dynamic: {
    display_name: 'Auto Dynamic',
    short_desc: 'Start dynamically on recall',
    desc: 'Whether to automatically start the scene dynamically when recalled',
    type: 'bool',
    required: false,
  },
} satisfies TQoreOptions;

const CreateScene = QoreAppCreator.createAction({
  action: 'create_scene',
  groups: ['Scenes'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Create Scene',
  short_desc: 'Create a new scene',
  desc: 'Create a new scene with custom light settings and actions',
  options,
  api_function: async (obj, _options, context) => {
    const { nickname, token, name, group_id, actions } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['nickname', 'token'],
      optionFields: ['name', 'group_id', 'actions'],
      ErrorClass: OpenHueError,
    });

    const requestBody: Record<string, any> = {
      type: 'scene',
      metadata: {
        name,
      },
      group: {
        rid: group_id,
        rtype: 'grouped_light',
      },
      actions: actions.map((action: any) => {
        const actionData: Record<string, any> = {
          target: {
            rid: action.target_light_id,
            rtype: 'light',
          },
          action: {},
        };

        if (action.on !== undefined) {
          actionData.action.on = { on: action.on };
        }

        if (action.brightness !== undefined) {
          actionData.action.dimming = { brightness: action.brightness };
        }

        if (action.color_temperature !== undefined) {
          actionData.action.color_temperature = { mirek: action.color_temperature };
        }

        if (action.color_x !== undefined && action.color_y !== undefined) {
          actionData.action.color = {
            xy: {
              x: action.color_x,
              y: action.color_y,
            },
          };
        }

        return actionData;
      }),
    };

    if (obj?.speed !== undefined) {
      requestBody.speed = obj.speed;
    }

    if (obj?.auto_dynamic !== undefined) {
      requestBody.auto_dynamic = obj.auto_dynamic;
    }

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      nickname,
      token,
      path: 'resource/scene',
      method: 'POST',
      body: requestBody,
    });

    return {
      success: true,
      created_resources: data.data,
    };
  },
  response_type: {
    type: 'hash',
    fields: {
      success: { type: 'bool' },
      created_resources: {
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

export default CreateScene;
