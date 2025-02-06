"use client";

import { useContext } from "react";
import { useAuth as useFirebaseAuth } from "@/lib/contexts/AuthContext";
import { signInWithGoogle, logoutUser } from "@/lib/firebase/firebaseUtils";

export function useAuth() {
  const { user, loading } = useFirebaseAuth();

  return {
    user,
    loading,
    signInWithGoogle,
    signOut: logoutUser,
  };
}