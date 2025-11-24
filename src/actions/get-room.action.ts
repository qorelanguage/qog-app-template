import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueRoomAllowedValues } from '../helpers/get-room-allowed-values';

const options = {
  roomId: {
    display_name: 'Room',
    short_desc: 'Select the room to retrieve',
    desc: 'Choose which room you want to get details for',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueRoomAllowedValues,
  },
} satisfies TQoreOptions;

const GetRoom = QoreAppCreator.createAction({
  action: 'get_room',
  group: 'Rooms',
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Get Room',
  short_desc: 'Get details of a specific room',
  desc: 'Retrieve detailed information about a specific room including its devices and services',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, roomId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['roomId'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient<Record<string, any>[]>({
      username,
      token,
      object: 'data',
      path: `resource/room/${roomId}`,
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
});

export default GetRoom;
