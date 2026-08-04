// Nama file: src/components/ThemeSwitcher.js

"use client";

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Buat animasi ganti ikon

// --- Ikon SVG Matahari ---
const SunIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

// --- Ikon SVG Bulan ---
const MoonIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

// --- Varian Animasi Ikon (Biar muter) ---
const iconVariants = {
  hidden: { rotate: -90, scale: 0, opacity: 0 },
  visible: { rotate: 0, scale: 1, opacity: 1 },
  exit: { rotate: 90, scale: 0, opacity: 0 },
};

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  // 'useTheme' adalah "remote control" dari next-themes
  const { theme, setTheme } = useTheme();

  // Efek "mounted" (Sama kayak di ThemeProvider)
  useEffect(() => {
    // Use a function to batch setState to avoid cascading renders
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Kalo belum 'mounted' (pas di server), kita render placeholder
  // Ini PENTING buat ngilangin 'hydration mismatch'
  if (!mounted) {
    return (
      <button className="w-10 h-10 p-2 rounded-full" aria-label="Loading theme...">
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')} // Logika ganti tema
      className="w-10 h-10 p-2 rounded-full transition-colors hover:bg-gray-100"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* 'AnimatePresence' nanganin animasi pas ikonnya ganti */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'moon' : 'sun'} // Kuncinya ganti, ikonnya bakal animasi
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}