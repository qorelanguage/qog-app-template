import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';

const options = {} satisfies TQoreOptions;

const ListRooms = QoreAppCreator.createAction({
  action: 'list_rooms',
  groups: ['Rooms'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'List Rooms',
  short_desc: 'Get all rooms',
  desc: 'Retrieve a list of all rooms in your Philips Hue system with their devices and services',
  options,
  api_function: async (obj, _options, context) => {
    const { nickname, token } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['nickname', 'token'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient({
      nickname,
      token,
      object: 'data',
      path: 'resource/room',
      method: 'GET',
    });

    return { rooms: data };
  },
  response_type: {
    type: 'hash',
    fields: {
      rooms: {
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
                    archetype: { type: 'string' },
                  },
                },
              },
              children: {
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
              services: {
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
        },
      },
    },
  },
});

export default ListRooms;
