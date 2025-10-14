"use client";
import { useAuthContext } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { userData, logout } = useAuthContext();

  return (
    <main className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-neutral p-8">
      <h1 className="text-4xl font-serif text-tealdeep mb-6">
        Tableau de bord administrateur ⚙️
      </h1>
      <p className="text-brownsoft mb-6 text-center max-w-md">
        Bonjour {userData?.email?.split("@")[0]}<br />
        Vous pouvez gérer les studios, professeurs et utilisateurs.
      </p>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div className="bg-beige border border-sage rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-xl font-serif text-tealdeep mb-3">Studios</h2>
          <p className="text-brownsoft text-sm">Consulter ou supprimer un studio.</p>
        </div>

        <div className="bg-beige border border-sage rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-xl font-serif text-tealdeep mb-3">Professeurs</h2>
          <p className="text-brownsoft text-sm">Voir la liste des professeurs enregistrés.</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-10 px-6 py-3 bg-terracotta text-beige rounded-xl hover:opacity-90 transition"
      >
        Déconnexion
      </button>
    </main>
  );
}
