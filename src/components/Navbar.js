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
      <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-2.5 sm:gap-4 sm:py-3">

        <Link href="/home" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 min-[1280px]:flex-none" aria-label="PC IPM Mayong - Beranda">
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
          <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">PC IPM Mayong</span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
                  <div className="hidden items-center gap-4 min-[1280px]:flex 2xl:gap-6">
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

          <div className="min-[1280px]:hidden">
                      <button
                        type="button"
                        aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-navigation"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-800 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? (
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
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
            id="mobile-navigation"
            className="absolute left-0 top-full w-full border-t border-gray-200 bg-ipm-paper shadow-xl dark:border-gray-800 dark:bg-gray-900 min-[1280px]:hidden"
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
