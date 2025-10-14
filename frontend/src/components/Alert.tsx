export default function Alert({
  message,
  type = "info",
}: {
  message: string;
  type?: "info" | "success" | "warning" | "error";
}) {
  return (
    <div className={`alert alert-${type} max-w-md mx-auto mt-4`}>
      <span>{message}</span>
    </div>
  );
}
