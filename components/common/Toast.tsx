"use client";

import React from "react";
import { useToast } from "../../hooks/useNotification";
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#34C759] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#FF9500] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#007AFF] shrink-0" />,
  };

  const borders = {
    success: "border-[#34C759] bg-[#E8F8EC]",
    error: "border-[#FF3B30] bg-[#FFEBEA]",
    warning: "border-[#FF9500] bg-[#FFF4E5]",
    info: "border-[#007AFF] bg-[#DFF1FF]",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full no-print">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg bg-white ${borders[toast.type]} transition-all duration-300 animate-fade-in-up`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#1F2937] font-display uppercase tracking-wider">{toast.title}</h4>
            <p className="text-xs text-[#6B7280] font-sans mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#9CA3AF] hover:text-[#1F2937] p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

