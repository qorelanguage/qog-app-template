import { IQoreAllowedValue, QorusRequest } from '@qoretechnologies/ts-toolkit';
import { get } from 'lodash';
import { OPENHUE_ENDPOINT_CONFIG } from '../constants';

type TOptions = Record<string, any>;
export type TQoreAppActionFunctionContext<
  TConn extends Record<string, any> = Record<string, any>,
  TOpts extends TOptions = TOptions
> = {
  opts?: TOpts;
  conn_opts?: TConn;
};
type ErrorConstructor = new (message: string) => Error;

export const getQoreContextRequiredValues = <
  ReturnTypeOverride extends Record<string, any> | undefined = undefined,
  TConn extends Record<string, any> = Record<string, any>,
  TOpts extends TOptions = TOptions,
  OptKeys extends keyof TOpts = keyof TOpts,
  ConnKeys extends keyof TConn = keyof TConn
>(options: {
  context: TQoreAppActionFunctionContext<TConn, TOpts> | undefined;
  optionFields?: readonly OptKeys[];
  connectionFields?: readonly ConnKeys[];
  ErrorClass?: ErrorConstructor;
}): ReturnTypeOverride extends undefined
  ? { [K in OptKeys | ConnKeys]: any }
  : ReturnTypeOverride => {
  const {
    context,
    optionFields = [] as readonly OptKeys[],
    connectionFields = [] as readonly ConnKeys[],
    ErrorClass = Error,
  } = options;

  if (!context) throw new ErrorClass('No context provided');

  const missingOptions: OptKeys[] = [];
  const missingConnections: ConnKeys[] = [];
  const result = {} as ReturnTypeOverride extends undefined
    ? { [K in OptKeys | ConnKeys]: any }
    : ReturnTypeOverride;
  if (optionFields.length === 0 && connectionFields.length === 0) {
    return result;
  }
  optionFields.forEach((field) => {
    const value = context?.opts?.[field];
    if (value === undefined || value === null || value === '') {
      missingOptions.push(field);
    } else {
      (result as any)[field] = value;
    }
  });
  connectionFields.forEach((field) => {
    const value = context?.conn_opts?.[field];
    if (value === undefined || value === null || value === '') {
      missingConnections.push(field);
    } else {
      (result as any)[field] = value;
    }
  });
  const missingFields = [...missingOptions, ...missingConnections];
  if (missingFields.length > 0) {
    throw new ErrorClass(
      `Missing required values:\n` +
        (missingOptions.length ? `Options: ${missingOptions.join(', ')}\n` : '') +
        (missingConnections.length ? `Connection options: ${missingConnections.join(', ')}` : '')
    );
  }

  return result;
};

export const OPENHUE_ALLOWED_VALUES_TIMEOUT = 60_000;
export const OPENHUE_ALLOWED_VALUES_FETCH_DELAY = 300;

type QorusResponse<T> = {
  data: T;
};

type TOpenHueRequestOptions = {
  token: string;
  username: string;
  path: string;
  object?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, string>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
};

type TPaginatedResponse<ItemType = unknown> = {
  [key: string]: ItemType[] | any;
};

type TOpenHuePaginatedOptions = TOpenHueRequestOptions & {
  limit?: number;
  maxResults?: number;
  fetchDelay?: number;
  timeout?: number;
};

type TOpenHueAllowedValuesOptions<ItemType = unknown> = TOpenHuePaginatedOptions & {
  mapItemToAllowedValue: (item: ItemType) => IQoreAllowedValue<any>;
};

const formatPath = (path: string): string => {
  let clean = path.replace(/^\/+|\/+$/g, '');
  if (!clean.startsWith('route/clip/v2')) {
    clean = `route/clip/v2/${clean}`;
  }

  return `/${clean}`;
};

export const openHueApiClient = async <ResponseType = unknown>(
  options: TOpenHueRequestOptions
): Promise<ResponseType> => {
  const { token, path, object, method = 'GET', body, params, username } = options;

  const formattedPath = formatPath(path);

  try {
    let response: QorusResponse<ResponseType> | undefined;

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        'hue-application-key': username,
        ...(options.headers && { ...options.headers }),
      },
      path: formattedPath,
      ...(params && { params }),
      ...(body && { data: body }),
    };

    switch (method) {
      case 'GET':
        response = await QorusRequest.get<QorusResponse<ResponseType>>(
          requestConfig,
          OPENHUE_ENDPOINT_CONFIG
        );
        break;
      case 'POST':
        response = await QorusRequest.post<QorusResponse<ResponseType>>(
          requestConfig,
          OPENHUE_ENDPOINT_CONFIG
        );
        break;
      case 'PUT':
        response = await QorusRequest.put<QorusResponse<ResponseType>>(
          requestConfig,
          OPENHUE_ENDPOINT_CONFIG
        );
        break;
      case 'DELETE':
        response = await QorusRequest.deleteReq<QorusResponse<ResponseType>>(
          requestConfig,
          OPENHUE_ENDPOINT_CONFIG
        );
        break;
    }

    if (!response?.data) {
      throw new Error(`No data received from OpenHue API for ${path}`);
    }

    if (object) {
      return get(response.data, object) as ResponseType;
    }

    return response.data;
  } catch (error) {
    console.error(
      `Error calling OpenHue API for ${OPENHUE_ENDPOINT_CONFIG.url}${formattedPath}`,
      error
    );
    throw error;
  }
};

export const fetchOpenHuePaginatedRecords = async <
  ResponseType extends TPaginatedResponse<ItemType> = TPaginatedResponse,
  ItemType = unknown
>(
  options: TOpenHuePaginatedOptions
): Promise<ItemType[]> => {
  const { token, object = 'data', method = 'GET', body, username, path } = options;

  const items: ItemType[] = [];

  try {
    const response = await openHueApiClient<ResponseType>({
      token,
      path,
      method,
      username,
      params: {
        ...options.params,
      },
      body,
    });

    const objectData = get(response, object) as ItemType[] | undefined;

    if (!objectData) {
      throw new Error(`No data found for object path "${object}"`);
    }

    items.push(...objectData);
  } catch (error) {
    console.error(`Error fetching paginated PayPal records for ${object}`, error);

    return items;
  }

  return items;
};

export const fetchOpenHueAllowedValues = async <ItemType = unknown>(
  options: TOpenHueAllowedValuesOptions<ItemType>
): Promise<IQoreAllowedValue<any>[]> => {
  const items = await fetchOpenHuePaginatedRecords<TPaginatedResponse<ItemType>, ItemType>(options);

  return items.map(options.mapItemToAllowedValue);
};
