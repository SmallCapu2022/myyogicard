"use client";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

export default function AdminLogin() {
  const { login, signup } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignup) await signup(email, password, "admin");
      else await login(email, password);
    } catch {
      setError("Échec de connexion. Vérifie tes identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-100 text-neutral p-8">
      <div className="w-full max-w-md bg-beige shadow-xl rounded-2xl p-8 border border-sage">
        <h1 className="text-3xl font-serif text-center text-tealdeep mb-6">
          {isSignup ? "Créer un compte admin ⚙️" : "Connexion Admin"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="input bg-base-100 border-sage rounded-xl p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="input bg-base-100 border-sage rounded-xl p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-6 py-3 bg-tealdeep text-beige rounded-xl hover:opacity-90 transition"
          >
            {loading
              ? "Connexion..."
              : isSignup
              ? "Créer un compte"
              : "Se connecter"}
          </button>
        </form>

        <p className="text-center mt-4">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-tealdeep underline"
          >
            {isSignup
              ? "Déjà un compte ? Se connecter"
              : "Créer un compte admin"}
          </button>
        </p>
      </div>
    </main>
  );
}
