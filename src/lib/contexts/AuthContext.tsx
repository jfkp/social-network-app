"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle, logoutUser, getUserProfile, createUserProfile } from "@/lib/firebase/firebaseUtils";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

// Export the context so it can be imported if needed
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user profile exists
        const profile = await getUserProfile(user.uid);
        if (!profile) {
          await createUserProfile(user);
        }

        const idToken = await user.getIdToken();
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      } else {
        await fetch('/api/auth/session', { method: 'DELETE' });
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut: logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Export the hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
