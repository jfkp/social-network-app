import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy,
  getDocs 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics conditionally to handle heartbeat
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && getAnalytics(app)).catch(() => null);
}

// Create required indexes
async function createRequiredIndexes() {
  try {
    // Posts index for user profile
    const postsRef = collection(db, "posts");
    const postsQuery = query(
      postsRef,
      where("userId", "==", "dummy"),
      orderBy("createdAt", "desc")
    );
    await getDocs(postsQuery);

    // Notifications index
    const notificationsRef = collection(db, "notifications");
    const notificationsQuery = query(
      notificationsRef,
      where("toUserId", "==", "dummy"),
      orderBy("createdAt", "desc")
    );
    await getDocs(notificationsQuery);

    console.log("Indexes creation initiated");
  } catch (error: any) {
    // If error contains a link to create the index, log it
    if (error?.message?.includes("https://console.firebase.google.com")) {
      console.log("Please create the following indexes:");
      console.log(error.message);
    } else {
      console.error("Error creating indexes:", error);
    }
  }
}

// Only run in browser environment
if (typeof window !== 'undefined') {
  createRequiredIndexes();
}

export { app, auth, db, storage };
