// Nama file: app/page.js

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SplashPage() {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // --- ROMBAKAN DIMULAI DI SINI ---
  // Kita bikin varian animasi KHUSUS buat tombol
  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 } // Transisi masuk standar
    },
    // Ini dia ide barunya: state "pulse"
    pulse: {
      scale: [1, 1.05, 1], // Animasi membesar-mengecil (100% -> 105% -> 100%)
      transition: {
        duration: 2, // Durasi 2 detik
        repeat: Infinity, // Ulangi selamanya
        ease: "easeInOut",
      }
    }
  };
  // --- ROMBAKAN VARIAN SELESAI ---

  return (
    <motion.main
      className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* Background Foto Kami */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/foto-kami.jpg"
          alt="Foto Pengurus PC IPM Mayong"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </motion.div>

      
      <motion.div 
        className="flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Logo IPM */}
        <motion.div variants={itemVariants}>
          <Image
            src="/logo.png"
            alt="Logo PC IPM Mayong"
            width={100}
            height={100}
            className="mb-4"
          />
        </motion.div>

        {/* Tulisan PC IPM */}
        <motion.h1 
          className="mb-2 text-3xl font-bold text-white md:text-5xl"
          variants={itemVariants}
        >
          Pimpinan Cabang
        </motion.h1>

        {/* --- ROMBAKAN WARNA & EFEK TEKS --- */}
        <motion.h2 
          className="mb-10 text-4xl font-extrabold text-yellow-500 drop-shadow-md md:text-6xl" // GANTI ke yellow-500 + drop-shadow
          variants={itemVariants}
        >
          IPM MAYONG
        </motion.h2>

        {/* --- ROMBAKAN ANIMASI TOMBOL --- */}
        <motion.div 
          variants={buttonVariants} // Pake varian tombol yang baru
          animate={["visible", "pulse"]} // Animasikan "visible" (masuk) DAN "pulse" (denyut)
        >
          <Link
            href="/home"
            className="rounded-full bg-yellow-500 px-10 py-4 text-xl font-bold text-gray-900 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:bg-yellow-400"
          >
            PC IPM MAYONG
          </Link>
        </motion.div>
        
      </motion.div>
    </motion.main>
  );
}