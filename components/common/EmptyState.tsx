import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = <FolderOpen className="w-10 h-10 text-teal-600/70" />,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80 text-center shadow-card">
      <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl mb-4 text-teal-600 shadow-subtle">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-900 font-display tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed font-sans">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className="mt-5 text-xs py-2.5 px-4 shadow-sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
