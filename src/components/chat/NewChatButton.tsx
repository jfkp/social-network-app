"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { searchUsers, createChat } from '@/lib/firebase/firebaseUtils';
import { UserProfile } from '@/lib/types';
import Image from 'next/image';
import { Search, X } from 'lucide-react';

export default function NewChatButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results.filter(u => u.uid !== user?.uid));
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const startChat = async (otherUser: UserProfile) => {
    if (!user) return;
    try {
      await createChat([
        user.uid,
        otherUser.uid
      ]);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-2 text-left text-blue-500 hover:bg-blue-50 rounded-lg"
      >
        Start new chat
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">New Chat</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full p-2 pl-8 border rounded-lg"
              />
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isSearching ? (
                <p className="text-center text-gray-500">Searching...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.uid}
                    onClick={() => startChat(result)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <Image
                      src={result.photoURL}
                      alt={result.displayName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium">{result.displayName}</p>
                      {result.bio && (
                        <p className="text-sm text-gray-500 truncate">{result.bio}</p>
                      )}
                    </div>
                  </button>
                ))
              ) : searchQuery ? (
                <p className="text-center text-gray-500">No users found</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 