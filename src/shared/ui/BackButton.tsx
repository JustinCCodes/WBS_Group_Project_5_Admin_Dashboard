import { BackButtonProps } from "@/src/types/types";

// Back navigation button component
export default function BackButton({
  onClick,
  className = "",
  ariaLabel = "Go back",
}: // Default to browser back if no onClick provided
BackButtonProps) {
  const handleClick = onClick || (() => window.history.back());

  return (
    <button
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`self-start text-2xl text-gray-800 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded bg-transparent transition-colors duration-200 mb-2 -ml-1 ${className}`}
    >
      &#8592;
    </button>
  );
}
