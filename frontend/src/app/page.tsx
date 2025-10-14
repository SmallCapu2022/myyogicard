"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-base-100 text-neutral p-8">
      <h1 className="text-4xl font-serif text-tealdeep mb-10">
        Bienvenue sur MyYogiCard 🌿
      </h1>
      <p className="text-brownsoft mb-8 text-center max-w-md">
        Choisissez votre espace pour accéder à vos cartes, cours ou studios.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 🧘 Espace Élève */}
        <div
          onClick={() => router.push("/student/login")}
          className="cursor-pointer bg-beige border border-sage rounded-2xl shadow-md p-8 hover:shadow-lg transition w-72 text-center"
        >
          <h2 className="text-2xl font-serif text-tealdeep mb-4">
            Espace Élève
          </h2>
          <p className="text-brownsoft text-sm">
            Consultez vos cartes, réservez vos cours et suivez votre pratique.
          </p>
        </div>

        {/* 👩‍🏫 Espace Prof */}
        <div
          onClick={() => router.push("/teacher/login")}
          className="cursor-pointer bg-beige border border-sage rounded-2xl shadow-md p-8 hover:shadow-lg transition w-72 text-center"
        >
          <h2 className="text-2xl font-serif text-tealdeep mb-4">
            Espace Professeur
          </h2>
          <p className="text-brownsoft text-sm">
            Gérez vos cours, vos élèves et vos studios partenaires.
          </p>
        </div>
      </div>

      {/* ⚙️ Accès admin */}
      <button
        onClick={() => router.push("/admin/login")}
        className="mt-12 text-sm text-sage underline hover:opacity-80"
      >
        ⚙️ Accès administrateur
      </button>
    </main>
  );
}
