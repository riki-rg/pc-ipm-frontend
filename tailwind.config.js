// Nama file: tailwind.config.js (INI CARA V3)

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
      // Kita nulisnya pake sintaks JavaScript (objek)
      colors: {
        'ipm-yellow-light': '#fcd34d',
        'ipm-yellow': '#FABC05',
        'ipm-yellow-dark': '#f59e0b',
        'ipm-green': '#10B981',
      },
      backgroundImage: {
        // Kita definisiin gradasi kita di sini
        'ipm-gradient': 'linear-gradient(to right, theme(colors.ipm-yellow-dark), theme(colors.ipm-yellow-light))',
      },
    },
  },
  plugins: [],
};