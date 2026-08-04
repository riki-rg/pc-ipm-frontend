// Nama file: src/components/AnimatedCounter.js

"use client";

import { useEffect, useRef } from 'react';
import { animate, useInView, useMotionValue, useTransform } from 'framer-motion';
import { motion } from 'framer-motion'; // Kita perlu motion.span

/**
 * Komponen ini adalah "angka pinter" yang akan
 * menghitung naik dari 0 ke targetNumber pas di-scroll.
 */
export default function AnimatedCounter({ targetNumber }) {
  // 1. Bikin "tempat" buat nyimpen angka animasinya
  const count = useMotionValue(0); 

  // 2. Bikin "transformer" buat buletin angkanya (biar gak 1.2, 1.3, dst)
  const rounded = useTransform(count, (latest) => Math.round(latest));

  // 3. Bikin "mata" buat ngeliat kapan komponen ini masuk layar
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,    // Animasinya sekali aja
    margin: "-100px" // Jalanin animasi 100px *sebelum* bener-bener nyampe layar
  });

  // 4. Bikin "trigger"
  useEffect(() => {
    // Kalo "mata"-nya ngeliat komponen ini...
    if (isInView) {
      // ...jalanin animasi!
      animate(count, targetNumber, {
        duration: 2, // Animasi jalan 2 detik
        ease: "easeOut" // Mulai cepet, selesai lambat (smooth)
      });
    }
  }, [isInView, count, targetNumber]); // Kalo 3 hal ini berubah

  // 5. Tampilkan!
  // Kita bungkus pake <span> biasa biar 'ref'-nya bisa nempel
  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
    </span>
  );
}