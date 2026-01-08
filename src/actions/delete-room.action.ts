import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueRoomAllowedValues } from '../helpers/get-room-allowed-values';

const options = {
  roomId: {
    display_name: 'Room',
    short_desc: 'Select the room to delete',
    desc: 'Choose which room you want to permanently remove',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueRoomAllowedValues,
  },
} satisfies TQoreOptions;

const DeleteRoom = QoreAppCreator.createAction({
  action: 'delete_room',
  groups: ['Rooms'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Delete Room',
  short_desc: 'Remove a room',
  desc: 'Permanently delete a room from your Philips Hue system',
  options,
  api_function: async (obj, _options, context) => {
    const { nickname, token, roomId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['nickname', 'token'],
      optionFields: ['roomId'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      nickname,
      token,
      path: `resource/room/${roomId}`,
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
      success: { type: 'bool' },
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

export default DeleteRoom;
