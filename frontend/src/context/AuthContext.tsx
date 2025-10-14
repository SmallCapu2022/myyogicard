"use client";
import { createContext, useContext, ReactNode, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, userData, loading, ...rest } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Liste des pages publiques où l'on ne redirige pas
    const publicRoutes = ["/", "/student/login", "/teacher/login", "/admin/login"];

    // 🔸 Si pas connecté et pas déjà sur une page publique → retour à l’accueil
    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/");
      return;
    }

    // 🔹 Si connecté, on redirige selon le rôle
    if (user && userData) {
      if (userData.role === "student" && pathname.startsWith("/student/login")) {
        router.push("/student/dashboard");
      } else if (
        userData.role === "teacher" &&
        userData.isOwner &&
        pathname.startsWith("/teacher/login")
      ) {
        router.push("/teacher/studio-dashboard");
      } else if (
        userData.role === "teacher" &&
        !userData.isOwner &&
        pathname.startsWith("/teacher/login")
      ) {
        router.push("/teacher/teacher-dashboard");
      } else if (userData.role === "admin" && pathname.startsWith("/admin/login")) {
        router.push("/admin/dashboard");
      }
    }
  }, [user, userData, loading, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, userData, loading, ...rest }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
}
