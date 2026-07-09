import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        healthcare: {
          primary: "#1E40AF",     // Primary Blue
          secondary: "#0D47A1",   // Secondary Blue
          accent: "#3B82F6",      // Accent Blue
          bgPrimary: "#FFFFFF",   // Background Primary
          bgSecondary: "#F9FAFB", // Background Secondary
          textDark: "#1F2937",    // Text Dark
          textMedium: "#6B7280",  // Text Medium
          textLight: "#9CA3AF",   // Text Light
          success: "#10B981",     // Success
          warning: "#F59E0B",     // Warning
          error: "#EF4444",       // Error
          border: "#E5E7EB",      // Border
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        standard: "8px",
      }
    },
  },
  plugins: [],
};

export default config;
