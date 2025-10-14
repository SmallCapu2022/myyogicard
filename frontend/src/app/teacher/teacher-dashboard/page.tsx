"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const { userData, logout } = useAuthContext();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-neutral p-8">
      <h1 className="text-4xl font-serif text-tealdeep mb-6">
        Bienvenue {userData?.email?.split("@")[0]} 👩‍🏫
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button onClick={()=>router.push("/teacher/choose-studio")}
                className="bg-sage text-neutral rounded-xl p-4 hover:opacity-90">
          🌿 Rejoindre ou créer un studio
        </button>
        <button onClick={logout}
                className="bg-terracotta text-beige rounded-xl p-4 hover:opacity-90">
          Déconnexion
        </button>
      </div>
    </main>
  );
}
