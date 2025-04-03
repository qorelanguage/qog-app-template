import {
  EQoreAppActionCode,
  QoreAppCreator,
  TQoreAppActionWithEventOrWebhookEventInfo,
  TQoreOptions,
} from '@qoretechnologies/ts-toolkit';

const CustomWebhookTriggerOptions = {
  message: {
    type: 'string',
    required: true,
    desc: 'Message to be displayed',
    short_desc: 'Message to be displayed',
    display_name: 'Test Message',
  },
} satisfies TQoreOptions;

const CustomWebhookTriggerInfo = {
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

export const CustomWebhookTrigger = QoreAppCreator.createTrigger({
  action: 'custom-webhook-trigger',
  display_name: 'Custom Webhook Trigger',
  desc: 'This is a custom webhook trigger',
  short_desc: 'Custom Webhook Trigger',
  app: 'Custom-app',
  action_code: EQoreAppActionCode.EVENT,
  webhook_register: async (_context, _url) => {
    const webhook = {
      id: 'example-webhook-id',
    };

    return webhook;
  },
  webhook_deregister: async (_context, _url, regInfo) => {
    const webhookId = regInfo.id;

    console.log(webhookId);
  },
  webhook_method: 'POST',
  options: CustomWebhookTriggerOptions,
  event_info: CustomWebhookTriggerInfo,
});
