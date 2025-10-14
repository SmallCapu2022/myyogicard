"use client";
import { useRouter } from "next/navigation";

export default function ChooseStudio() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-neutral p-8">
      <h1 className="text-4xl font-serif text-tealdeep mb-6">Votre studio de yoga</h1>
      <p className="text-brownsoft mb-8 text-center max-w-md">
        Choisissez de rejoindre un studio existant ou d’en créer un nouveau.
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        <button onClick={()=>router.push("/teacher/join-studio")}
                className="bg-sage text-neutral rounded-xl px-6 py-3 hover:opacity-90">
          🤝 Rejoindre un studio
        </button>
        <button onClick={()=>router.push("/teacher/create-studio")}
                className="bg-tealdeep text-beige rounded-xl px-6 py-3 hover:opacity-90">
          🌿 Créer mon studio
        </button>
      </div>
    </main>
  );
}
