"use client";

import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import { ChatProvider } from "@/lib/contexts/ChatContext";

export default function MessagesPage() {
  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-80">
          <ChatList />
        </div>
        <ChatWindow />
      </div>
    </ChatProvider>
  );
} 