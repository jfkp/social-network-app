"use client";

import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
import type { UserProfile } from "@/lib/types";

export default function UserCard({ user }: { user: UserProfile }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
      <Link href={`/profile/${user.uid}`} className="flex items-center gap-3">
        <Image
          src={user.photoURL}
          alt={user.displayName}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold">{user.displayName}</h3>
          {user.bio && (
            <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
          )}
        </div>
      </Link>
      <FollowButton userId={user.uid} />
    </div>
  );
} 