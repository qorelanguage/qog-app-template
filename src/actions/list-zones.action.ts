import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';

const options = {} satisfies TQoreOptions;

const ListZones = QoreAppCreator.createAction({
  action: 'list_zones',
  groups: ['Zones'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'List Zones',
  short_desc: 'Get all zones',
  desc: 'Retrieve a complete list of all zones in your Philips Hue system with their lights and services',
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
      path: 'resource/zone',
      method: 'GET',
    });

    return { zones: data };
  },
  response_type: {
    type: 'hash',
    fields: {
      zones: {
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

export default ListZones;
