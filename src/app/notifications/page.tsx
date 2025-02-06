"use client";

import { useNotifications } from "@/lib/contexts/NotificationContext";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function NotificationsPage() {
  const { notifications, markAllAsRead } = useNotifications();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-500 text-sm hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No notifications yet
          </p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
} 