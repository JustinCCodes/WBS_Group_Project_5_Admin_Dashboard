import { AlertTriangle } from "lucide-react";
import { ErrorAlertProps } from "@/src/types/types";

// Error alert component to display error messages
export default function ErrorAlert({
  message,
  className = "",
}: // Props destructured from ErrorAlertProps
ErrorAlertProps) {
  return (
    <div
      className={`bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg p-4 mb-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
        <p className="text-red-700 dark:text-red-400">{message}</p>
      </div>
    </div>
  );
}
