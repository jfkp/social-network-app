import { getUserProfile, getUserPosts } from "@/lib/firebase/firebaseUtils";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FeedPost from "@/components/FeedPost";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const [profile, posts] = await Promise.all([
    getUserProfile(params.userId),
    getUserPosts(params.userId),
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <div>
      <ProfileHeader profile={profile} />
      <div className="space-y-4 p-4">
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-8">No posts yet</p>
        )}
      </div>
    </div>
  );
} 