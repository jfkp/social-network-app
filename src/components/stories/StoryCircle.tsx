"use client";

import Image from "next/image";
import { useState } from "react";
import StoryViewer from "./StoryViewer";
import type { Story } from "@/lib/types";

export default function StoryCircle({ story }: { story: Story }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsViewerOpen(true)}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full ring-2 ring-blue-500 p-1">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={story.userAvatar}
              alt={story.userName}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <span className="text-xs mt-1 truncate w-16">{story.userName}</span>
      </button>

      {isViewerOpen && (
        <StoryViewer story={story} onClose={() => setIsViewerOpen(false)} />
      )}
    </>
  );
} 