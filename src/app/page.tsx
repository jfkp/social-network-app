import FeedPost from "@/components/FeedPost";
import { getFeedPosts } from "@/lib/firebase/firebaseUtils";

export default async function Home() {
  const posts = await getFeedPosts();

  return (
    <div className="space-y-4 p-4">
      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}
    </div>
  );
}
