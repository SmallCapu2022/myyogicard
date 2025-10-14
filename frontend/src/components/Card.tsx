export default function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl border border-accent">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-secondary mb-2">{title}</h2>
        {children}
      </div>
    </div>
  );
}
