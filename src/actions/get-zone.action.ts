import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueZoneAllowedValues } from '../helpers/get-zone-allowed-values';

const options = {
  zoneId: {
    display_name: 'Zone',
    short_desc: 'Select the zone to retrieve',
    desc: 'Choose which zone you want to get detailed information about',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueZoneAllowedValues,
  },
} satisfies TQoreOptions;

const GetZone = QoreAppCreator.createAction({
  action: 'get_zone',
  groups: ['Zones'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Get Zone',
  short_desc: 'Get details of a specific zone',
  desc: 'Retrieve detailed information about a specific zone including its lights and grouped services',
  options,
  api_function: async (obj, _options, context) => {
    const { nickname, token, zoneId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['nickname', 'token'],
      optionFields: ['zoneId'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient<Record<string, any>[]>({
      nickname,
      token,
      object: 'data',
      path: `resource/zone/${zoneId}`,
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

export default GetZone;
