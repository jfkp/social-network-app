import { getUserPosts } from "@/lib/firebase/firebaseUtils";
import FeedPost from "@/components/FeedPost";

export default async function ProfilePosts({ userId }: { userId: string }) {
  const posts = await getUserPosts(userId);

  if (posts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No posts yet
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}
    </div>
  );
} 