import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueSceneAllowedValues } from '../helpers/get-scene-allowed-values';

const options = {
  sceneId: {
    display_name: 'Scene',
    short_desc: 'Select the scene to update',
    desc: 'Choose which scene you want to modify',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueSceneAllowedValues,
  },
  name: {
    display_name: 'Scene Name',
    short_desc: 'Update the scene name',
    desc: 'Change the name of the scene',
    type: 'string',
    required: false,
  },
  speed: {
    display_name: 'Dynamic Speed',
    short_desc: 'Speed of dynamic palette (0-1)',
    desc: 'How fast the dynamic palette should transition',
    type: 'number',
    required: false,
  },
  auto_dynamic: {
    display_name: 'Auto Dynamic',
    short_desc: 'Start dynamically on recall',
    desc: 'Whether to automatically start dynamically when recalled',
    type: 'bool',
    required: false,
  },
} satisfies TQoreOptions;

const UpdateScene = QoreAppCreator.createAction({
  action: 'update_scene',
  groups: ['Scenes'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Update Scene',
  short_desc: 'Modify scene settings',
  desc: 'Update the configuration and settings of an existing scene',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, sceneId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['sceneId'],
      ErrorClass: OpenHueError,
    });

    const requestBody: Record<string, any> = {};

    if (obj?.name) {
      requestBody.metadata = { name: obj.name };
    }

    if (obj?.speed !== undefined) {
      requestBody.speed = obj.speed;
    }

    if (obj?.auto_dynamic !== undefined) {
      requestBody.auto_dynamic = obj.auto_dynamic;
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

export default UpdateScene;
