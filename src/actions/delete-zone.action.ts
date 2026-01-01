import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueZoneAllowedValues } from '../helpers/get-zone-allowed-values';

const options = {
  zoneId: {
    display_name: 'Zone',
    short_desc: 'Select the zone to delete',
    desc: 'Choose which zone you want to permanently remove',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueZoneAllowedValues,
  },
} satisfies TQoreOptions;

const DeleteZone = QoreAppCreator.createAction({
  action: 'delete_zone',
  groups: ['Zones'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Delete Zone',
  short_desc: 'Remove a zone',
  desc: 'Permanently delete a zone from your Philips Hue system',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, zoneId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['zoneId'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient<{ data: Array<{ rid: string; rtype: string }> }>({
      username,
      token,
      path: `resource/zone/${zoneId}`,
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

export default DeleteZone;
