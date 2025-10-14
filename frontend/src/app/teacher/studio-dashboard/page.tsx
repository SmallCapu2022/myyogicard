"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getStudio, updateStudioCardTypes } from "@/lib/firestore";

export default function StudioDashboard() {
  const { userData } = useAuthContext();
  const [studio, setStudio] = useState<any>(null);
  const [cardTypes, setCardTypes] = useState<any[]>([]);
  const [acceptSingleClass, setAcceptSingleClass] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userData?.studioId) return;
    getStudio(userData.studioId).then(setStudio);
  }, [userData]);

  const handleAddType = () => {
    setCardTypes([...cardTypes, { label: "", sessions: 5, price: 0 }]);
  };

  const handleSave = async () => {
    await updateStudioCardTypes(userData.studioId, cardTypes, acceptSingleClass);
    setMessage("✅ Configuration enregistrée !");
  };

  return (
    <main className="min-h-screen bg-base-100 text-neutral p-8 flex flex-col items-center">
      <h1 className="text-3xl font-serif text-tealdeep mb-6">Mon Studio 🌿</h1>
      <h2 className="text-xl mb-4">{studio?.name}</h2>

      <div className="bg-beige border border-sage rounded-2xl shadow-md p-6 w-full max-w-lg">
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={acceptSingleClass}
            onChange={(e) => setAcceptSingleClass(e.target.checked)}
          />
          Autoriser les cours à l’unité
        </label>

        {cardTypes.map((t, i) => (
          <div key={i} className="border-b border-sage mb-3 pb-2">
            <input
              type="text"
              placeholder="Nom de la carte"
              value={t.label}
              onChange={(e) => (t.label = e.target.value) || setCardTypes([...cardTypes])}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="number"
              placeholder="Nombre de cours"
              value={t.sessions}
              onChange={(e) => (t.sessions = Number(e.target.value)) || setCardTypes([...cardTypes])}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="number"
              placeholder="Prix (€)"
              value={t.price}
              onChange={(e) => (t.price = Number(e.target.value)) || setCardTypes([...cardTypes])}
              className="input input-bordered w-full mb-2"
            />
          </div>
        ))}

        <button onClick={handleAddType} className="btn btn-secondary mt-2">+ Ajouter une carte</button>
        <button onClick={handleSave} className="btn btn-primary mt-4">💾 Enregistrer</button>
      </div>

      {message && <p className="mt-4 text-sage">{message}</p>}
    </main>
  );
}
