"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import ImageUpload from "@/components/ui/ImageUpload";
import { createPost } from "@/lib/firebase/firebaseUtils";

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!content.trim() && !imageFile)) return;

    setIsSubmitting(true);
    try {
      const post = {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userAvatar: user.photoURL || "https://placehold.co/40",
        content: content.trim(),
        likes: [],
        comments: [],
        createdAt: Date.now(),
      };

      await createPost(post, imageFile);
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        
        <ImageUpload
          onFileSelect={setImageFile}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />

        <button
          type="submit"
          disabled={isSubmitting || (!content.trim() && !imageFile)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
} 