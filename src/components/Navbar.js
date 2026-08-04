"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import api from '@/lib/axios'; // IMPORT JEMBATAN API

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

  // AMBIL DATA DARI LARAVEL
  useEffect(() => {
    api.get('/pengaturan')
      .then(res => {
        if(res.data.status === 'success') setSetting(res.data.data);
      })
      .catch(err => console.error("Gagal load navbar:", err));
  }, []);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-md relative dark:bg-gray-900 dark:border-b dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo Dinamis */}
        {/* Logo Dinamis dengan perbaikan URL */}
        <Link href="/home" className="flex items-center space-x-3">
          {setting?.logo_url ? (
          <Image
            src={
              setting?.logo_url 
                ? setting.logo_url.replace('/uploads/logo/', '/storage/logo/') 
                : '/logo.png' 
            }
            width={40}
            height={40}
            alt="Logo PC IPM Mayong"
            className="object-contain"
            // Tambahkan unoptimized jika masih rewel (opsional)
            unoptimized 
            onError={(e) => {
              console.log("Next.js gagal akses ke:", e.target.src);
            }}
          />
          ) : (
            <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
          )}
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {setting?.nama_website || "PC IPM Mayong"}
          </span>
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