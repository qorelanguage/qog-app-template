import {
  IQoreAllowedValue,
  TCustomConnOptions,
  TQoreGetAllowedValuesFunction,
} from '@qoretechnologies/ts-toolkit';
import { OpenHueError } from '../constants';
import { fetchOpenHueAllowedValues, getQoreContextRequiredValues } from './constants';

type TOpenHueRoom = {
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

const mapOpenHueRoomToAllowedValue = (item: TOpenHueRoom): IQoreAllowedValue<string> => {
  const deviceCount = item.children.length;
  return {
    value: item.id,
    display_name: item.metadata.name || item.id,
    short_desc: `Type: ${item.metadata.archetype}, Devices: ${deviceCount}`,
  };
};

export const getOpenHueRoomAllowedValues: TQoreGetAllowedValuesFunction<
  TCustomConnOptions,
  string
> = async (context) => {
  const { token, nickname } = getQoreContextRequiredValues({
    context,
    connectionFields: ['token', 'nickname'],
    ErrorClass: OpenHueError,
  });

  return await fetchOpenHueAllowedValues<TOpenHueRoom>({
    token,
    nickname,
    path: `resource/room`,
    object: 'data',
    mapItemToAllowedValue: mapOpenHueRoomToAllowedValue,
  });
};
