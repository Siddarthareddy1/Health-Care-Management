import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  padding?: "sm" | "normal" | "lg" | "none";
}

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  actions,
  padding = "normal",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3 sm:p-4",
    normal: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${paddingClasses[padding]} ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7EB] pb-4 mb-4 gap-2">
          <div>
            {title && <h3 className="text-lg font-bold text-[#1F2937] font-display">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-[#6B7280] font-sans mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="mt-1 sm:mt-0 flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="font-sans text-[#1F2937]">
        {children}
      </div>
    </div>
  );
}

