"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { getStudio, requestCard } from "@/lib/firestore";

export default function StudioDetails() {
  const { user } = useAuthContext();
  const { id } = useParams();
  const [studio, setStudio] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getStudio(id as string).then(setStudio);
  }, [id]);

  const handleRequest = async (type: string, price: number) => {
    if (!user) return;
    await requestCard(user.uid, id as string, type, price);
    setMessage("✅ Demande envoyée !");
  };

  if (!studio) return <p>Chargement...</p>;

  return (
    <main className="min-h-screen bg-base-100 text-neutral p-8 flex flex-col items-center">
      <h1 className="text-3xl font-serif text-tealdeep mb-4">{studio.name}</h1>
      <p className="text-brownsoft mb-6">{studio.location}</p>

      <div className="w-full max-w-md bg-beige border border-sage rounded-2xl p-6 shadow-md">
        {studio.acceptSingleClass && (
          <button
            onClick={() => handleRequest("Cours à l’unité", 15)}
            className="btn btn-secondary w-full mb-4"
          >
            Réserver un cours à l’unité
          </button>
        )}

        {studio.cardTypes?.map((type: any, i: number) => (
          <div key={i} className="border-b border-sage py-3">
            <p className="text-lg font-serif text-tealdeep">{type.label}</p>
            <p className="text-sm text-brownsoft mb-2">{type.sessions} cours — {type.price} €</p>
            <button
              onClick={() => handleRequest(type.label, type.price)}
              className="btn btn-primary w-full"
            >
              Demander cette carte
            </button>
          </div>
        ))}
      </div>

      {message && <p className="mt-4 text-sage">{message}</p>}
    </main>
  );
}
