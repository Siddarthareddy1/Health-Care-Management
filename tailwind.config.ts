import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        primary: {
          DEFAULT: '#0F766E',
          dark: '#115E59',
          light: '#F0FDFA',
          accent: '#0284C7',
        },
        secondary: {
          DEFAULT: '#64748B',
          light: '#F8FAFC',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEF2F2',
        },
        slate: {
          25: '#FCFCFD',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        healthcare: {
          primary: '#0F766E',
          secondary: '#0284C7',
          accent: '#14B8A6',
          doctor: '#0D9488',
          admin: '#4F46E5',
          bgPrimary: '#FFFFFF',
          bgSecondary: '#F8FAFC',
          bgDark: '#0F172A',
          textDark: '#0F172A',
          textMedium: '#475569',
          textLight: '#94A3B8',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '2xl': '1rem',
        'xl': '0.75rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'glass': '0 8px 32px 0 rgba(15, 118, 110, 0.06)',
        'ring-teal': '0 0 0 3px rgba(13, 148, 136, 0.15)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;


