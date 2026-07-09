import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  actions,
}: CardProps) {
  return (
    <div className={`bg-healthcare-bgPrimary border border-healthcare-border rounded-standard shadow-subtle p-6 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-healthcare-border pb-4 mb-4 gap-2">
          <div>
            {title && <h3 className="text-lg font-bold text-healthcare-textDark font-display">{title}</h3>}
            {subtitle && <p className="text-sm text-healthcare-textMedium font-sans mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="mt-1 md:mt-0 flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="font-sans text-healthcare-textDark">
        {children}
      </div>
    </div>
  );
}
