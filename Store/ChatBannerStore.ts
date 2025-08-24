import {atom} from "jotai";
import {ChatBannerType} from "@/Types/ChatBannerType";

export const ChatBannerAtom = atom<ChatBannerType[]>([]);
export const ActiveChatAtom = atom<number>(1);