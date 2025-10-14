import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="navbar bg-base-100 shadow-sm border-b border-accent fixed top-0 w-full z-50 px-6 py-2">
      {/* Logo + Nom */}
      <div className="flex-1 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Logo MyYogiCard"
          width={52}
          height={52}
          className="object-contain drop-shadow-sm"
        />
        <span className="text-primary font-serif text-2xl tracking-wide">
          MyYogiCard
        </span>
      </div>

      {/* Bouton */}
      <div className="flex-none">
        <button className="btn btn-primary text-base-100 rounded-xl shadow-sm hover:opacity-90 transition">
          Accéder à mes cartes
        </button>
      </div>
    </nav>
  );
}
