"use client";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { addComment } from "@/lib/firebase/firebaseUtils";
import CommentItem from "./CommentItem";
import type { Comment } from "@/lib/types";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const comment: Omit<Comment, 'id'> = {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userAvatar: user.photoURL || "https://placehold.co/40",
        content: newComment.trim(),
        createdAt: Date.now(),
      };

      const newCommentWithId = await addComment(postId, comment);
      setComments([...comments, newCommentWithId]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="font-semibold text-lg mb-4">Comments</h2>
      
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
} 