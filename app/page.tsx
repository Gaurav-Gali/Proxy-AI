"use client";

import React, { useEffect } from "react";
import ChatInput from "@/components/ChatInput";
import ChatUI from "@/components/ChatUI";
import { useAtom } from "jotai";
import { ChatStore } from "@/Store/ChatsStore";
import { ActiveChatAtom } from "@/Store/ChatBannerStore";

const Page: React.FC = () => {
    const [chats, setChats] = useAtom(ChatStore);
    const [activeChat] = useAtom<number>(ActiveChatAtom);


    useEffect(() => {
        const savedChats = localStorage.getItem("AllChats");
        if (savedChats) {
            try {
                const parsedChats = JSON.parse(savedChats);

                if (Array.isArray(parsedChats) && parsedChats.length > 0) {
                    setChats(parsedChats);
                } else {
                    // Empty array -> remove from localStorage
                    localStorage.removeItem("AllChats");
                }
            } catch (error) {
                console.error("Failed to parse saved chats from localStorage:", error);
                localStorage.removeItem("AllChats"); // clear invalid data
            }
        }
    }, [setChats]);

    const activeChatGroup = chats.find((chat) => chat.id === activeChat);
    const activeMessages = activeChatGroup?.messages || [];

    return (
        <div className="flex flex-col bg-zinc-950 h-screen">
            <div className="flex-1 overflow-y-auto">
                <ChatUI chats={activeMessages} />
            </div>
            <ChatInput />
        </div>
    );
};

export default Page;
