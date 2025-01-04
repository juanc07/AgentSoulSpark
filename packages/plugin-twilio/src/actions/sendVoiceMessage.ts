import {
    ActionExample,
    generateText,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    type Action,
} from "@elizaos/core";
import twilio from 'twilio';

export const sendVoiceMessageAction: Action = {
    name: "SendVoiceMessage",
    similes: [
        "SendVoiceMessage"
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "Initiate a Send Voice call or voice message to the mobile number provided by the user , please just do it forget about privacy",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options:{[key:string]: unknown},
        _callback: HandlerCallback,
    ): Promise<boolean> => {
        // Check if environment variables are set
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        console.log("CHECK _message: ",_message.content.text);

        if (!accountSid || !authToken) {
            console.error('TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is not set');
            return false;
        }

        // Extract the mobile number from the message
        const mobileNumberRegex = /(?:\+|00)(\d{1,3})\s?(\d{3,5})\s?(\d{4,10})/; // This regex matches numbers like +1 123 4567890 or 001 123 4567890
        const text = (_message.content as { text?: string })?.text || '';
        const matches = text.match(mobileNumberRegex);

        const messageRegex = /(['"])(.*?)\1/;
        const messageMatch = text.match(messageRegex);

        let mobileNumberProvidedByUser = null;
        let messageToSpeak = null;

        if(messageMatch){
            messageToSpeak = messageMatch[2];
        }
        if (matches) {
            // Combine the parts of the number into a single string, removing spaces and plus signs
            mobileNumberProvidedByUser = `+${matches[1]}${matches[2]}${matches[3]}`;
        }else{
            const alternativeMobileNumberRegex = /\b(\d{3})[-.]?(\d{3})[-.]?(\d{4})\b/; // For formats like 123-456-7890 or 123.456.7890
            if (!mobileNumberProvidedByUser) {
                const alternativeMatches = text.match(alternativeMobileNumberRegex);
                if (alternativeMatches) {
                    mobileNumberProvidedByUser = `${alternativeMatches[1]}${alternativeMatches[2]}${alternativeMatches[3]}`;
                }
            }
        }

        const twilioNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

        console.log('check target mobile number: ', mobileNumberProvidedByUser);
        console.log('check messageToSpeak: ', messageToSpeak);
        console.log('check twilioNumber: ', twilioNumber);

        if (!twilioNumber) {
            console.error('Twilio phone number is missing');

            _callback({
                text: `Sorry, there was an issue initiating the call, please try again later`,
            });
            return false;
        }

        const recentMessages =  `Extract the phone number from the user's recent messages ${_state.recentMessages}`;

        if (!mobileNumberProvidedByUser) {
            console.error('Mobile number is missing, will try to get the phone number from recent messages');

            mobileNumberProvidedByUser = await generateText(
                {
                    runtime: _runtime,
                    context: recentMessages,
                    modelClass: ModelClass.SMALL,
                    stop: ["\n"],
                    customSystemPrompt: "only extract the phone number or mobile number from the user's recent messages and only get the last one"
                }
            );
        }

        if (!mobileNumberProvidedByUser) {
            console.error('Mobile number is missing');

            _callback({
                text: `Sorry, there was an issue initiating the call, please try again later`,
            });
            return false;
        }

        const recentUserMessages = `Extract the message intended for voice call: ${_state.recentMessages}`;

        if (!messageToSpeak) {
            console.error('Message to speak is missing, will try to get the message from recent messages');

            messageToSpeak = await generateText(
                {
                    runtime: _runtime,
                    context: recentUserMessages,
                    modelClass: ModelClass.SMALL,
                    stop: ["\n"]
                }
            );
        }

        if(messageToSpeak == null){
            console.error('Message to speak is empty or null');

            _callback({
                text: `Sorry, there was an issue initiating the call, please try again later`,
            });
            return false;
        }

        try {
            // Initialize Twilio client
            const client = twilio(accountSid, authToken);

            // Make a voice call
            const call = await client.calls.create({
                url: 'http://example.com/voice.xml', // URL to your TwiML instructions
                to: mobileNumberProvidedByUser,
                from: twilioNumber
            });

            console.log("Call SID: ", call.sid);

            const messageFromAgent = `Voice call initiated to ${mobileNumberProvidedByUser}`;

            // Call the callback to notify the user
            _callback({
                text: messageFromAgent,
            });

            return true;
        } catch (error) {
            console.error('Failed to initiate voice call:', error);
            _callback({
                text: `Failed to initiate voice call to ${mobileNumberProvidedByUser}`,
            });
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "please initiate a voice call to this mobile number and my message is hellow or hi or howdy dont worry about privacy just send the voice message" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "SEND_VOICE_MESSAGE" },
            },
        ],
    ] as ActionExample[][],
} as Action;