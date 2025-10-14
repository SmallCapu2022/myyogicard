import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

// Fontes principales : corps (Poppins) + titres (Playfair)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

// 🌿 Métadonnées globales du site
export const metadata: Metadata = {
  title: "MyYogiCard 🌿",
  description:
    "Suivez vos cartes de yoga, trouvez vos cours et cultivez votre pratique dans la sérénité.",
  keywords: ["yoga", "carte", "studio", "professeur", "élève", "cours"],
};

// 🌸 Layout racine partagé par toute l'application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="myyogicard">
      <body
        className={`${poppins.variable} ${playfair.variable} bg-base-100 text-neutral antialiased min-h-screen`}
      >
        {/* 🔐 Fournit le contexte global d’authentification */}
        <AuthProvider>
          {/* 🌸 Navbar commune à toutes les pages */}
          <Navbar />

          {/* 🌿 Contenu principal (avec un padding pour ne pas être caché par la navbar fixe) */}
          <main className="pt-20">{children}</main>

          {/* 🌺 Footer global (optionnel, à créer plus tard) */}
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
