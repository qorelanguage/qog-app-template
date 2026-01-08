import { QoreAppCreator, QorusRequest } from '@qoretechnologies/ts-toolkit';
import {
  OPENHUE_APP_LOGO,
  OPENHUE_APP_NAME,
  OPENHUE_CONN_OPTIONS,
  OPENHUE_ENDPOINT_CONFIG,
  OpenHueError,
} from './constants';
import { getQoreContextRequiredValues } from './helpers/constants';

import * as actions from './actions';

const hueActions = Object.values(actions);

const CustomApp = QoreAppCreator.createApp({
  name: OPENHUE_APP_NAME,
  logo: OPENHUE_APP_LOGO,
  logo_file_name: 'openhue.svg',
  logo_mime_type: 'image/svg+xml',
  display_name: 'Philips Hue',
  desc: 'Philips Hue',
  short_desc: 'Philips Hue',
  rest: {
    data: 'json',
    oauth2_token_use_basic_auth: true,
    oauth2_redirect_url: 'cloud',
    oauth2_auth_url: 'https://api.meethue.com/v2/oauth2/authorize',
    oauth2_grant_type: 'authorization_code',
    oauth2_token_url: 'https://api.meethue.com/v2/oauth2/token',
    url: 'https://api.meethue.com',
    ping_path: '/route/clip/v2/resource/device',
    ping_headers: {
      nickname: '{{nickname}}',
    },
  },
  rest_modifiers: {
    options: OPENHUE_CONN_OPTIONS,
    messages: [
      {
        content:
          'Before creating the connection, please make sure you have pressed the link button on your Hue Bridge.',
        intent: 'info',
        title: '',
      },
    ],
    url_template_options: ['nickname'],
    set_options_post_auth: async (context) => {
      const { token } = getQoreContextRequiredValues({
        context,
        connectionFields: ['token'],
        ErrorClass: OpenHueError,
      });

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await QorusRequest.put(
        {
          path: '/route/api/0/config',
          headers,
          data: {
            linkbutton: true,
          },
        },
        OPENHUE_ENDPOINT_CONFIG
      );

      const nicknameResponse = await QorusRequest.post<{
        data: {
          success: {
            nickname: string;
          };
        };
      }>(
        {
          path: '/route/api',
          headers,
          data: {
            devicetype: 'qorushue',
          },
        },
        OPENHUE_ENDPOINT_CONFIG
      );

      const nickname = nicknameResponse?.data.success.nickname;

      return {
        nickname,
      };
    },
  },
  actions: hueActions,
});

export default CustomApp;
