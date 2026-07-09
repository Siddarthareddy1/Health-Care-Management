"use client";

import React from "react";
import { useToast } from "../../hooks/useNotification";
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-healthcare-success flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-healthcare-error flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-healthcare-warning flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-healthcare-accent flex-shrink-0" />,
  };

  const borders = {
    success: "border-healthcare-success bg-emerald-50",
    error: "border-healthcare-error bg-red-50",
    warning: "border-healthcare-warning bg-amber-50",
    info: "border-healthcare-accent bg-blue-50",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full no-print">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-standard border-l-4 shadow-lg bg-white ${borders[toast.type]} transition-all duration-300`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-healthcare-textDark font-display">{toast.title}</h4>
            <p className="text-xs text-healthcare-textMedium font-sans mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-healthcare-textMedium hover:text-healthcare-textDark p-0.5 rounded transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
