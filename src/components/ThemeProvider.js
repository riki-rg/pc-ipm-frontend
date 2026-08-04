// Nama file: src/components/ThemeProvider.js

"use client";

import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';

// Kita bikin komponen "pembungkus" ini
export function NextThemeProvider({ children }) {
  // Ini "jurus" biar 'hydration mismatch' error-nya ilang
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use a function to batch setState to avoid cascading renders
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Kalo di server, jangan render apa-apa
    // Kalo di client, baru render ThemeProvider
    return null; 
  }

  return (
    <ThemeProvider 
      attribute="class" // Ini KUNCINYA!
      defaultTheme="light" // Default-nya tema putih (light)
      enableSystem={false} // Kita 'false' aja biar gak ngikutin OS
    >
      {children}
    </ThemeProvider>
  );
}