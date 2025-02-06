"use client";

import Image from "next/image";
import { useAuth } from "@/lib/contexts/AuthContext";
import FollowButton from "@/components/user/FollowButton";
import type { UserProfile } from "@/lib/types";

export default function ProfileHeader({ profile }: { profile: UserProfile }) {
  const { user } = useAuth();

  return (
    <div className="bg-white p-4 border-b">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-4">
          <Image
            src={profile.photoURL}
            alt={profile.displayName}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              {user?.uid !== profile.uid && (
                <FollowButton userId={profile.uid} />
              )}
            </div>
            {profile.bio && (
              <p className="mt-2 text-gray-600">{profile.bio}</p>
            )}
            <div className="flex gap-4 mt-4">
              <div>
                <span className="font-semibold">{profile.followers.length}</span>
                <span className="text-gray-500 ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold">{profile.following.length}</span>
                <span className="text-gray-500 ml-1">following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 