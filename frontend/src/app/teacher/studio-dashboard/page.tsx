// src/app/teacher/studio-dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getStudio,
  updateStudioCardTypes,
  getStudentsByStudio,
  countCardsByStatus,
  getStudioRequests,
  Studio,
  User,
  CardRequest,
} from "@/lib/firestore";
import StudioStats from "@/components/StudioStats";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "config" | "students" | "requests";

export default function StudioDashboard() {
  const { userData } = useAuthContext();
  const studioId = userData?.studios?.[0]; // ✅ multi-studio : 1er studio comme "principal"
  
  // Debug logs removed for production readiness

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<Tab>("config");
  const [cardTypes, setCardTypes] = useState<
    { label: string; sessions: number; price: number }[]
  >([]);
  const [acceptSingleClass, setAcceptSingleClass] = useState(false);

  const [students, setStudents] = useState<User[]>([]);
  const [requests, setRequests] = useState<CardRequest[]>([]);
  const [stats, setStats] = useState({ active: 0, expired: 0, pending: 0 });

  const [showBanner, setShowBanner] = useState(false);
  const [message, setMessage] = useState("");

  // Chargement initial
  useEffect(() => {
    async function loadStudioData() {
      try {
        if (!studioId) {
          console.warn("No studio ID available");
          setLoading(false);
          return;
        }

        // Charger le studio en premier
        const s = await getStudio(studioId);
  // studio loaded
        
        if (s) {
          setStudio(s);
          setCardTypes(s.cardTypes || []);
          setAcceptSingleClass(!!s.acceptSingleClass);

          // Charger les données associées uniquement si on a le studio
          try {
            const [studs, counts, reqs] = await Promise.all([
              getStudentsByStudio(studioId),
              countCardsByStatus(studioId),
              getStudioRequests(studioId),
            ]);
            // additional data loaded
            
            setStudents(studs);
            setStats(counts);
            setRequests(reqs);
          } catch (error) {
            console.error("Error loading additional data:", error);
          }
        } else {
          console.warn("Studio not found");
        }
      } catch (error) {
        console.error("Error in loadStudioData:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStudioData();
  }, [studioId, userData]);

  const handleAddType = () =>
    setCardTypes((p) => [...p, { label: "", sessions: 5, price: 0 }]);

  const handleRemoveType = (i: number) =>
    setCardTypes((p) => p.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!studioId) return;
    await updateStudioCardTypes(studioId, cardTypes, acceptSingleClass);
    setMessage("💾 Configuration enregistrée !");
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 1800);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center text-neutral">
        Chargement de votre studio...
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="min-h-screen flex justify-center items-center text-red-500">
        Studio introuvable.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100 text-neutral p-8 flex flex-col items-center">
      {/* ✅ Bannière de confirmation */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 bg-sage text-tealdeep font-medium py-2 px-4 rounded-xl shadow border border-tealdeep z-50"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-serif text-tealdeep mb-1">Mon Studio 🌿</h1>
      <h2 className="text-brownsoft mb-6">{studio.name}</h2>

      {/* Statistiques globales */}
      <StudioStats stats={stats} />

      {/* Onglets */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("config")}
          className={`btn ${tab === "config" ? "btn-primary" : "btn-outline"}`}
        >
          ⚙️ Configuration
        </button>
        <button
          onClick={() => setTab("students")}
          className={`btn ${tab === "students" ? "btn-primary" : "btn-outline"}`}
        >
          🧘 Mes élèves
        </button>
        <button
          onClick={() => setTab("requests")}
          className={`btn ${tab === "requests" ? "btn-primary" : "btn-outline"}`}
        >
          📋 Demandes
          {requests.some((r) => r.status === "pending") && (
            <span className="badge badge-secondary ml-2">Nouveau</span>
          )}
        </button>
      </div>

      {/* Onglet Configuration */}
      {tab === "config" && (
        <div className="bg-beige border border-sage rounded-2xl shadow-md p-6 w-full max-w-2xl">
          <h3 className="text-2xl font-serif text-tealdeep mb-4">
            Cartes proposées 🎟️
          </h3>

          <label className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={acceptSingleClass}
              onChange={() => setAcceptSingleClass((v) => !v)}
            />
            <span className="text-brownsoft">Autoriser le cours à l’unité</span>
          </label>

          {cardTypes.length === 0 && (
            <p className="text-brownsoft italic">Aucune carte pour le moment.</p>
          )}

          {cardTypes.map((card, idx) => (
            <div
              key={idx}
              className="bg-cream border border-sage rounded-xl p-4 mb-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-tealdeep">Carte {idx + 1}</h4>
                <button
                  onClick={() => handleRemoveType(idx)}
                  className="btn btn-xs btn-error"
                >
                  ✕ Supprimer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-sm text-brownsoft">Nom</span>
                  <input
                    className="input input-bordered w-full mt-1"
                    placeholder="ex : Pass 5 cours"
                    value={card.label}
                    onChange={(e) =>
                      setCardTypes((p) =>
                        p.map((c, i) => (i === idx ? { ...c, label: e.target.value } : c))
                      )
                    }
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-brownsoft">Séances</span>
                  <input
                    type="number"
                    min={1}
                    className="input input-bordered w-full mt-1"
                    value={card.sessions}
                    onChange={(e) =>
                      setCardTypes((p) =>
                        p.map((c, i) =>
                          i === idx ? { ...c, sessions: Number(e.target.value) } : c
                        )
                      )
                    }
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-brownsoft">Prix (€)</span>
                  <input
                    type="number"
                    min={0}
                    className="input input-bordered w-full mt-1"
                    value={card.price}
                    onChange={(e) =>
                      setCardTypes((p) =>
                        p.map((c, i) =>
                          i === idx ? { ...c, price: Number(e.target.value) } : c
                        )
                      )
                    }
                  />
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-2">
            <button onClick={handleAddType} className="btn btn-secondary">
              ➕ Ajouter une carte
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Onglet Élèves */}
      {tab === "students" && (
        <div className="bg-beige border border-sage rounded-2xl shadow-md p-6 w-full max-w-2xl">
          <h3 className="text-xl font-serif text-tealdeep mb-4">Élèves inscrits</h3>
          {students.length ? (
            <ul className="divide-y divide-sage">
              {students.map((s) => (
                <li key={s.id} className="py-2">
                  {`${s.firstName || ""} ${s.lastName || ""}`.trim() || s.email}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brownsoft">Aucun élève pour le moment.</p>
          )}
        </div>
      )}

      {/* Onglet Demandes */}
      {tab === "requests" && (
        <div className="bg-beige border border-sage rounded-2xl shadow-md p-6 w-full max-w-2xl">
          <h3 className="text-xl font-serif text-tealdeep mb-4">Demandes de cartes</h3>
          {requests.length ? (
            <div className="grid gap-3">
              {requests.map((r) => (
                <div key={r.id} className="border border-sage rounded-xl p-4">
                  <p className="text-brownsoft">
                    <span className="font-medium">
                      {r.studentName || "Élève inconnu"}
                    </span>{" "}
                    — {r.type} • {r.price} €
                  </p>
                  <p className="text-xs mt-1">
                    État :{" "}
                    <span
                      className={
                        r.status === "pending"
                          ? "text-yellow-600"
                          : r.status === "paid"
                          ? "text-green-600"
                          : r.status === "rejected"
                          ? "text-red-600"
                          : "text-tealdeep"
                      }
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brownsoft">Aucune demande.</p>
          )}
        </div>
      )}
    </main>
  );
}
