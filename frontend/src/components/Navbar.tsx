"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { userData, user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Pour l'instant, on désactive le compteur temps réel
  const pendingCount = 0;

  const getLinks = () => {
    if (!userData) return [];
    switch (userData.role) {
      case "student":
        return [
          { href: "/student/dashboard", label: "🎟️ Mes cartes" },
          { href: "/student/studios", label: "🌿 Studios" },
        ];
      case "teacher":
        return [
          { href: "/teacher/studio-dashboard", label: "🏡 Mon studio" },
          {
            href: "/teacher/card-requests",
            label: (
              <div className="relative inline-block">
                <span>📋 Demandes</span>
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                    {pendingCount}
                  </span>
                )}
              </div>
            ),
          },
        ];
      case "admin":
        return [
          { href: "/admin/dashboard", label: "🧠 Dashboard" },
          { href: "/admin/users", label: "👥 Utilisateurs" },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="navbar bg-base-100 border-b border-sage shadow-sm fixed top-0 w-full z-50 px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Image
          src="/logo.png"
          alt="MyYogiCard"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-xl font-serif text-tealdeep">MyYogiCard</span>
      </Link>

      {/* Liens desktop */}
      <div className="hidden md:flex gap-6 items-center justify-center flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium ${
              pathname.startsWith(link.href)
                ? "text-tealdeep font-semibold"
                : "text-brownsoft hover:text-tealdeep transition"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Profil + Déconnexion desktop */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        {userData && (
          <Link
            href="/profile"
            className="text-tealdeep font-medium hover:underline"
          >
            {userData.firstName || "Mon profil"}
          </Link>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline border-sage text-brownsoft hover:bg-sage hover:text-tealdeep"
          >
            Déconnexion
          </button>
        )}
      </div>

      {/* Menu mobile */}
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)} className="btn btn-ghost">
          <Menu className="text-tealdeep" />
        </button>
      </div>

      {open && (
        <div className="absolute top-16 right-4 bg-beige border border-sage rounded-xl shadow-lg p-4 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-brownsoft hover:text-tealdeep"
            >
              {link.label}
            </Link>
          ))}
          {userData && (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="text-brownsoft hover:text-tealdeep"
            >
              Mon profil
            </Link>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline border-sage text-brownsoft hover:bg-sage hover:text-tealdeep mt-2"
            >
              Déconnexion
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
