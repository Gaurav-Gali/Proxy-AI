import {atom} from "jotai";

export type Chat = {
    id: number;
    user: string;
    ai: string;
}

type Message = {
    user: string;
    ai: string;
};

type ChatGroup = {
    id: number;
    messages: Message[];
};

export const ChatStore = atom<ChatGroup[]>([
    // {
    //     id: 1,
    //     messages: [
    //         { user: "What is AI?", ai: "AI is a tool that simulates human intelligence." },
    //         { user: "What is hello", ai: "Hello is hello" },
    //     ],
    // },
    // {
    //     id: 2,
    //     messages: [
    //         { user: "Explain machine learning.", ai: "Machine learning is a subset of AI that learns patterns from data." },
    //     ],
    // },
    // {
    //     id: 3,
    //     messages: [
    //         { user: "What is ChatGPT?", ai: "ChatGPT is an AI model developed by OpenAI for conversational tasks." },
    //     ],
    // },
]);