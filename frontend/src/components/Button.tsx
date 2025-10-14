export default function Button({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
}) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant} rounded-xl px-4 py-2 text-white shadow-md hover:brightness-105 transition`}
    >
      {children}
    </button>
  );
}
