import Modal from "@/src/shared/ui/Modal";
import Button from "@/src/shared/ui/Button";
import type { User, BanUserModalProps } from "../types";

// Modal component for banning a user
export const BanUserModal = ({
  isOpen,
  user,
  reason,
  until,
  isBanning,
  onReasonChange,
  onUntilChange,
  onConfirm,
  onClose,
}: BanUserModalProps) => {
  return (
    <Modal
      isOpen={isOpen && !!user}
      onClose={onClose}
      title={`Ban User: ${user?.name || ""}`}
      maxWidth="md"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ban Reason *
        </label>
        <textarea
          className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-24"
          placeholder="Enter reason for banning this user..."
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ban Until (Optional)
        </label>
        <input
          type="datetime-local"
          className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          value={until}
          onChange={(e) => onUntilChange(e.target.value)}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Leave empty for permanent ban
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="lg" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          size="lg"
          disabled={!reason.trim() || isBanning}
          loading={isBanning}
          onClick={onConfirm}
        >
          {isBanning ? "Banning..." : "Ban User"}
        </Button>
      </div>
    </Modal>
  );
};
