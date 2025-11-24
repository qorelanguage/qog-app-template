import { configDotenv } from 'dotenv';
import { GetLight } from './actions';
import { getOpenHueDeviceAllowedValues } from './helpers/get-device-allowed-values';
import { getOpenHueLightAllowedValues } from './helpers/get-light-allowed-values';
import { getOpenHueGroupedLightAllowedValues } from './helpers/get-grouped-light-allowed-values';
import { getOpenHueRoomAllowedValues } from './helpers/get-room-allowed-values';
import { getOpenHueSceneAllowedValues } from './helpers/get-scene-allowed-values';
import { getOpenHueZoneAllowedValues } from './helpers/get-zone-allowed-values';

configDotenv({ path: '.env' });

const baseContext = {
  connt_opts: {
    token: '',
    username: '',
  },
} as Record<string, any>;

describe('Openhue', () => {
  beforeAll(() => {
    const token = process.env.OPENHUE_TOKEN;
    const username = process.env.OPENHUE_USERNAME;

    if (!token) {
      throw new Error('No OPENHUE_TOKEN provided');
    }

    if (!username) {
      throw new Error('No OPENHUE_USERNAME provided');
    }

    baseContext.conn_opts = {
      token,
      username,
    };
  });

  let lightId: string | undefined;

  describe('Should test allowed values', () => {
    it('Should get lights allowed values', async () => {
      const allowedValues = await getOpenHueLightAllowedValues(baseContext);

      expect(Array.isArray(allowedValues)).toBe(true);
      expect(allowedValues.length).toBeGreaterThan(0);
      expect(allowedValues[0].value).toBeDefined();
      expect(allowedValues[0].display_name).toBeDefined();

      lightId = allowedValues[0].value;
    });

    it('Should get device allowed values', async () => {
      const allowedValues = await getOpenHueDeviceAllowedValues(baseContext);

      expect(Array.isArray(allowedValues)).toBe(true);
      expect(allowedValues.length).toBeGreaterThan(0);
      expect(allowedValues[0].value).toBeDefined();
      expect(allowedValues[0].display_name).toBeDefined();
    });

    it('Should get grouped light allowed values', async () => {
      const allowedValues = await getOpenHueGroupedLightAllowedValues(baseContext);

      expect(Array.isArray(allowedValues)).toBe(true);
      expect(allowedValues.length).toBeGreaterThan(0);
      expect(allowedValues[0].value).toBeDefined();
      expect(allowedValues[0].display_name).toBeDefined();
    });

    it('Should get room allowed values', async () => {
      const allowedValues = await getOpenHueRoomAllowedValues(baseContext);

      expect(Array.isArray(allowedValues)).toBe(true);
      expect(allowedValues.length).toBeGreaterThan(0);
      expect(allowedValues[0].value).toBeDefined();
      expect(allowedValues[0].display_name).toBeDefined();
    });

    it('Should get scene allowed values', async () => {
      const allowedValues = await getOpenHueSceneAllowedValues(baseContext);

      expect(Array.isArray(allowedValues)).toBe(true);
      expect(allowedValues.length).toBeGreaterThan(0);
      expect(allowedValues[0].value).toBeDefined();
      expect(allowedValues[0].display_name).toBeDefined();
    });

    it('Should get zone allowed values', async () => {
      const allowedValues = await getOpenHueZoneAllowedValues(baseContext);

      expect(Array.isArray(allowedValues)).toBe(true);
      expect(allowedValues.length).toBeGreaterThan(0);
      expect(allowedValues[0].value).toBeDefined();
      expect(allowedValues[0].display_name).toBeDefined();
    });
  });

  describe('Should test actions', () => {
    it('Should get a light by id', async () => {
      const action = GetLight;

      if (!('api_function' in action) || !action.api_function) {
        throw new Error('No api_function defined');
      }

      const result = await action.api_function(
        {
          lightId,
        },
        undefined,
        baseContext
      );

      expect(result).toBeDefined();
      expect(result.id).toBe(lightId);
    });
  });
});
