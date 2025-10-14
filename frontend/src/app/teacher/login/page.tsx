"use client";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

export default function TeacherLogin() {
  const { login, signup } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) await signup(email, password, "teacher");
    else await login(email, password);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-100 text-neutral p-8">
      <div className="w-full max-w-md bg-beige shadow-xl rounded-2xl p-8 border border-sage">
        <h1 className="text-3xl font-serif text-center text-tealdeep mb-6">
          {isSignup ? "Créer un compte Professeur 🧘" : "Connexion Professeur"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Adresse e-mail"
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
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-tealdeep text-beige rounded-xl hover:opacity-90 transition"
          >
            {isSignup ? "Créer un compte" : "Se connecter"}
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
