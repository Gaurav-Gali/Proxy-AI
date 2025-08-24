"use client";

import {useEffect, useState} from 'react';
import {Search, Plus, MessageSquare, Zap, Trash2, X, Wand2} from 'lucide-react';

import {useAtom} from "jotai";
import {ChatBannerType} from "@/Types/ChatBannerType";
import {ActiveChatAtom, ChatBannerAtom} from "@/Store/ChatBannerStore";
import {ChatStore} from "@/Store/ChatsStore";

const LeftSideBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [chats, setChats] = useAtom<ChatBannerType[]>(ChatBannerAtom);
    const [activeChat, setActiveChat] = useAtom(ActiveChatAtom);
    const [Chats] = useAtom(ChatStore);

    useEffect(() => {
        const saved = localStorage.getItem("chats");
        setChats(saved ? JSON.parse(saved) : []);
    },[]);



    useEffect(() => {
        localStorage.setItem("chats", JSON.stringify(chats));
        localStorage.setItem("AllChats", JSON.stringify(Chats));
    }, [chats]);

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ProxiIcon = () => (
        <div
            className="flex items-center justify-center w-8 h-8 p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Wand2 className="w-5 h-5 text-white"/>
        </div>
    );

    function handleAddButton() {
        const newChat: ChatBannerType = {
            id: chats.length + 1,
            title: `New Chat`,
        };

        setActiveChat(newChat.id);
        setChats((prevChats) => [...prevChats,newChat]);
    }

    return (
        <div className="flex h-screen w-80 bg-zinc-950 text-zinc-100">
            {/* Sidebar */}
            <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950">
                {/* Header */}
                <div className="p-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-light tracking-wide text-zinc-100">
                            ProxiAI
                        </h1>
                    </div>
                </div>

                {/* Search and New Chat */}
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400"/>
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-zinc-800/30 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <button onClick={() => handleAddButton()}
                                className="flex cursor-pointer items-center justify-center w-10 h-10 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 rounded-lg transition-all duration-200 group">
                            <Plus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-100"/>
                        </button>
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto px-3 pb-4">
                    <div className="flex flex-col-reverse">
                        {filteredChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChat(chat.id)}
                                className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 group flex items-center justify-between ${
                                    activeChat === chat.id
                                        ? "bg-zinc-800/70 border border-zinc-600"
                                        : "hover:bg-zinc-800/30 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <Zap
                                        className={`w-4 h-4 flex-shrink-0 ${
                                            activeChat === chat.id
                                                ? "text-zinc-300"
                                                : "text-zinc-400 group-hover:text-zinc-300"
                                        }`}
                                    />
                                    <input
                                        type="text"
                                        value={chat.title}
                                        onChange={(e) => {
                                            const newTitle = e.target.value;
                                            setChats((prevChats) =>
                                                prevChats.map((c) =>
                                                    c.id === chat.id ? { ...c, title: newTitle } : c
                                                )
                                            );
                                        }}
                                        className={`text-sm truncate bg-transparent border-none focus:outline-none ${
                                            activeChat === chat.id
                                                ? "text-zinc-100 font-medium"
                                                : "text-zinc-300 group-hover:text-zinc-100"
                                        }`}
                                    />
                                </div>

                                {/* Cross icon for delete */}
                                <X
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent triggering setActiveChat
                                        setChats((prevChats) =>
                                            prevChats.filter((c) => c.id !== chat.id)
                                        );
                                        localStorage.setItem("AllChats", JSON.stringify(Chats));
                                    }}
                                    className="w-4 h-4 text-zinc-500 hover:text-red-500 cursor-pointer"
                                />
                            </button>
                        ))}
                    </div>

                    {filteredChats.length === 0 && (
                        <div className="text-center py-12 text-zinc-500">
                            <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">No chats found</p>
                        </div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-950">
                    <button
                        onClick={() => {
                            setChats([]);
                            localStorage.setItem("chats", JSON.stringify(chats));
                            localStorage.setItem("AllChats", JSON.stringify(Chats));
                            setActiveChat(-1);
                        }}
                        className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group">
                        <Trash2 className="w-4 h-4"/>
                        <span className="text-sm">Clear chats</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeftSideBar;