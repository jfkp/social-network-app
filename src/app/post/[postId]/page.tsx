import { getPost } from "@/lib/firebase/firebaseUtils";
import FeedPost from "@/components/FeedPost";
import CommentSection from "@/components/comments/CommentSection";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { postId: string } }) {
  const post = await getPost(params.postId);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <FeedPost post={post} />
      <CommentSection postId={post.id} initialComments={post.comments} />
    </div>
  );
} 