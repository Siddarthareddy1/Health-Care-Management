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
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Primary Indigo
          600: '#4F46E5', // Primary Dark
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8',
        },
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6', // Purple
          600: '#7C3AED',
          700: '#6D28D9',
        },
        accent: {
          DEFAULT: '#EC4899', // Pink accent
          500: '#EC4899',
          600: '#DB2777',
        },
        cyan: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4', // Cyan secondary accent
          600: '#0891B2',
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
          900: '#0F172A', // Dark section bg
          950: '#020617',
        },
        healthcare: {
          primary: '#6366F1',
          primaryDark: '#4F46E5',
          primaryLight: '#818CF8',
          purple: '#8B5CF6',
          accent: '#EC4899',
          cyan: '#06B6D4',
          bgPrimary: '#FFFFFF',
          bgSecondary: '#F8FAFC',
          bgTertiary: '#F1F5F9',
          bgDark: '#0F172A',
          textDark: '#0F172A',
          textMedium: '#475569',
          textLight: '#64748B',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        poppins: ["Poppins", "Inter", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '2xl': '1rem',
        'xl': '0.75rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(99, 102, 241, 0.1), 0 8px 10px -6px rgba(139, 92, 246, 0.05)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.35)',
        'glow-accent': '0 0 20px rgba(236, 72, 153, 0.35)',
        'glass': '0 8px 32px 0 rgba(99, 102, 241, 0.08)',
        'ring-indigo': '0 0 0 3px rgba(99, 102, 241, 0.2)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'accent-gradient': 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)',
        'soft-gradient': 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)' },
        },
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
