import { Plugin } from "@elizaos/core";
import { rememberAction } from "./actions";
export * as actions from "./actions";

export const memoryPlugin: Plugin = {
    name: "memory",
    description: "agent memory if you want to command or force agent to memorize or remember something",
    actions: [
        rememberAction,
    ]
};
