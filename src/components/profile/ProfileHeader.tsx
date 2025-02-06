"use client";

import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";
import { updateUserProfile } from "@/lib/firebase/firebaseUtils";
import type { UserProfile } from "@/lib/types";
import { Edit2 } from "lucide-react";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [website, setWebsite] = useState(profile.website || "");
  
  const isOwnProfile = user?.uid === profile.uid;

  const handleSave = async () => {
    if (!user) return;
    
    try {
      await updateUserProfile(user.uid, {
        ...profile,
        bio,
        location,
        website,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="bg-white p-4 shadow">
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
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2 mt-2">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Add your bio"
                className="w-full p-2 border rounded"
                rows={3}
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full p-2 border rounded"
              />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Profile
              </button>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {bio && <p className="text-gray-600">{bio}</p>}
              {location && (
                <p className="text-gray-500 text-sm">
                  📍 {location}
                </p>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  🔗 {website}
                </a>
              )}
            </div>
          )}
          
          <div className="flex gap-4 mt-4">
            <div>
              <span className="font-bold">{profile.followers.length}</span>{" "}
              <span className="text-gray-500">followers</span>
            </div>
            <div>
              <span className="font-bold">{profile.following.length}</span>{" "}
              <span className="text-gray-500">following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 