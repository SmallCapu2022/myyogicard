"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getUserCards } from "@/lib/firestore";

export default function StudentDashboard() {
  const { user, userData, logout } = useAuthContext();
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    async function fetchCards() {
      const list = await getUserCards(user.uid);
      setCards(list);
    }
    fetchCards();
  }, [user]);

  return (
    <main className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-neutral p-8">
      <h1 className="text-4xl font-serif text-tealdeep mb-6">
        Bonjour {userData?.email?.split("@")[0]} 🌸
      </h1>

      <div className="bg-beige border border-sage rounded-2xl shadow-md p-6 w-full max-w-lg">
        <h2 className="text-xl font-serif text-tealdeep mb-3">Mes cartes</h2>

        {cards.length > 0 ? (
          <ul className="text-brownsoft text-sm">
            {cards.map((card) => (
              <li key={card.id} className="border-b border-sage py-2">
                {card.type} — {card.remaining} cours restants
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-brownsoft text-sm">Aucune carte active pour le moment.</p>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-8 px-6 py-3 bg-terracotta text-beige rounded-xl hover:opacity-90"
      >
        Déconnexion
      </button>
    </main>
  );
}
