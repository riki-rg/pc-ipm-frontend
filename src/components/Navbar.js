"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';

const dummyMenu = [
  { name: 'Home', href: '/home' },
  { name: 'Tentang Kami', href: '/tentang' },
  { name: 'Publikasi', href: '/publikasi' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Kontak', href: '/kontak' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [setting, setSetting] = useState(null); // STATE BUAT SIMPEN DATA API

  // Fetch directly from the public API path so this works regardless of axios baseURL.
  useEffect(() => {
    let active = true;
    fetch('/api/pengaturan', { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        if (active && payload?.status === 'success') setSetting(payload.data);
      })
      .catch((err) => console.error('Gagal memuat pengaturan navbar:', err));
    return () => { active = false; };
  }, []);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-ipm-paper/90 shadow-sm backdrop-blur relative dark:bg-gray-900 dark:border-b dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        <Link href="/home" className="flex items-center gap-3" aria-label="PC IPM Mayong - Beranda">
          {setting?.logo_url ? (
            <img
              src={setting.logo_url}
              width="40"
              height="40"
              alt="Logo PC IPM Mayong"
              className="h-10 w-10 shrink-0 object-contain"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span aria-hidden="true" className="h-10 w-10 shrink-0 rounded-full bg-ipm-green-deep/10" />
          )}
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">PC IPM Mayong</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            {dummyMenu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <ThemeSwitcher />

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 h-8 p-1 rounded text-gray-800 dark:text-gray-200"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl dark:bg-gray-900 dark:border-t dark:border-gray-800"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col p-4 space-y-2">
              {dummyMenu.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-gray-700 p-3 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
