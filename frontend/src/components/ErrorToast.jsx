import React, { useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

// Displays error messages as a dismissable toast notification
function ErrorToast({ message, onDismiss }) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="animate-slide-up fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-xl shadow-xl max-w-sm w-full mx-4">
      <AlertCircle size={16} className="flex-shrink-0 text-red-400" />
      <p className="text-sm flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-red-500 hover:text-red-300 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default ErrorToast;
