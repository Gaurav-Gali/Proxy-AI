"use client";

import React, { useState } from "react";
import {ArrowUp} from "lucide-react";
import {useAtom} from "jotai";
import {ChatStore} from "@/Store/ChatsStore";
import {ActiveChatAtom} from "@/Store/ChatBannerStore";
import {json} from "node:stream/consumers";
import {runningAtom} from "@/Store/RunningAtom";

const ChatInput: React.FC = () => {
    const [message, setMessage] = useState("");

    const [chats, setChats] = useAtom(ChatStore);
    const [activeChat] = useAtom<number>(ActiveChatAtom);

    const [running,setRunning] = useAtom(runningAtom);

    async function getAIResponse(prompt: string) {
        const res = await fetch("/api/ollama", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        return data?.completion || ""; // Adjust depending on the API response structure
    }

    const handleSend = async () => {
        if (message.trim() === "" || !activeChat) return;

        setRunning(true);
        const res = await fetch("/api/ollama", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: message }),
        });
        const data = await res.json();
        const aiText = data?.choices?.[0]?.text || "AI did not respond";

        const newMessage = {
            user: message,
            ai: aiText,
        };

        setChats((prevChats) => {
            const chatExists = prevChats.some((chat) => chat.id === activeChat);
            let updatedChats;

            if (chatExists) {
                // Append to existing chat group
                updatedChats = prevChats.map((chat) =>
                    chat.id === activeChat
                        ? { ...chat, messages: [...chat.messages, newMessage] }
                        : chat
                );
            } else {
                // Create new chat group
                updatedChats = [...prevChats, { id: activeChat, messages: [newMessage] }];
            }

            // Store updated chats in localStorage
            localStorage.setItem("AllChats", JSON.stringify(updatedChats));

            return updatedChats;
        });
        setRunning(false);

        setMessage("");
    };




    return (
        <div className="flex items-center gap-2 p-4 bg-transparent backdrop-blur-2xl">
            {/* Text input */}
            <input
                type="text"
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400 px-4 py-2 focus:outline-0 rounded-lg border border-zinc-800 transition-all duration-200"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            {/* Send button */}
            <button
                onClick={handleSend}
                className="p-2 rounded-lg cursor-pointer bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-100 transition-colors duration-200 transform hover:scale-105 flex items-center justify-center"
            >
                {running ? (
                    <span className="w-5 h-5 border-2 border-t-zinc-100 border-b-zinc-100 border-l-transparent border-r-transparent rounded-full animate-spin"></span>
                ) : (
                    <ArrowUp className="w-6 h-6" />
                )}
            </button>

        </div>
    );
};

export default ChatInput;