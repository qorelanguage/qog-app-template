import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';

const options = {} satisfies TQoreOptions;

const ListScenes = QoreAppCreator.createAction({
  action: 'list_scenes',
  groups: ['Scenes'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'List Scenes',
  short_desc: 'Get all available scenes',
  desc: 'Retrieve a list of all scenes configured in your Philips Hue system',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient({
      username,
      token,
      object: 'data',
      path: 'resource/scene',
      method: 'GET',
    });

    return { scenes: data };
  },
  response_type: {
    type: 'hash',
    fields: {
      scenes: {
        type: {
          type: 'list',
          element_type: {
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
        },
      },
    },
  },
});

export default ListScenes;
