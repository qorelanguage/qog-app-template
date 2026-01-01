import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueDeviceAllowedValues } from '../helpers/get-device-allowed-values';

const options = {
  name: {
    display_name: 'Room Name',
    short_desc: 'Name for the new room',
    desc: 'Give your room a descriptive name',
    type: 'string',
    required: true,
  },
  archetype: {
    display_name: 'Room Type',
    short_desc: 'Select the type of room',
    desc: 'Choose the archetype that best describes this room',
    type: 'string',
    required: true,
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
    short_desc: 'Select devices to add to this room',
    desc: 'Choose which devices should be part of this room',
    type: {
      type: 'list',
      element_type: 'string',
    },
    required: true,
    element_allowed_values_creatable: true,
    get_element_allowed_values: getOpenHueDeviceAllowedValues,
  },
} satisfies TQoreOptions;

const CreateRoom = QoreAppCreator.createAction({
  action: 'create_room',
  groups: ['Rooms'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Create Room',
  short_desc: 'Create a new room',
  desc: 'Create a new room and assign devices to it for organized control',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, name, archetype, children } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['name', 'archetype', 'children'],
      ErrorClass: OpenHueError,
    });

    const requestBody = {
      type: 'room',
      metadata: {
        name,
        archetype,
      },
      children: children.map((deviceId: string) => ({
        rid: deviceId,
        rtype: 'device',
      })),
    };

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      username,
      token,
      path: 'resource/room',
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

export default CreateRoom;
