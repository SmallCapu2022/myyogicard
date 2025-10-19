"use client";
import { createContext, useContext, ReactNode, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type AuthContextType = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, userData, loading, ...rest } = useAuth();
  const router = useRouter();

  // 🔹 Redirections automatiques selon le rôle
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/"); // page d’accueil ou choix espace
      return;
    }

    if (userData) {
      switch (userData.role) {
        case "student":
          router.push("/student/dashboard");
          break;
        case "teacher":
          if (userData.isOwner) router.push("/teacher/studio-dashboard");
          else router.push("/teacher/teacher-dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
      }
    }
  }, [user, userData, loading, router]);

  return (
    <AuthContext.Provider value={{ user, userData, loading, ...rest }}>
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
