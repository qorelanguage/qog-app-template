import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';
import { getOpenHueLightAllowedValues } from '../helpers/get-light-allowed-values';

const options = {
  lightId: {
    display_name: 'Light ID',
    short_desc: 'Light ID',
    desc: 'ID of the light to retrieve',
    type: 'string',
    required: true,
    get_allowed_values: getOpenHueLightAllowedValues,
  },
} satisfies TQoreOptions;

const GetLight = QoreAppCreator.createAction({
  action: 'get_light',
  groups: ['Lights'],
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Get Light',
  short_desc: 'Get Light',
  desc: 'Get a specific light',
  options,
  api_function: async (obj, _options, context) => {
    const { username, token, lightId } = getQoreContextRequiredValues({
      context: { ...context, opts: obj },
      connectionFields: ['username', 'token'],
      optionFields: ['lightId'],
      ErrorClass: OpenHueError,
    });

    const data = await openHueApiClient<Record<string, any>[]>({
      username,
      token,
      object: 'data',
      path: `resource/light/${lightId}`,
      method: 'GET',
    });

    return data[0];
  },
  response_type: {
    type: 'hash',
    fields: {
      id: { type: 'string' },
      id_v1: { type: 'string' },
      owner: {
        type: {
          type: 'hash',
          fields: {
            rid: { type: 'string' },
            rtype: { type: 'string' },
          },
        },
      },
      metadata: {
        type: {
          type: 'hash',
          fields: {
            name: { type: 'string' },
            archetype: { type: 'string' },
            function: { type: 'string' },
          },
        },
      },
      product_data: {
        type: {
          type: 'hash',
          fields: {
            function: { type: 'string' },
          },
        },
      },
      identify: {
        type: {
          type: 'hash',
        },
      },
      service_id: { type: 'integer' },
      on: {
        type: {
          type: 'hash',
          fields: {
            on: { type: 'bool' },
          },
        },
      },
      dimming: {
        type: {
          type: 'hash',
          fields: {
            brightness: { type: 'number' },
            min_dim_level: { type: 'number' },
          },
        },
      },
      dimming_delta: {
        type: {
          type: 'hash',
        },
      },
      color_temperature: {
        type: {
          type: 'hash',
          fields: {
            mirek: { type: 'integer' },
            mirek_valid: { type: 'bool' },
            mirek_schema: {
              type: {
                type: 'hash',
                fields: {
                  mirek_minimum: { type: 'integer' },
                  mirek_maximum: { type: 'integer' },
                },
              },
            },
          },
        },
      },
      color_temperature_delta: {
        type: {
          type: 'hash',
        },
      },
      dynamics: {
        type: {
          type: 'hash',
          fields: {
            status: { type: 'string' },
            status_values: {
              type: {
                type: 'list',
                element_type: 'string',
              },
            },
            speed: { type: 'number' },
            speed_valid: { type: 'bool' },
          },
        },
      },
      alert: {
        type: {
          type: 'hash',
          fields: {
            action_values: {
              type: {
                type: 'list',
                element_type: 'string',
              },
            },
          },
        },
      },
      signaling: {
        type: {
          type: 'hash',
          fields: {
            signal_values: {
              type: {
                type: 'list',
                element_type: 'string',
              },
            },
          },
        },
      },
      mode: { type: 'string' },
      effects: {
        type: {
          type: 'hash',
          fields: {
            status_values: {
              type: {
                type: 'list',
                element_type: 'string',
              },
            },
            status: { type: 'string' },
            effect_values: {
              type: {
                type: 'list',
                element_type: 'string',
              },
            },
          },
        },
      },
      effects_v2: {
        type: {
          type: 'hash',
          fields: {
            action: {
              type: {
                type: 'hash',
                fields: {
                  effect_values: {
                    type: {
                      type: 'list',
                      element_type: 'string',
                    },
                  },
                },
              },
            },
            status: {
              type: {
                type: 'hash',
                fields: {
                  effect: { type: 'string' },
                  effect_values: {
                    type: {
                      type: 'list',
                      element_type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
      powerup: {
        type: {
          type: 'hash',
          fields: {
            preset: { type: 'string' },
            configured: { type: 'bool' },
            on: {
              type: {
                type: 'hash',
                fields: {
                  mode: { type: 'string' },
                },
              },
            },
            dimming: {
              type: {
                type: 'hash',
                fields: {
                  mode: { type: 'string' },
                },
              },
            },
            color: {
              type: {
                type: 'hash',
                fields: {
                  mode: { type: 'string' },
                },
              },
            },
          },
        },
      },
      type: { type: 'string' },
    },
  },
});

export default GetLight;
