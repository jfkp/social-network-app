import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/lib/contexts/NotificationContext";
import type { Notification } from "@/lib/types";

export default function NotificationItem({ notification }: { notification: Notification }) {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationText = () => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      default:
        return '';
    }
  };

  const getNotificationLink = () => {
    if (notification.type === 'follow') {
      return `/profile/${notification.fromUserId}`;
    }
    return `/post/${notification.postId}`;
  };

  return (
    <Link
      href={getNotificationLink()}
      onClick={handleClick}
      className={`block p-4 rounded-lg ${
        notification.read ? 'bg-white' : 'bg-blue-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={notification.fromUserAvatar}
          alt={notification.fromUserName}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-semibold">{notification.fromUserName}</span>{' '}
            {getNotificationText()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  );
} 