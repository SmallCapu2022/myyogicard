"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getStudioRequests,
  approveCardRequest,
  rejectCardRequest,
  markCardAsPaid,
} from "@/lib/firestore";

export default function CardRequestsPage() {
  const { userData } = useAuthContext();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userData?.studioId) return;
    async function fetchRequests() {
      const list = await getStudioRequests(userData.studioId);
      // Trie pour voir les "pending" d'abord
      setRequests(list.sort((a, b) => (a.status > b.status ? 1 : -1)));
      setLoading(false);
    }
    fetchRequests();
  }, [userData]);

  const handleApprove = async (id: string, remaining: number) => {
    await approveCardRequest(id, remaining);
    setRequests((r) =>
      r.map((req) => (req.id === id ? { ...req, status: "accepted" } : req))
    );
    setMessage("✅ Demande acceptée — en attente de paiement.");
  };

  const handleReject = async (id: string) => {
    await rejectCardRequest(id);
    setRequests((r) => r.filter((req) => req.id !== id));
    setMessage("❌ Demande refusée.");
  };

  const handleMarkPaid = async (id: string) => {
    await markCardAsPaid(id);
    setRequests((r) => r.filter((req) => req.id !== id));
    setMessage("💳 Paiement confirmé — carte activée !");
  };

  if (loading) return <p className="text-center mt-10">Chargement des demandes...</p>;

  return (
    <main className="min-h-screen bg-base-100 text-neutral p-8 flex flex-col items-center">
      <h1 className="text-3xl font-serif text-tealdeep mb-6">Demandes de cartes 📋</h1>

      {message && <p className="text-sage mb-4">{message}</p>}

      <div className="w-full max-w-lg">
        {requests.length === 0 ? (
          <p>Aucune demande en attente.</p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className={`bg-beige border rounded-xl p-4 mb-3 ${
                req.status === "pending"
                  ? "border-sage"
                  : req.status === "accepted"
                  ? "border-warning"
                  : "border-success"
              }`}
            >
              <p>
                <strong>Type :</strong> {req.type}
              </p>
              <p>
                <strong>Prix :</strong> {req.price} €
              </p>
              <p>
                <strong>État :</strong>{" "}
                <span
                  className={`${
                    req.status === "pending"
                      ? "text-sage"
                      : req.status === "accepted"
                      ? "text-warning"
                      : req.status === "paid"
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {req.status}
                </span>
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleApprove(req.id, req.type.includes("10") ? 10 : 5)
                      }
                      className="btn btn-primary flex-1"
                    >
                      ✅ Accepter
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="btn btn-error flex-1"
                    >
                      ❌ Refuser
                    </button>
                  </>
                )}

                {req.status === "accepted" && (
                  <button
                    onClick={() => handleMarkPaid(req.id)}
                    className="btn btn-secondary w-full"
                  >
                    💳 Marquer comme payé
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
