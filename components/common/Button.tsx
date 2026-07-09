import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
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
    "inline-flex items-center justify-center font-semibold rounded-standard transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm shadow-subtle font-sans";
  
  const variants = {
    primary: "bg-healthcare-primary hover:bg-healthcare-secondary text-white focus:ring-healthcare-primary",
    secondary: "bg-healthcare-accent hover:bg-healthcare-primary text-white focus:ring-healthcare-accent",
    outline: "border border-healthcare-border text-healthcare-textDark hover:bg-healthcare-bgSecondary focus:ring-healthcare-primary bg-white",
    danger: "bg-healthcare-error hover:bg-red-700 text-white focus:ring-healthcare-error",
    success: "bg-healthcare-success hover:bg-emerald-600 text-white focus:ring-healthcare-success",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const loadingStyle = loading || disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";

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
