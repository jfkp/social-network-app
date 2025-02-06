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
  shares: number;
  savedBy: string[]; // Array of user IDs who saved the post
  hashtags: string[];
  mentions: string[]; // User IDs mentioned in the post
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
  isVerified: boolean;
  verificationDetails?: {
    submittedAt: number;
    status: 'pending' | 'approved' | 'rejected';
    documents: string[]; // URLs to verification documents
  };
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

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  type: 'image' | 'video';
  createdAt: number;
  expiresAt: number;
  views: string[]; // Array of user IDs who viewed the story
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  read: boolean;
  createdAt: number;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: number;
}

export interface PostAnalytics {
  postId: string;
  views: number;
  uniqueViewers: string[]; // User IDs
  likeRate: number;
  commentRate: number;
  shareRate: number;
  engagement: number;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImage?: string;
  posts: string[]; // Array of post IDs
  isPrivate: boolean;
  createdAt: number;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'post' | 'like' | 'comment' | 'follow' | 'share';
  targetId: string; // ID of the post/user/comment involved
  createdAt: number;
}

export interface ScheduledPost {
  id: string;
  userId: string;
  content: string;
  imageFile?: File;
  scheduledFor: number;
  status: 'scheduled' | 'published' | 'failed';
  createdAt: number;
} 