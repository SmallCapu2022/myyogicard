"use client";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { joinStudio } from "@/lib/firestore";
import { useRouter } from "next/navigation";

export default function JoinStudio() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [studioId, setStudioId] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await joinStudio(user, studioId);
      setMessage("✅ Vous avez rejoint le studio !");
      setTimeout(() => router.push("/teacher/teacher-dashboard"), 1500);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Studio introuvable ou erreur Firestore.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-neutral p-8">
      <h1 className="text-4xl font-serif text-tealdeep mb-6">Rejoindre un studio 🤝</h1>

      <form
        onSubmit={handleJoin}
        className="bg-beige border border-sage rounded-2xl shadow-md p-8 w-full max-w-md flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="ID du studio"
          value={studioId}
          onChange={(e) => setStudioId(e.target.value)}
          className="input bg-base-100 border-sage rounded-xl p-3"
          required
        />
        <button
          type="submit"
          className="mt-4 px-6 py-3 bg-tealdeep text-beige rounded-xl hover:opacity-90 transition"
        >
          Rejoindre
        </button>
      </form>

      {message && <p className="mt-4 text-brownsoft">{message}</p>}
    </main>
  );
}
