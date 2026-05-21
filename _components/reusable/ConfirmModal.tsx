"use client";

import CustomModal from "./CustomModal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}: ConfirmModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subTitle={message}
      showCloseButton={true}
    >
      <div className="flex items-center justify-end gap-3 py-4">
        <button
          onClick={onClose}
          className="px-5 py-2.5 border border-[#323B49] text-white rounded-lg hover:bg-[#1A1F2E] transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 bg-[#E03137] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Deleting..." : confirmText}
        </button>
      </div>
    </CustomModal>
  );
}
