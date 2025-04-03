import {
  EQoreAppActionCode,
  QoreAppCreator,
  TQoreAppActionWithEventOrWebhookEventInfo,
  TQoreOptions,
} from '@qoretechnologies/ts-toolkit';

const CustomEventFunctionTriggerOptions = {
  message: {
    type: 'string',
    required: true,
    desc: 'Message to be displayed',
    short_desc: 'Message to be displayed',
    display_name: 'Test Message',
  },
} satisfies TQoreOptions;

const CustomEventFunctionTriggerInfo = {
  desc: 'This is a custom event function trigger returned data description',
  type: {
    type: 'hash',
    fields: {
      example: {
        type: 'softstring',
        desc: 'Example of a returned data field',
      },
      message: {
        type: 'string',
        desc: 'Message to be displayed',
      },
    },
  },
} satisfies TQoreAppActionWithEventOrWebhookEventInfo;

export const CustomEventFunctionTrigger = QoreAppCreator.createTrigger({
  action: 'custom-event-function-trigger',
  display_name: 'Custom Event Function Trigger',
  desc: 'This is a custom event function trigger',
  short_desc: 'Custom Event Function Trigger',
  action_code: EQoreAppActionCode.EVENT,
  app: 'Custom-app',
  event_function: (context, update, should_stop) => {
    const message = context.opts?.message;

    while (!should_stop()) {
      update({
        message: message,
        example: 'Example of a returned data field',
      });
    }
  },
  get_example_event_data: (context) => {
    const message = context.opts?.message;

    return {
      message: message,
      example: 'Example of a returned data field',
    };
  },
  options: CustomEventFunctionTriggerOptions,
  event_info: CustomEventFunctionTriggerInfo,
});
