"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function StudentLogin() {
  const { login, signup } = useAuthContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, "student", firstName, lastName);
        router.push("/student/dashboard");
      } else {
        await login(email, password);
        router.push("/student/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-100 text-neutral p-8">
      <div className="w-full max-w-md bg-beige shadow-xl rounded-2xl p-8 border border-sage">
        <h1 className="text-3xl font-serif text-center text-tealdeep mb-6">
          {isSignup ? "Créer un compte élève 🧘‍♀️" : "Connexion élève"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Prénom"
                className="input input-bordered w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Nom"
                className="input input-bordered w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Adresse e-mail"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-terracotta text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-3"
          >
            {loading
              ? "Connexion..."
              : isSignup
              ? "Créer mon compte"
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
              : "Pas encore inscrit ? Créer un compte"}
          </button>
        </p>
      </div>
    </main>
  );
}
