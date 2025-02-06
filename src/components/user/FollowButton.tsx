"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { followUser, unfollowUser, getUserProfile } from "@/lib/firebase/firebaseUtils";
import { useRouter } from "next/navigation";

export default function FollowButton({ userId }: { userId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) return;
      
      try {
        const profile = await getUserProfile(userId);
        if (profile) {
          setIsFollowing(profile.followers.includes(user.uid));
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [userId, user]);

  const handleFollow = async () => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId, user.uid);
        setIsFollowing(false);
      } else {
        await followUser(userId, user.uid);
        setIsFollowing(true);
      }
      router.refresh();
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.uid === userId || isLoading) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full text-sm font-semibold ${
        isFollowing
          ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } transition-colors`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
} 