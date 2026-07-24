import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "ghost";
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
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none active:scale-[0.98] text-sm font-sans select-none";
  
  const variants = {
    primary: "bg-[#007AFF] hover:bg-[#0051CC] text-white px-6 py-3 focus:ring-4 focus:ring-[#007AFF]/20 shadow-sm",
    secondary: "bg-transparent border-2 border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/10 px-5.5 py-2.5 focus:ring-4 focus:ring-[#007AFF]/15",
    outline: "border border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-[#F8FAFB] px-5 py-2.5 focus:ring-4 focus:ring-[#007AFF]/15 shadow-xs",
    danger: "bg-[#FF3B30] hover:bg-[#E63C32] text-white px-6 py-3 focus:ring-4 focus:ring-[#FF3B30]/20 shadow-sm",
    ghost: "bg-transparent text-[#007AFF] hover:bg-[#007AFF]/10 px-5 py-3 border-none",
    success: "bg-[#34C759] hover:bg-[#2DB04F] text-white px-6 py-3 focus:ring-4 focus:ring-[#34C759]/20 shadow-sm",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const loadingStyle = loading || disabled ? "opacity-60 cursor-not-allowed active:scale-100" : "cursor-pointer";

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

