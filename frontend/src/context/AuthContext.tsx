"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Role = "student" | "teacher" | "admin";

export interface UserData {
  uid: string;
  email: string | null;
  firstName?: string;
  role?: Role;
  isOwner?: boolean;
  studios?: string[];
}

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Abonnement Firebase Auth uniquement, sans Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const basicUserData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: firebaseUser.displayName || undefined,
          role: undefined,        // à rebrancher via Firestore plus tard
          isOwner: false,
          studios: [],
        };
        setUserData(basicUserData);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Redirection minimale: si pas connecté → home
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
      return;
    }

    // Si tu veux rebrancher les redirections par rôle plus tard:
    // if (userData?.role === "student") router.push("/student/dashboard");
    // etc.
  }, [user, userData, loading, router]);

  const value: AuthContextType = {
    user,
    userData,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
}
