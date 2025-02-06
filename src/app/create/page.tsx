"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { createPost, uploadImage } from "@/lib/firebase/firebaseUtils";
import ImageUpload from "@/components/ui/ImageUpload";

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

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageClear = () => {
    setImageFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !imageFile) return;
    
    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const path = `posts/${user.uid}/${Date.now()}-${imageFile.name}`;
        imageUrl = await uploadImage(imageFile, path);
      }

      await createPost({
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userAvatar: user.photoURL || "https://placehold.co/40",
        content,
        imageUrl,
        likes: [],
        comments: [],
        createdAt: Date.now(),
      });

      router.push("/");
      router.refresh();
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
          className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        
        <ImageUpload
          onImageSelect={handleImageSelect}
          onImageClear={handleImageClear}
          previewUrl={previewUrl}
        />

        <button
          type="submit"
          disabled={isSubmitting || (!content && !imageFile)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
} 