import { Plugin } from "@elizaos/core";
import { helloWorldAction } from "./actions/helloWorld.ts";
import { sendSmsAction } from "./actions/sendSms.ts";
export * as actions from "./actions";

export const twilioPlugin: Plugin = {
    name: "twilio",
    description: "twilio basic send sms action implementation",
    actions: [
        helloWorldAction,
        sendSmsAction,
    ]
};
