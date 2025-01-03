import {
    ActionExample,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@elizaos/core";

export const rememberAction: Action = {
    name: "Remember",
    similes: [
        "Remember"
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "remember what user has said to you to remember or command you to remember",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options:{[key:string]: unknown},
        _callback: HandlerCallback,
    ): Promise<boolean> => {

        // you can call api here to do some stuff

        const text = (_message.content as { text?: string })?.text || '';
        const agentRememberReply = "Ok, I will remember this";

        const newMemory:Memory={
            userId:_message.userId,
            agentId: _message.agentId,
            roomId: _message.roomId,
            content:{
                text:text,
                action: "REMEMBER",
                source:_message.content?.source
            } as Content
        };

        await _runtime.messageManager.createMemory(newMemory);

        _callback(
            {
                text: agentRememberReply,
            }
        );

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "please remember that or please memorize that or dont forget that" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "REMEMBER" },
            },
        ],
    ] as ActionExample[][],
} as Action;
