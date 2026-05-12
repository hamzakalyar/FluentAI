/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo-600
          light: '#6366F1',   // Indigo-500
        },
        secondary: {
          DEFAULT: '#0D9488', // Teal-600
          light: '#CCFBF1',   // Teal-100
        },
        navy: '#0F172A',      // Slate-950
        slate: {
          DEFAULT: '#334155', // Slate-700
          mid: '#64748B',     // Slate-500
          light: '#F1F5F9',   // Slate-100
        },
        amber: '#F59E0B',     // Amber-400
        border: '#E2E8F0',    // Slate-200
        error: '#EF4444',     // Red-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
