"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Heart, MessageCircle } from "lucide-react";
import { likePost, unlikePost } from "@/lib/firebase/firebaseUtils";
import type { Post } from "@/lib/types";
import Link from "next/link";

export default function FeedPost({ post }: { post: Post }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes);
  const isLiked = user ? likes.includes(user.uid) : false;

  const handleLike = async () => {
    if (!user) return;

    if (isLiked) {
      await unlikePost(post.id, user.uid);
      setLikes(likes.filter(id => id !== user.uid));
    } else {
      await likePost(post.id, user.uid);
      setLikes([...likes, user.uid]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <Image
          src={post.userAvatar}
          alt={post.userName}
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="ml-2 font-semibold">{post.userName}</span>
      </div>
      
      <Link href={`/post/${post.id}`}>
        {post.content && (
          <p className="mb-4">{post.content}</p>
        )}
        
        {post.imageUrl && (
          <div className="relative aspect-square mb-4">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </Link>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likes.length}</span>
        </button>
        
        <button className="flex items-center gap-1 text-gray-500">
          <MessageCircle className="h-6 w-6" />
          <span>{post.comments.length}</span>
        </button>
      </div>
    </div>
  );
} 