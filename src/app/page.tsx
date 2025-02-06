import { getFeedPosts } from "@/lib/firebase/firebaseUtils";
import FeedPost from "@/components/FeedPost";
import SignIn from "@/components/auth/SignIn";
import { auth } from "@/lib/firebase/firebase";
import { cookies } from "next/headers";
import StoriesBar from "@/components/stories/StoriesBar";

export default async function Home() {
  const session = cookies().get('session');
  
  if (!session) {
    return <SignIn />;
  }

  const posts = await getFeedPosts();

  return (
    <main>
      <StoriesBar />
      <div className="space-y-4 p-4">
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No posts yet. Be the first to post!
          </p>
        )}
      </div>
    </main>
  );
}
