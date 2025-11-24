import {
  IQoreAllowedValue,
  TCustomConnOptions,
  TQoreGetAllowedValuesFunction,
} from '@qoretechnologies/ts-toolkit';
import { OpenHueError } from '../constants';
import { fetchOpenHueAllowedValues, getQoreContextRequiredValues } from './constants';

type TOpenHueItem = {
  id: string;
  product_data: {
    product_name: string;
  };
  metadata: {
    name: string;
    archetype: string;
  };
};

const mapOpenHueItemToAllowedValue = (item: TOpenHueItem): IQoreAllowedValue<string> => {
  return {
    value: item.id,
    display_name: item.metadata.name || item.product_data.product_name || item.id,
    short_desc: `Product Name: ${item.product_data.product_name}, Archetype: ${item.metadata.archetype}`,
  };
};

export const getOpenHueLightAllowedValues: TQoreGetAllowedValuesFunction<
  TCustomConnOptions,
  string
> = async (context) => {
  const { token, username } = getQoreContextRequiredValues({
    context,
    connectionFields: ['token', 'username'],
    ErrorClass: OpenHueError,
  });

  return await fetchOpenHueAllowedValues<TOpenHueItem>({
    token,
    username,
    path: `resource/light`,
    object: 'data',
    mapItemToAllowedValue: mapOpenHueItemToAllowedValue,
  });
};
