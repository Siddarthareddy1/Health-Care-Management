import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "ghost" | "accent";
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none active:scale-[0.98] text-sm font-sans select-none h-[44px]";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white px-6 py-2.5 shadow-md hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-4 focus:ring-indigo-500/20 font-semibold",
    accent: "bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#DB2777] hover:to-[#7C3AED] text-white px-6 py-2.5 shadow-md hover:shadow-lg hover:shadow-pink-500/25 focus:ring-4 focus:ring-pink-500/20 font-semibold",
    secondary: "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] border border-[#E2E8F0] px-5 py-2.5 focus:ring-4 focus:ring-indigo-500/15 font-medium",
    outline: "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] hover:border-indigo-300 px-5 py-2.5 focus:ring-4 focus:ring-indigo-500/15 shadow-xs font-medium",
    danger: "bg-[#EF4444] hover:bg-[#DC2626] text-white px-6 py-2.5 shadow-md hover:shadow-red-500/20 focus:ring-4 focus:ring-red-500/20 font-semibold",
    ghost: "bg-transparent text-[#6366F1] hover:bg-[#EEF2FF] px-4 py-2.5 border-none font-medium",
    success: "bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 shadow-md hover:shadow-emerald-500/20 focus:ring-4 focus:ring-emerald-500/20 font-semibold",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const loadingStyle = loading || disabled ? "opacity-60 cursor-not-allowed active:scale-100 bg-slate-200 text-slate-400 border-none shadow-none" : "cursor-pointer";

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${loadingStyle} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
