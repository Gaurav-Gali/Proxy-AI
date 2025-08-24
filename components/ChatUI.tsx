"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type ChatMessage = {
    user: string;
    ai: string;
    timestamp?: string;
};

interface ChatUiProps {
    chats: ChatMessage[];
}

const TypewriterAI: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[index]);
                setIndex(index + 1);
            }, 1); // typewriter speed
            return () => clearTimeout(timeout);
        }
    }, [index, text]);

    return (
        <span className="relative">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
            {/* Glitter effect */}
            {index < text.length && (
                <span className="absolute top-0 left-full w-1 h-1 bg-yellow-400 rounded-full animate-ping"></span>
            )}
    </span>
    );
};

const ChatUI: React.FC<ChatUiProps> = ({ chats }) => {
    return (
        <div className="flex flex-col h-full w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 rounded-xl p-6 overflow-y-auto space-y-3 shadow-2xl">
            {chats.map((chat, idx) => (
                <div key={idx} className="flex flex-col space-y-1">
                    {/* User message */}
                    <div className="flex justify-end">
                        <div className="bg-zinc-800 text-zinc-100 px-4 py-2 rounded-xl max-w-[70%] break-words shadow-md hover:shadow-lg transition-shadow duration-200">
                            {chat.user}
                            {chat.timestamp && (
                                <span className="block text-xs text-zinc-400 mt-1">
                  {chat.timestamp}
                </span>
                            )}
                        </div>
                    </div>

                    {/* AI response with typewriter + Markdown */}
                    <div className="flex justify-start">
                        <div className="bg-transparent text-zinc-100 px-4 py-2 rounded-2xl max-w-[70%] break-words shadow-md hover:shadow-lg transition-shadow duration-200">
                            <TypewriterAI text={chat.ai} />
                            {chat.timestamp && (
                                <span className="block text-xs text-zinc-400 mt-1">
                  {chat.timestamp}
                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {chats.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                    <span className="text-lg font-medium">No messages yet</span>
                    <span className="text-sm mt-2">
            Start a conversation to unlock insights!
          </span>
                </div>
            )}
        </div>
    );
};

export default ChatUI;
