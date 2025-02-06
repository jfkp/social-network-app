"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { X } from "lucide-react";
import { viewStory } from "@/lib/firebase/firebaseUtils";
import type { Story } from "@/lib/types";

export default function StoryViewer({ 
  story, 
  onClose 
}: { 
  story: Story; 
  onClose: () => void;
}) {
  const { user } = useAuth();

  useEffect(() => {
    if (user && !story.views.includes(user.uid)) {
      viewStory(story.id, user.uid);
    }
  }, [story, user]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="max-w-lg w-full mx-4">
        {story.type === 'image' ? (
          <img
            src={story.mediaUrl}
            alt=""
            className="w-full rounded-lg"
          />
        ) : (
          <video
            src={story.mediaUrl}
            controls
            autoPlay
            className="w-full rounded-lg"
          />
        )}
      </div>
    </div>
  );
} 