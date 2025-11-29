"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import type { Card } from "@/lib/firestore";

type CardWithStudio = Card & { studioName?: string };

export default function StudentDashboard() {
  const { userData, logout } = useAuthContext();
  const [cards, setCards] = useState<CardWithStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Id sécurisé, jamais null dans l'effet
  const userId = userData?.id ?? null;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Capturer une copie immuable de l'ID utilisateur pour que TypeScript
    // sache que la valeur ne changera pas à l'intérieur de l'async function.
    const uid = userId;

    let cancelled = false;

    async function loadCards() {
      try {
        const res = await fetch(`/api/user/cards?userId=${encodeURIComponent(uid)}`);
        if (!res.ok) throw new Error("Erreur lors du chargement des cartes");
        const data = await res.json();
        if (!cancelled) setCards(data as CardWithStudio[]);
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          setError(message || "Erreur lors du chargement des cartes");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCards();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-neutral">
        Chargement de vos cartes...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center h-screen text-neutral">
        <p className="text-terracotta text-sm">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100 text-neutral px-6 py-12">
      <h1 className="text-3xl font-serif text-tealdeep mb-8">
        🎟️ Mes cartes MyYogiCard
      </h1>

      {cards.length === 0 ? (
        <p className="text-brownsoft">
          Vous n’avez encore aucune carte active.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="card bg-base-100 shadow-xl border border-sage"
            >
              <div className="card-body text-center">
                <h2 className="card-title text-tealdeep mb-1">
                  {card.studioName}
                </h2>
                <p className="text-brownsoft">
                  {card.type} —{" "}
                  <span className="font-semibold">{card.remaining}</span> cours
                  restants
                </p>
                <div className="mt-3">
                  <progress
                    className="progress progress-primary w-full"
                    value={
                      (card.remaining /
                        (card.type.includes("10") ? 10 : 5)) *
                      100
                    }
                    max={100}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Statut :{" "}
                  <span
                    className={
                      card.status === "active"
                        ? "text-green-600"
                        : card.status === "expired"
                        ? "text-red-500"
                        : "text-yellow-600"
                    }
                  >
                    {card.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-right">
        <button
          onClick={logout}
          className="btn btn-outline border-sage text-brownsoft hover:bg-sage hover:text-tealdeep"
        >
          Se déconnecter
        </button>
      </div>
    </main>
  );
}
