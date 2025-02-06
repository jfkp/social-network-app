"use client";

import { useChat } from '@/lib/contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function ChatList() {
  const { chats, setActiveChat, activeChat } = useChat();
  const { user } = useAuth();

  return (
    <div className="w-full border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-10rem)]">
        {chats.map((chat) => {
          const otherUser = chat.participants.find(p => p.uid !== user?.uid);
          if (!otherUser) return null;

          return (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 ${
                activeChat?.id === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <Image
                src={otherUser.photoURL}
                alt={otherUser.displayName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium truncate">{otherUser.displayName}</p>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(chat.lastMessage.createdAt, { addSuffix: true })}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 