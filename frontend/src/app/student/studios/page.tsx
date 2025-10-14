"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllStudios } from "@/lib/firestore";

export default function StudiosList() {
  const [studios, setStudios] = useState<any[]>([]);

  useEffect(() => {
    getAllStudios().then(setStudios);
  }, []);

  return (
    <main className="min-h-screen bg-base-100 text-neutral p-8 flex flex-col items-center">
      <h1 className="text-3xl font-serif text-tealdeep mb-6">Studios de yoga 🪷</h1>

      <div className="grid gap-4 w-full max-w-lg">
        {studios.map((s) => (
          <Link
            key={s.id}
            href={`/student/studios/${s.id}`}
            className="block bg-beige border border-sage rounded-xl p-4 hover:shadow-md transition"
          >
            <h2 className="text-xl font-serif text-tealdeep">{s.name}</h2>
            <p className="text-sm text-brownsoft">{s.location}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
