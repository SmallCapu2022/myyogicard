"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { updateProfile, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, userData, logout } = useAuthContext();
  const router = useRouter();

  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  if (!userData) return <p className="text-center mt-10">Chargement...</p>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const ref = doc(db, "users", userData.id);
      await updateDoc(ref, {
        firstName,
        lastName,
      });

      if (password) {
        await updatePassword(auth.currentUser!, password);
      }

      setMessage("✅ Profil mis à jour avec succès !");
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-100 text-neutral p-8 flex flex-col items-center relative">
      {/* 🌿 Bannière de confirmation */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-20 bg-sage text-tealdeep font-medium py-3 px-6 rounded-xl shadow-md border border-tealdeep z-50"
          >
            💾 Profil mis à jour !
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-serif text-tealdeep mb-2">Mon Profil 🌸</h1>
      <p className="text-brownsoft mb-8">{userData?.email}</p>

      <form
        onSubmit={handleSave}
        className="bg-beige border border-sage shadow-md rounded-2xl p-8 w-full max-w-lg flex flex-col gap-4"
      >
        <div>
          <label className="text-sm text-brownsoft">Prénom</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input input-bordered w-full mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-brownsoft">Nom</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input input-bordered w-full mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-brownsoft">Nouveau mot de passe</label>
          <input
            type="password"
            value={password}
            placeholder="Laisser vide pour ne pas changer"
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full mt-1"
          />
        </div>

        {message && (
          <p className="text-sm text-sage text-center mt-2">{message}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={saving}
        >
          {saving ? "Mise à jour..." : "Enregistrer"}
        </button>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="btn btn-outline border-terracotta text-terracotta mt-2"
        >
          Se déconnecter
        </button>
      </form>
    </main>
  );
}
