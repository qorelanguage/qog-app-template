import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueZoneAllowedValues } from '../helpers/get-zone-allowed-values';
import { getOpenHueLightAllowedValues } from '../helpers/get-light-allowed-values';

const options = {
  zoneId: {
    display_name: 'Zone',
    short_desc: 'Select the zone to update',
    desc: 'Choose which zone you want to modify',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueZoneAllowedValues,
  },
  name: {
    display_name: 'Zone Name',
    short_desc: 'Update the zone name',
    desc: 'Change the name of the zone to better reflect its purpose',
    type: 'string',
    required: false,
  },
  archetype: {
    display_name: 'Zone Type',
    short_desc: 'Update the zone type',
    desc: 'Change the archetype that describes this zone',
    type: 'string',
    required: false,
    allowed_values: [
      { value: 'living_room', display_name: 'Living Room' },
      { value: 'kitchen', display_name: 'Kitchen' },
      { value: 'dining', display_name: 'Dining' },
      { value: 'bedroom', display_name: 'Bedroom' },
      { value: 'kids_bedroom', display_name: 'Kids Bedroom' },
      { value: 'bathroom', display_name: 'Bathroom' },
      { value: 'nursery', display_name: 'Nursery' },
      { value: 'recreation', display_name: 'Recreation' },
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
      { value: 'computer', display_name: 'Computer' },
      { value: 'studio', display_name: 'Studio' },
      { value: 'music', display_name: 'Music' },
      { value: 'tv', display_name: 'TV' },
      { value: 'reading', display_name: 'Reading' },
      { value: 'closet', display_name: 'Closet' },
      { value: 'storage', display_name: 'Storage' },
      { value: 'laundry_room', display_name: 'Laundry Room' },
      { value: 'balcony', display_name: 'Balcony' },
      { value: 'porch', display_name: 'Porch' },
      { value: 'barbecue', display_name: 'Barbecue' },
      { value: 'pool', display_name: 'Pool' },
      { value: 'other', display_name: 'Other' },
    ],
  },
  children: {
    display_name: 'Lights',
    short_desc: 'Update lights in this zone',
    desc: 'Modify which lights are part of this zone',
    type: {
      type: 'list',
      element_type: 'string',
    },
    required: false,
    element_allowed_values_creatable: true,
    get_element_allowed_values: getOpenHueLightAllowedValues,
  },
} satisfies TQoreOptions;

const UpdateZone = QoreAppCreator.createAction({
  action: 'update_zone',
  groups: ['Zones'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Update Zone',
  short_desc: 'Modify zone settings',
  desc: 'Update the name, type, or lights in an existing zone',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, zoneId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['zoneId'],
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
      requestBody.children = obj.children.map((lightId: string) => ({
        rid: lightId,
        rtype: 'light',
      }));
    }

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      username,
      token,
      path: `resource/zone/${zoneId}`,
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

export default UpdateZone;
