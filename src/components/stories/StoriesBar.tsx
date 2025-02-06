"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import StoryCircle from "./StoryCircle";
import CreateStoryButton from "./CreateStoryButton";
import type { Story } from "@/lib/types";
import { getActiveStories } from "@/lib/firebase/firebaseUtils";

export default function StoriesBar() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      if (user) {
        const activeStories = await getActiveStories();
        setStories(activeStories);
      }
    };
    loadStories();
  }, [user]);

  return (
    <div className="bg-white p-4 mb-4 overflow-x-auto">
      <div className="flex gap-4">
        {user && <CreateStoryButton />}
        {stories.map((story) => (
          <StoryCircle key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
} 