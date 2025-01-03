import { Plugin } from "@elizaos/core";
import { helloWorldAction } from "./actions/helloWorld.ts";
import { sendSmsAction } from "./actions/sendSms.ts";
import { sendWhatsAppMessageAction } from "./actions";
export * as actions from "./actions";

export const twilioPlugin: Plugin = {
    name: "twilio",
    description: "twilio basic send sms action implementation",
    actions: [
        helloWorldAction,
        sendSmsAction,
        sendWhatsAppMessageAction,
    ]
};
