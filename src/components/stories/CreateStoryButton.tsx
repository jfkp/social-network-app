"use client";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Plus } from "lucide-react";
import { createStory } from "@/lib/firebase/firebaseUtils";

export default function CreateStoryButton() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      await createStory({
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userAvatar: user.photoURL || 'https://placehold.co/40',
        type,
        file,
      });
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        <Plus className="h-6 w-6 text-gray-600" />
      </label>
      <span className="text-xs mt-1">Your story</span>
    </div>
  );
} 