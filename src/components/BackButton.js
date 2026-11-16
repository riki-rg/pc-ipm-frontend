"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

/**
 * Tombol kembali konsisten untuk semua halaman detail/list.
 * Navigasi via router.back() agar kembali ke posisi scroll semula.
 */
export default function BackButton({ label = 'Kembali' }) {
  const router = useRouter();

  return (
    <motion.button
      type="button"
      onClick={() => router.back()}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full border-2 border-ipm-green-deep/30 px-4 py-2 text-sm font-semibold text-ipm-green-deep transition-colors hover:border-ipm-green-deep hover:bg-ipm-green-deep hover:text-white"
      aria-label={`Kembali ke halaman sebelumnya`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      {label}
    </motion.button>
  );
}
