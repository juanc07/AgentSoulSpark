import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@elizaos/core";

export const helloWorldAction: Action = {
    name: "HelloWorld",
    similes: [
        "HELLO"
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "send hellow world to user",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options:{[key:string]: unknown},
        _callback: HandlerCallback,
    ): Promise<boolean> => {

        // you can call api here to do some stuff

        const helloWorld = "hello world from agent action!";

        // test modifying state
        const newState = await _runtime.updateRecentMessageState(
            {
                ..._state,
                helloWorld,
            }
        );

        _callback(
            {
                text: helloWorld,
            }
        );

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "please say hello world" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],
    ] as ActionExample[][],
} as Action;
