import { ModalProps } from "@/src/types/types";

// Modal component for displaying content in a popup
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}: ModalProps) {
  if (!isOpen) return null;

  // Define max width classes based on the provided maxWidth prop
  const maxWidthClasses = {
    sm: "max-w-sm", // Small
    md: "max-w-md", // Medium
    lg: "max-w-lg", // Large
    xl: "max-w-xl", // Extra Large
    "2xl": "max-w-2xl", // 2X Large
    "3xl": "max-w-3xl", // 3X Large
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div
        className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 ${maxWidthClasses[maxWidth]} mx-4 w-full max-h-[90vh] overflow-y-auto`}
      >
        <h3 className="font-bold text-xl mb-6 text-amber-400">{title}</h3>
        {children}
      </div>
    </div>
  );
}
