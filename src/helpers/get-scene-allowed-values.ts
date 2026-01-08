import {
  IQoreAllowedValue,
  TCustomConnOptions,
  TQoreGetAllowedValuesFunction,
} from '@qoretechnologies/ts-toolkit';
import { OpenHueError } from '../constants';
import { fetchOpenHueAllowedValues, getQoreContextRequiredValues } from './constants';

type TOpenHueScene = {
  id: string;
  metadata: {
    name: string;
  };
  group: {
    rid: string;
    rtype: string;
  };
  status: {
    active: string;
  };
};

const mapOpenHueSceneToAllowedValue = (item: TOpenHueScene): IQoreAllowedValue<string> => {
  return {
    value: item.id,
    display_name: item.metadata.name || item.id,
    short_desc: `Status: ${item.status.active}, Group: ${item.group.rtype}`,
  };
};

export const getOpenHueSceneAllowedValues: TQoreGetAllowedValuesFunction<
  TCustomConnOptions,
  string
> = async (context) => {
  const { token, nickname } = getQoreContextRequiredValues({
    context,
    connectionFields: ['token', 'nickname'],
    ErrorClass: OpenHueError,
  });

  return await fetchOpenHueAllowedValues<TOpenHueScene>({
    token,
    nickname,
    path: `resource/scene`,
    object: 'data',
    mapItemToAllowedValue: mapOpenHueSceneToAllowedValue,
  });
};
