import React, { useState } from "react";

interface ConfirmDialogProps {
  showConfirmDialog: boolean;
  confirmation: string;
  handleCancel: () => void;
  handleConfirm: () => Promise<void> | void;
  confirmButton?: string;
  cancelButton?: string;
}

export default function ConfirmDialog({
  showConfirmDialog,
  confirmation,
  handleCancel,
  handleConfirm,
  confirmButton,
  cancelButton,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmClick = async () => {
    setIsLoading(false); // Reset loading state in case of multiple dialog openings

    // Start a timer to set loading state after 0.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 350);

    try {
      await handleConfirm(); // Call the provided confirmation function
    } finally {
      clearTimeout(timer); // Prevent loading if the task finishes quickly
      setIsLoading(false); // Reset loading state after completion
    }
  };

  return (
    <>
      <div
        id="confirm-dialog"
        className={`fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-lg transition-opacity duration-300 space-y-0 ${
          showConfirmDialog ? "opacity-100 z-50" : "opacity-0 -z-10"
        }`}
      >
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Action</h2>
          <p className="text-gray-600 mt-2">{confirmation}</p>
          <div className="flex justify-around mt-4 gap-x-4">
            <button
              className="btn-danger px-4 py-2 rounded w-full"
              onClick={handleCancel}
              disabled={isLoading} // Prevent interactions when loading
            >
              {cancelButton || "Cancel"}
            </button>
            <button
              className={`btn-primary px-4 py-2 rounded w-full flex justify-center items-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={handleConfirmClick}
              disabled={isLoading} // Prevent multiple clicks
            >
              {isLoading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                confirmButton || "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
