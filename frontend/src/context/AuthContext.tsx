"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Role = "student" | "teacher" | "admin";

export interface UserData {
  // standard Firestore-style id
  id: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  role?: Role | string;
  isOwner?: boolean;
  studios?: string[];
}

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    role?: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (data: UserData | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ───────────── signup sans Firestore ─────────────
  const signup = async (
    email: string,
    password: string,
    role: string = "student",
    firstName: string = "",
    lastName: string = ""
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Optionnel: mettre le nom dans Firebase Auth
    const displayName = `${firstName} ${lastName}`.trim();
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    const data: UserData = {
      id: cred.user.uid,
      email: cred.user.email,
      firstName,
      lastName,
      role,
      isOwner: false,
      studios: [],
    };

    setUser(cred.user);
    setUserData(data);
  };

  // ───────────── login ─────────────
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // ───────────── logout ─────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
    router.push("/");
  };

  // ───────────── suivi de session Auth ─────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        setUserData((prev) => {
          if (prev) return prev;
          return {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: firebaseUser.displayName || undefined,
            role: undefined,
            isOwner: false,
            studios: [],
          };
        });
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
    setUserData,
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
