"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { onNotificationsChange, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/firebase/firebaseUtils";
import type { Notification } from "@/lib/types";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onNotificationsChange(user.uid, (newNotifications) => {
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    // Implementation in firebaseUtils
    await markNotificationAsRead(notificationId);
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = async () => {
    // Implementation in firebaseUtils
    await markAllNotificationsAsRead(user?.uid || '');
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext); 