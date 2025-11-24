import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueSceneAllowedValues } from '../helpers/get-scene-allowed-values';

const options = {
  sceneId: {
    display_name: 'Scene',
    short_desc: 'Select the scene to delete',
    desc: 'Choose which scene you want to permanently remove',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueSceneAllowedValues,
  },
} satisfies TQoreOptions;

const DeleteScene = QoreAppCreator.createAction({
  action: 'delete_scene',
  group: 'Scenes',
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Delete Scene',
  short_desc: 'Remove a scene',
  desc: 'Permanently delete a scene from your Philips Hue system',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, sceneId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['sceneId'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      username,
      token,
      path: `resource/scene/${sceneId}`,
      method: 'DELETE',
    });

    return {
      success: true,
      deleted_resources: data.data,
    };
  },
  response_type: {
    type: 'hash',
    fields: {
      success: { type: 'boolean' },
      deleted_resources: {
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

export default DeleteScene;
