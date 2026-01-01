import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueSceneAllowedValues } from '../helpers/get-scene-allowed-values';

const options = {
  sceneId: {
    display_name: 'Scene',
    short_desc: 'Select the scene to activate',
    desc: 'Choose which scene you want to recall and apply to the lights',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueSceneAllowedValues,
  },
  action: {
    display_name: 'Recall Action',
    short_desc: 'How to activate the scene',
    desc: 'Choose whether to activate the scene statically or with dynamic effects',
    type: 'string',
    required: false,
    default_value: 'active',
    allowed_values: [
      { value: 'active', display_name: 'Active - Execute scene actions immediately' },
      { value: 'dynamic_palette', display_name: 'Dynamic Palette - Start with dynamic colors' },
      { value: 'static', display_name: 'Static - Apply scene without transitions' },
    ],
  },
  duration: {
    display_name: 'Transition Duration',
    short_desc: 'Duration of transition in milliseconds',
    desc: 'How long the transition to the scene should take (in milliseconds)',
    type: 'integer',
    required: false,
  },
  brightness: {
    display_name: 'Brightness Override',
    short_desc: 'Override scene brightness (0-100)',
    desc: 'Optionally override the brightness level of the scene',
    type: 'number',
    required: false,
  },
} satisfies TQoreOptions;

const RecallScene = QoreAppCreator.createAction({
  action: 'recall_scene',
  groups: ['Scenes'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Recall Scene',
  short_desc: 'Activate a scene',
  desc: 'Recall and activate a scene to apply its settings to the associated lights',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, sceneId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['sceneId'],
      ErrorClass: OpenHueError,
    });

    const requestBody: Record<string, any> = {
      recall: {},
    };

    if (obj?.action) {
      requestBody.recall.action = obj.action;
    }

    if (obj?.duration !== undefined) {
      requestBody.recall.duration = obj.duration;
    }

    if (obj?.brightness !== undefined) {
      requestBody.recall.dimming = { brightness: obj.brightness };
    }

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      username,
      token,
      path: `resource/scene/${sceneId}`,
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

export default RecallScene;
