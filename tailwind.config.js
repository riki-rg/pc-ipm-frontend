// Nama file: tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ipm-yellow-light': '#fcd34d',
        'ipm-yellow': '#FABC05',
        'ipm-yellow-dark': '#f59e0b',
        'ipm-green': '#10B981',
        'ipm-green-deep': '#0B3D2E',
        'ipm-green-soft': '#14532D',
        'ipm-paper': '#FAFAF5',
        'ipm-ink': '#1A1A1A',
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
      backgroundImage: {
        'ipm-gradient': 'linear-gradient(to right, theme(colors.ipm-yellow-dark), theme(colors.ipm-yellow-light))',
        'ipm-green-gradient': 'linear-gradient(135deg, #0B3D2E 0%, #14532D 100%)',
      },
    },
  },
  plugins: [],
};
