"use client";

import { useEffect, useState } from "react";
import { getAllStudios, Studio } from "@/lib/firestore";
import Link from "next/link";

export default function StudiosListPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const list = await getAllStudios();
      setStudios(list);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement des studios...</p>;

  return (
    <main className="min-h-screen bg-base-100 text-neutral p-8">
      <h1 className="text-3xl font-serif text-tealdeep mb-8 text-center">
        Studios partenaires 🪷
      </h1>

      {studios.length === 0 ? (
        <p className="text-center text-brownsoft">Aucun studio enregistré pour le moment.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <div
              key={studio.id}
              className="card bg-beige border border-sage shadow-sm hover:shadow-md transition p-6"
            >
              <h2 className="text-xl font-serif text-tealdeep mb-2">{studio.name}</h2>
              <p className="text-sm text-brownsoft mb-4">
                {studio.cardTypes?.length || 0} formules disponibles
              </p>
              <Link href={`/student/studios/${studio.id}`}>
                <button className="btn btn-primary w-full">Voir le studio</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
