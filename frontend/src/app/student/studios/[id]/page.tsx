"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStudio, requestCard, type Studio } from "@/lib/firestore";
import { useAuthContext } from "@/context/AuthContext";

export default function StudioDetailsPage() {
  const { userData } = useAuthContext();
  const params = useParams();
  const studioId = params?.id as string;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudio() {
      if (!studioId) return;
      const s = await getStudio(studioId);
      setStudio(s);
      setLoading(false);
    }
    loadStudio();
  }, [studioId]);

  const handleRequest = async (type: string, price: number) => {
    if (!userData?.id) {
      setMessage("⚠️ Vous devez être connecté pour demander une carte.");
      return;
    }
    const sid = studio?.id;
    if (!sid) {
      setMessage("⚠️ Studio introuvable.");
      return;
    }
    await requestCard(
      userData.id,
      sid,
      type,
      price,
      `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
    );
    setMessage("✅ Demande envoyée au studio !");
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen text-neutral">
        Chargement du studio...
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="flex justify-center items-center h-screen text-red-500">
        Studio introuvable.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100 text-neutral p-8">
      <h1 className="text-3xl font-serif text-tealdeep mb-2">{studio.name}</h1>
      <h2 className="text-brownsoft mb-6">{studio.location}</h2>

      {message && (
        <div className="alert alert-info shadow-md mb-6">
          <span>{message}</span>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4">🎟️ Cartes disponibles</h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {studio.cardTypes?.map((card, index: number) => (
          <div
            key={index}
            className="card bg-base-100 border border-sage shadow-md"
          >
            <div className="card-body text-center">
              <h2 className="card-title text-tealdeep">{card.label}</h2>
              <p className="text-brownsoft mb-2">
                {card.sessions} cours — {card.price} €
              </p>
              <button
                onClick={() => handleRequest(card.label, card.price)}
                className="btn btn-primary rounded-xl"
              >
                Demander cette carte
              </button>
            </div>
          </div>
        ))}
      </div>

      {studio.acceptSingleClass && (
        <div className="mt-6">
          <button
            onClick={() => handleRequest("Cours à l’unité", 15)}
            className="btn btn-outline border-sage text-brownsoft hover:bg-sage hover:text-tealdeep"
          >
            Réserver un cours à l’unité
          </button>
        </div>
      )}
    </main>
  );
}
