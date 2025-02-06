import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
  where,
  onSnapshot,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Post, UserProfile, Comment } from "../types";
import { onAuthStateChanged } from "firebase/auth";
import type { Notification } from "@/lib/types";

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // Check if user profile exists, if not create one
    const profile = await getUserProfile(result.user.uid);
    if (!profile) {
      await createUserProfile(result.user);
    }
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Posts
export const createPost = async (post: Omit<Post, 'id' | 'imageUrl'>, imageFile: File | null) => {
  try {
    let imageUrl = "";
    if (imageFile) {
      const path = `posts/${post.userId}/${Date.now()}-${imageFile.name}`;
      imageUrl = await uploadImage(imageFile, path);
    }

    const postRef = await addDoc(collection(db, "posts"), {
      ...post,
      imageUrl,
    });

    return postRef;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getFeedPosts = async () => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};

export const likePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);
  const post = postDoc.data() as Post;
  
  await updateDoc(postRef, {
    likes: arrayUnion(userId)
  });

  // Create notification for post owner
  if (post.userId !== userId) {
    const user = await getAuth().currentUser;
    await createNotification({
      type: 'like',
      fromUserId: userId,
      fromUserName: user?.displayName || 'Anonymous',
      fromUserAvatar: user?.photoURL || 'https://placehold.co/40',
      toUserId: post.userId,
      postId,
      createdAt: Date.now(),
      read: false,
    });
  }
};

export const unlikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  return updateDoc(postRef, {
    likes: arrayRemove(userId)
  });
};

// User Profiles
export const createUserProfile = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const profile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || "Anonymous",
    photoURL: user.photoURL || "https://placehold.co/40",
    followers: [],
    following: [],
    createdAt: Date.now(),
  };

  await setDoc(userRef, profile);
  return profile;
};

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as UserProfile : null;
};

// File Upload
export const uploadImage = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Profile functions
export const updateUserProfile = async (userId: string, profile: UserProfile) => {
  const userRef = doc(db, "users", userId);
  return updateDoc(userRef, profile);
};

export const getUserPosts = async (userId: string) => {
  const q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};

export const followUser = async (userId: string, followerId: string) => {
  const userRef = doc(db, "users", userId);
  const followerRef = doc(db, "users", followerId);
  
  await updateDoc(userRef, {
    followers: arrayUnion(followerId)
  });
  
  await updateDoc(followerRef, {
    following: arrayUnion(userId)
  });
};

export const unfollowUser = async (userId: string, followerId: string) => {
  const userRef = doc(db, "users", userId);
  const followerRef = doc(db, "users", followerId);
  
  await updateDoc(userRef, {
    followers: arrayRemove(followerId)
  });
  
  await updateDoc(followerRef, {
    following: arrayRemove(userId)
  });
};

export const getPost = async (postId: string) => {
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Post : null;
};

export const addComment = async (postId: string, comment: Omit<Comment, 'id'>) => {
  const postRef = doc(db, "posts", postId);
  const commentRef = doc(collection(db, "comments"));
  const commentWithId = { ...comment, id: commentRef.id };
  
  await updateDoc(postRef, {
    comments: arrayUnion(commentWithId)
  });
  
  return commentWithId;
};

export const searchUsers = async (query: string) => {
  // Create a compound query to search by displayName
  const q = query.toLowerCase();
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  
  // Client-side filtering (for demo purposes)
  // In production, you might want to use Algolia or a similar search service
  return snapshot.docs
    .map(doc => ({ ...doc.data() } as UserProfile))
    .filter(user => 
      user.displayName.toLowerCase().includes(q) ||
      (user.bio && user.bio.toLowerCase().includes(q))
    )
    .slice(0, 10); // Limit results
};

// Notification functions
export const createNotification = async (notification: Omit<Notification, 'id'>) => {
  return addDoc(collection(db, "notifications"), notification);
};

export const onNotificationsChange = (userId: string, callback: (notifications: Notification[]) => void) => {
  const q = query(
    collection(db, "notifications"),
    where("toUserId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
    callback(notifications);
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notificationRef = doc(db, "notifications", notificationId);
  return updateDoc(notificationRef, { read: true });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const batch = writeBatch(db);
  const q = query(
    collection(db, "notifications"),
    where("toUserId", "==", userId),
    where("read", "==", false)
  );
  
  const snapshot = await getDocs(q);
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { read: true });
  });
  
  return batch.commit();
};
