import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  padding?: "sm" | "normal" | "lg" | "none";
  hoverable?: boolean;
}

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  actions,
  padding = "normal",
  hoverable = true,
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    normal: "p-6", // 24px generous whitespace
    lg: "p-8",
  };

  const hoverClasses = hoverable
    ? "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200/80 transition-all duration-300"
    : "";

  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-[12px] shadow-sm ${hoverClasses} ${paddingClasses[padding]} ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#F1F5F9] pb-4 mb-5 gap-2">
          <div>
            {title && <h3 className="text-lg font-bold text-[#0F172A] font-poppins">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-[#475569] font-sans mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="mt-1 sm:mt-0 flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="font-sans text-[#0F172A]">
        {children}
      </div>
    </div>
  );
}
