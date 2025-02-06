import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { Comment } from "@/lib/types";

export default function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <Image
        src={comment.userAvatar}
        alt={comment.userName}
        width={32}
        height={32}
        className="rounded-full"
      />
      <div>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="font-semibold text-sm">{comment.userName}</p>
          <p className="text-gray-700">{comment.content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
} 