export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  createdAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  location?: string;
  website?: string;
  followers: string[];
  following: string[];
  createdAt: number;
}

export type NotificationType = 'like' | 'comment' | 'follow';

export interface Notification {
  id: string;
  type: NotificationType;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  postId?: string;
  createdAt: number;
  read: boolean;
} 