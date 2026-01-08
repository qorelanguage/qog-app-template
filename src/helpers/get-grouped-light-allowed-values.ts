import {
  IQoreAllowedValue,
  TCustomConnOptions,
  TQoreGetAllowedValuesFunction,
} from '@qoretechnologies/ts-toolkit';
import { OpenHueError } from '../constants';
import {
  fetchOpenHueAllowedValues,
  getQoreContextRequiredValues,
  openHueApiClient,
} from './constants';

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

type TOpenHueGroupedLight = {
  id: string;
  owner: {
    rid: string;
    rtype: string;
  };
  on?: {
    on: boolean;
  };
};

const getMapOpenHueGroupedLightToAllowedValueFunction =
  (roomMap: Map<string, string>) =>
  (item: TOpenHueGroupedLight): IQoreAllowedValue<string> => {
    const roomOwner = item.owner.rtype === 'room' ? roomMap.get(item.owner.rid) : undefined;
    const owner = roomOwner || item.owner.rid;

    return {
      value: item.id,
      display_name: `${owner} Group Lights`,
      short_desc: `Owner: ${owner}, Status: ${item.on?.on ? 'On' : 'Off'}`,
    };
  };

export const getOpenHueGroupedLightAllowedValues: TQoreGetAllowedValuesFunction<
  TCustomConnOptions,
  string
> = async (context) => {
  const { token, nickname } = getQoreContextRequiredValues({
    context,
    connectionFields: ['token', 'nickname'],
    ErrorClass: OpenHueError,
  });

  const rooms = await openHueApiClient<TOpenHueRoom[]>({
    nickname,
    token,
    object: 'data',
    path: 'resource/room',
    method: 'GET',
  });

  const roomMap = new Map<string, string>();
  rooms.forEach((room) => {
    roomMap.set(room.id, room.metadata.name || room.id);
  });

  return await fetchOpenHueAllowedValues<TOpenHueGroupedLight>({
    token,
    nickname,
    path: `resource/grouped_light`,
    object: 'data',
    mapItemToAllowedValue: getMapOpenHueGroupedLightToAllowedValueFunction(roomMap),
  });
};
