import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          dark: '#0051CC',
          light: '#DFF1FF',
        },
        secondary: {
          DEFAULT: '#FF6B6B',
          dark: '#E05252',
          light: '#FFE5E5',
        },
        accent: {
          DEFAULT: '#00D4FF',
          purple: '#8B5CF6',
          purpleLight: '#F3E8FF',
        },
        success: {
          DEFAULT: '#34C759',
          light: '#E8F8EC',
        },
        warning: {
          DEFAULT: '#FF9500',
          light: '#FFF4E5',
        },
        danger: {
          DEFAULT: '#FF3B30',
          light: '#FFEBEA',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        bg: {
          primary: '#FFFFFF',
          secondary: '#F8FAFB',
          dark: '#0F172A',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#334155',
        },
        healthcare: {
          primary: '#007AFF',
          secondary: '#0051CC',
          accent: '#00D4FF',
          doctor: '#FF6B6B',
          admin: '#8B5CF6',
          bgPrimary: '#FFFFFF',
          bgSecondary: '#F8FAFB',
          bgDark: '#0F172A',
          textDark: '#1F2937',
          textMedium: '#6B7280',
          textLight: '#9CA3AF',
          success: '#34C759',
          warning: '#FF9500',
          error: '#FF3B30',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
        display: ["Poppins", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        standard: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.08)",
        sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
        md: '0 4px 12px rgba(0, 0, 0, 0.12)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.15)',
        ringBlue: '0 0 0 3px rgba(0, 122, 255, 0.15)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
};

export default config;

