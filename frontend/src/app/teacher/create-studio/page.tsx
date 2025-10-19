"use client";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createStudio } from "@/lib/firestore";

export default function CreateStudio() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await createStudio(user.uid, name, location);
      setMessage("✅ Studio créé avec succès !");
      setTimeout(() => router.push("/teacher/studio-dashboard"), 1500);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Erreur : impossible de créer le studio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-neutral p-8">
      <h1 className="text-4xl font-serif text-tealdeep mb-6">
        Créer un nouveau studio 🌿
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-beige border border-sage rounded-2xl shadow-md p-8 w-full max-w-md flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Nom du studio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input bg-base-100 border-sage rounded-xl p-3"
          required
        />
        <input
          type="text"
          placeholder="Lieu / adresse"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input bg-base-100 border-sage rounded-xl p-3"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-3 bg-tealdeep text-beige rounded-xl hover:opacity-90 transition"
        >
          {loading ? "Création..." : "Créer le studio"}
        </button>
      </form>

      {message && <p className="mt-4 text-brownsoft">{message}</p>}
    </main>
  );
}
