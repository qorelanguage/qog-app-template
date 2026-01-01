import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueSceneAllowedValues } from '../helpers/get-scene-allowed-values';

const options = {
  sceneId: {
    display_name: 'Scene',
    short_desc: 'Select the scene to retrieve',
    desc: 'Choose which scene you want to get details for',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueSceneAllowedValues,
  },
} satisfies TQoreOptions;

const GetScene = QoreAppCreator.createAction({
  action: 'get_scene',
  groups: ['Scenes'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Get Scene',
  short_desc: 'Get details of a specific scene',
  desc: 'Retrieve detailed information about a specific scene including its actions and configuration',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, sceneId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['sceneId'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient<Record<string, any>[]>({
      username,
      token,
      object: 'data',
      path: `resource/scene/${sceneId}`,
      method: 'GET',
    });

    return data[0];
  },
  response_type: {
    type: 'hash',
    fields: {
      id: { type: 'string' },
      metadata: {
        type: {
          type: 'hash',
          fields: {
            name: { type: 'string' },
          },
        },
      },
      group: {
        type: {
          type: 'hash',
          fields: {
            rid: { type: 'string' },
            rtype: { type: 'string' },
          },
        },
      },
      actions: {
        type: {
          type: 'list',
          element_type: {
            type: 'hash',
          },
        },
      },
      palette: {
        type: {
          type: 'hash',
        },
      },
      speed: { type: 'number' },
      auto_dynamic: { type: 'bool' },
      status: {
        type: {
          type: 'hash',
          fields: {
            active: { type: 'string' },
          },
        },
      },
    },
  },
});

export default GetScene;
