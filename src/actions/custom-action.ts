import {
  EQoreAppActionCode,
  QoreAppCreator,
  TQoreOptions,
  TQoreResponseType,
} from '@qoretechnologies/ts-toolkit';

const CustomActionOptions = {
  message: {
    type: 'string',
    required: true,
    desc: 'Message to be displayed',
    short_desc: 'Message to be displayed',
    display_name: 'Test Message',
  },
} satisfies TQoreOptions;

const CustomActionResponse = {
  type: 'hash',
  fields: {
    message: {
      type: 'string',
      required: true,
      display_name: 'Server Response',
      short_desc: 'Response from the server',
      example_value: 'Server response message',
    },
  },
} satisfies TQoreResponseType;

export const CustomAction = QoreAppCreator.createAction({
  action: 'custom-action',
  app: 'Custom-app',
  action_code: EQoreAppActionCode.ACTION,
  display_name: 'Custom App Action',
  options: CustomActionOptions,
  desc: 'This is a custom app action',
  short_desc: 'Custom App Action',
  api_function: (data) => {
    return {
      message: `Server received message: ${data?.message}`,
    };
  },
  response_type: CustomActionResponse,
});
