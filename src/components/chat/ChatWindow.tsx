"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useChat } from '@/lib/contexts/ChatContext';
import { sendMessage, onChatMessages } from '@/lib/firebase/firebaseUtils';
import { Message } from '@/lib/types';
import Image from 'next/image';
import { Send } from 'lucide-react';

export default function ChatWindow() {
  const { user } = useAuth();
  const { activeChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeChat) return;

    const unsubscribe = onChatMessages(activeChat.id, setMessages);
    return () => unsubscribe();
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChat || !newMessage.trim()) return;

    try {
      await sendMessage({
        chatId: activeChat.id,
        content: newMessage.trim(),
        senderId: user.uid,
        createdAt: Date.now(),
        read: false,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  const otherUser = activeChat.participants.find(p => p.uid !== user?.uid);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-3">
        <Image
          src={otherUser?.photoURL || ''}
          alt={otherUser?.displayName || ''}
          width={40}
          height={40}
          className="rounded-full"
        />
        <h2 className="font-semibold">{otherUser?.displayName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === user?.uid
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 