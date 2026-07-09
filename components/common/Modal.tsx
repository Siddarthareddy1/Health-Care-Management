import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`w-full ${sizeClasses[size]} bg-white rounded-standard border border-healthcare-border shadow-xl flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-healthcare-border">
          <h3 className="text-lg font-bold text-healthcare-textDark font-display">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-healthcare-textMedium hover:bg-healthcare-bgSecondary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-healthcare-textDark">
          {children}
        </div>
      </div>
    </div>
  );
}
