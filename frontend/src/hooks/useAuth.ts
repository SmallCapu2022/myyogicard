"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fonction d'inscription
  const signup = async (email: string, password: string, role: string = "student") => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Crée le profil Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role,
      isOwner: false,
      studioId: null,
      createdAt: new Date(),
    });

    setUser(cred.user);
  };

  // 🔹 Fonction de connexion
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🔹 Fonction de déconnexion
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  // 🔹 Récupère le rôle Firestore associé à l'utilisateur
  const fetchUserData = async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) setUserData(snap.data());
    else setUserData(null);
  };

  // 🔹 Surveille les changements d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userData, loading, signup, login, logout };
}
