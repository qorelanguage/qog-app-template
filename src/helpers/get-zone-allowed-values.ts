import {
  IQoreAllowedValue,
  TCustomConnOptions,
  TQoreGetAllowedValuesFunction,
} from '@qoretechnologies/ts-toolkit';
import { OpenHueError } from '../constants';
import { fetchOpenHueAllowedValues, getQoreContextRequiredValues } from './constants';

type TOpenHueZone = {
  id: string;
  metadata: {
    name: string;
    archetype: string;
  };
  children: Array<{
    rid: string;
    rtype: string;
  }>;
};

const mapOpenHueZoneToAllowedValue = (item: TOpenHueZone): IQoreAllowedValue<string> => {
  const deviceCount = item.children.length;
  return {
    value: item.id,
    display_name: item.metadata.name || item.id,
    short_desc: `Type: ${item.metadata.archetype}, Devices: ${deviceCount}`,
  };
};

export const getOpenHueZoneAllowedValues: TQoreGetAllowedValuesFunction<
  TCustomConnOptions,
  string
> = async (context) => {
  const { token, username } = getQoreContextRequiredValues({
    context,
    connectionFields: ['token', 'username'],
    ErrorClass: OpenHueError,
  });

  return await fetchOpenHueAllowedValues<TOpenHueZone>({
    token,
    username,
    path: `resource/zone`,
    object: 'data',
    mapItemToAllowedValue: mapOpenHueZoneToAllowedValue,
  });
};
