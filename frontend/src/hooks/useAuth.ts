"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  User,
} from "firebase/auth";
import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ───────────────────────────────
  // ✨ Inscription enrichie (multi-studios)
  // ───────────────────────────────
  const signup = async (
    email: string,
    password: string,
    role: string = "student",
    firstName: string = "",
    lastName: string = ""
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    await setDoc(doc(db, "users", uid), {
      id: uid,
      firstName,
      lastName,
      email,
      role,
      isOwner: false,
      studios: [],              // ✅ multi-studio
      createdAt: serverTimestamp(), // ✅ cohérence Firestore
    });

    setUser(cred.user);
    setUserData({
      id: uid,
      firstName,
      lastName,
      email,
      role,
      isOwner: false,
      studios: [],
    });
  };

  // ───────────────────────────────
  // 🔐 Connexion
  // ───────────────────────────────
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // ───────────────────────────────
  // 🚪 Déconnexion
  // ───────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  // ───────────────────────────────
  // 🔁 Écoute temps réel Firestore
  // ───────────────────────────────
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const ref = doc(db, "users", currentUser.uid);

        // 🔄 Écoute en temps réel du profil
        const unsubscribeUser = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            setUserData({ id: snap.id, ...snap.data() });
          }
          setLoading(false);
        });

        return () => unsubscribeUser();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { user, userData, loading, signup, login, logout, setUserData };
}
