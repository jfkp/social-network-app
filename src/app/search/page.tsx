"use client";

import { useState, useEffect } from "react";
import { searchUsers } from "@/lib/firebase/firebaseUtils";
import UserCard from "@/components/user/UserCard";
import { Search } from "lucide-react";
import type { UserProfile } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const results = await searchUsers(query);
          setUsers(results);
        } catch (error) {
          console.error("Error searching users:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <div className="p-4">
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      {isSearching ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard key={user.uid} user={user} />
          ))}
          {query && users.length === 0 && (
            <p className="text-center text-gray-500">No users found</p>
          )}
        </div>
      )}
    </div>
  );
} 