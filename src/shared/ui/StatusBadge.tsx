import { StatusBadgeProps } from "@/src/types/types";

// StatusBadge component to display different statuses with styles
export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const statusStyles = {
    pending: "bg-yellow-900/20 border border-yellow-800 text-yellow-400",
    processing: "bg-blue-900/20 border border-blue-800 text-blue-400",
    shipped: "bg-green-900/20 border border-green-800 text-green-400",
    cancelled: "bg-red-900/20 border border-red-800 text-red-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]} ${className}`}
    >
      {status}
    </span>
  );
}
