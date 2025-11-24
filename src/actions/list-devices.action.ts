import { EQoreAppActionCode, QoreAppCreator, TQoreOptions } from '@qoretechnologies/ts-toolkit';
import { OPENHUE_APP_NAME, OpenHueError } from '../constants';
import { getQoreContextRequiredValues, openHueApiClient } from '../helpers/constants';

const options = {} satisfies TQoreOptions;

const ListDevices = QoreAppCreator.createAction({
  action: 'list_devices',
  app: OPENHUE_APP_NAME,
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'List Devices',
  short_desc: 'List Devices',
  desc: 'List all devices',
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
      path: 'resource/device',
      method: 'GET',
    });

    return { devices: data };
  },
  response_type: {
    type: 'hash',
    fields: {
      devices: {
        type: {
          type: 'list',
          element_type: {
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
              type: { type: 'string' },
              metadata: {
                type: {
                  type: 'hash',
                  fields: {
                    name: { type: 'string' },
                    archetype: { type: 'string' },
                    fixed_mired: { type: 'integer' },
                    function: { type: 'string' },
                  },
                },
              },
              product_data: {
                type: {
                  type: 'hash',
                  fields: {
                    name: { type: 'string' },
                    archetype: { type: 'string' },
                    function: { type: 'string' },
                  },
                },
              },
              identify: {
                type: {
                  type: 'hash',
                  fields: {
                    service_id: { type: 'integer' },
                  },
                },
              },
              on: {
                type: {
                  type: 'hash',
                  fields: {
                    on: { type: 'boolean' },
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
                  fields: {
                    action: { type: 'string' },
                    brightness_delta: { type: 'number' },
                  },
                },
              },
              color_temperature: {
                type: {
                  type: 'hash',
                  fields: {
                    mirek: { type: 'integer' },
                    mirek_valid: { type: 'boolean' },
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
                  fields: {
                    action: { type: 'string' },
                    mirek_delta: { type: 'integer' },
                  },
                },
              },
              color: {
                type: {
                  type: 'hash',
                  fields: {
                    xy: {
                      type: {
                        type: 'hash',
                        fields: {
                          x: { type: 'number' },
                          y: { type: 'number' },
                        },
                      },
                    },
                    gamut: {
                      type: {
                        type: 'hash',
                        fields: {
                          red: {
                            type: {
                              type: 'hash',
                              fields: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                              },
                            },
                          },
                          green: {
                            type: {
                              type: 'hash',
                              fields: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                              },
                            },
                          },
                          blue: {
                            type: {
                              type: 'hash',
                              fields: {
                                x: { type: 'number' },
                                y: { type: 'number' },
                              },
                            },
                          },
                        },
                      },
                    },
                    gamut_type: { type: 'string' },
                  },
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
                    speed_valid: { type: 'boolean' },
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
                    status: {
                      type: {
                        type: 'hash',
                        fields: {
                          signal: { type: 'string' },
                          estimated_end: { type: 'string' },
                          colors: {
                            type: {
                              type: 'list',
                              element_type: {
                                type: 'hash',
                                fields: {
                                  xy: {
                                    type: {
                                      type: 'hash',
                                      fields: {
                                        x: { type: 'number' },
                                        y: { type: 'number' },
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
                  },
                },
              },
              mode: { type: 'string' },
              gradient: {
                type: {
                  type: 'hash',
                  fields: {
                    points: {
                      type: {
                        type: 'list',
                        element_type: {
                          type: 'hash',
                          fields: {
                            color: {
                              type: {
                                type: 'hash',
                                fields: {
                                  xy: {
                                    type: {
                                      type: 'hash',
                                      fields: {
                                        x: { type: 'number' },
                                        y: { type: 'number' },
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
                    mode: { type: 'string' },
                    points_capable: { type: 'integer' },
                    mode_values: {
                      type: {
                        type: 'list',
                        element_type: 'string',
                      },
                    },
                    pixel_count: { type: 'integer' },
                  },
                },
              },
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
                          parameters: {
                            type: {
                              type: 'hash',
                              fields: {
                                color: {
                                  type: {
                                    type: 'hash',
                                    fields: {
                                      xy: {
                                        type: {
                                          type: 'hash',
                                          fields: {
                                            x: { type: 'number' },
                                            y: { type: 'number' },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                                color_temperature: {
                                  type: {
                                    type: 'hash',
                                    fields: {
                                      mirek: { type: 'integer' },
                                      mirek_valid: { type: 'boolean' },
                                    },
                                  },
                                },
                                speed: { type: 'number' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              timed_effects: {
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
              powerup: {
                type: {
                  type: 'hash',
                  fields: {
                    preset: { type: 'string' },
                    configured: { type: 'boolean' },
                    on: {
                      type: {
                        type: 'hash',
                        fields: {
                          mode: { type: 'string' },
                          on: {
                            type: {
                              type: 'hash',
                              fields: {
                                on: { type: 'boolean' },
                              },
                            },
                          },
                        },
                      },
                    },
                    dimming: {
                      type: {
                        type: 'hash',
                        fields: {
                          mode: { type: 'string' },
                          dimming: {
                            type: {
                              type: 'hash',
                              fields: {
                                brightness: { type: 'number' },
                              },
                            },
                          },
                        },
                      },
                    },
                    color: {
                      type: {
                        type: 'hash',
                        fields: {
                          mode: { type: 'string' },
                          color_temperature: {
                            type: {
                              type: 'hash',
                              fields: {
                                mirek: { type: 'integer' },
                              },
                            },
                          },
                          color: {
                            type: {
                              type: 'hash',
                              fields: {
                                xy: {
                                  type: {
                                    type: 'hash',
                                    fields: {
                                      x: { type: 'number' },
                                      y: { type: 'number' },
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
                },
              },
              content_configuration: {
                type: {
                  type: 'hash',
                  fields: {
                    orientation: {
                      type: {
                        type: 'hash',
                        fields: {
                          status: { type: 'string' },
                          configurable: { type: 'boolean' },
                          orientation: { type: 'string' },
                        },
                      },
                    },
                    order: {
                      type: {
                        type: 'hash',
                        fields: {
                          status: { type: 'string' },
                          configurable: { type: 'boolean' },
                          order: { type: 'string' },
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
    },
  },
});

export default ListDevices;
