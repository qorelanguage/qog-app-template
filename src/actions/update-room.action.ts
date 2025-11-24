import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueRoomAllowedValues } from '../helpers/get-room-allowed-values';
import { getOpenHueDeviceAllowedValues } from '../helpers/get-device-allowed-values';

const options = {
  roomId: {
    display_name: 'Room',
    short_desc: 'Select the room to update',
    desc: 'Choose which room you want to modify',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueRoomAllowedValues,
  },
  name: {
    display_name: 'Room Name',
    short_desc: 'Update the room name',
    desc: 'Change the name of the room',
    type: 'string',
    required: false,
  },
  archetype: {
    display_name: 'Room Type',
    short_desc: 'Update the room type',
    desc: 'Change the archetype that describes this room',
    type: 'string',
    required: false,
    allowed_values: [
      { value: 'living_room', display_name: 'Living Room' },
      { value: 'kitchen', display_name: 'Kitchen' },
      { value: 'dining', display_name: 'Dining Room' },
      { value: 'bedroom', display_name: 'Bedroom' },
      { value: 'kids_bedroom', display_name: 'Kids Bedroom' },
      { value: 'bathroom', display_name: 'Bathroom' },
      { value: 'nursery', display_name: 'Nursery' },
      { value: 'recreation', display_name: 'Recreation Room' },
      { value: 'office', display_name: 'Office' },
      { value: 'gym', display_name: 'Gym' },
      { value: 'hallway', display_name: 'Hallway' },
      { value: 'toilet', display_name: 'Toilet' },
      { value: 'front_door', display_name: 'Front Door' },
      { value: 'garage', display_name: 'Garage' },
      { value: 'terrace', display_name: 'Terrace' },
      { value: 'garden', display_name: 'Garden' },
      { value: 'driveway', display_name: 'Driveway' },
      { value: 'carport', display_name: 'Carport' },
      { value: 'home', display_name: 'Home' },
      { value: 'downstairs', display_name: 'Downstairs' },
      { value: 'upstairs', display_name: 'Upstairs' },
      { value: 'top_floor', display_name: 'Top Floor' },
      { value: 'attic', display_name: 'Attic' },
      { value: 'guest_room', display_name: 'Guest Room' },
      { value: 'staircase', display_name: 'Staircase' },
      { value: 'lounge', display_name: 'Lounge' },
      { value: 'man_cave', display_name: 'Man Cave' },
      { value: 'computer', display_name: 'Computer Room' },
      { value: 'studio', display_name: 'Studio' },
      { value: 'music', display_name: 'Music Room' },
      { value: 'tv', display_name: 'TV Room' },
      { value: 'reading', display_name: 'Reading Room' },
      { value: 'closet', display_name: 'Closet' },
      { value: 'storage', display_name: 'Storage' },
      { value: 'laundry_room', display_name: 'Laundry Room' },
      { value: 'balcony', display_name: 'Balcony' },
      { value: 'porch', display_name: 'Porch' },
      { value: 'barbecue', display_name: 'Barbecue Area' },
      { value: 'pool', display_name: 'Pool' },
      { value: 'other', display_name: 'Other' },
    ],
  },
  children: {
    display_name: 'Devices',
    short_desc: 'Update devices in this room',
    desc: 'Modify which devices are part of this room',
    type: {
      type: 'list',
      element_type: 'string',
    },
    required: false,
    element_allowed_values_creatable: true,
    get_element_allowed_values: getOpenHueDeviceAllowedValues,
  },
} satisfies TQoreOptions;

const UpdateRoom = QoreAppCreator.createAction({
  action: 'update_room',
  group: 'Rooms',
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Update Room',
  short_desc: 'Modify room settings',
  desc: 'Update the name, type, or devices in an existing room',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, roomId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['roomId'],
      ErrorClass: OpenHueError,
    });

    const requestBody: Record<string, any> = {};

    if (obj?.name || obj?.archetype) {
      requestBody.metadata = {};
      if (obj?.name) {
        requestBody.metadata.name = obj.name;
      }
      if (obj?.archetype) {
        requestBody.metadata.archetype = obj.archetype;
      }
    }

    if (obj?.children) {
      requestBody.children = obj.children.map((deviceId: string) => ({
        rid: deviceId,
        rtype: 'device',
      }));
    }

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      username,
      token,
      path: `resource/room/${roomId}`,
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
      success: { type: 'boolean' },
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

export default UpdateRoom;
