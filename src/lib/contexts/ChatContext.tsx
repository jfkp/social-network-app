"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { onChatsChange } from '@/lib/firebase/firebaseUtils';
import type { Chat } from '@/lib/types';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType>({
  chats: [],
  activeChat: null,
  setActiveChat: () => {},
  loading: true,
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onChatsChange(user.uid, (newChats) => {
      setChats(newChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <ChatContext.Provider value={{ chats, activeChat, setActiveChat, loading }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext); 