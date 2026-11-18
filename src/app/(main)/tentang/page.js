"use client"; 

import { useState, useEffect } from 'react'; 
import axios from 'axios';
import BackButton from '@/components/BackButton';
import { motion, AnimatePresence } from 'framer-motion'; 
import AnimatedCounter from '@/components/AnimatedCounter'; 
import BidangModal from '@/components/BidangModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default function TentangPage() {
  const [bidangs, setBidangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBidang, setSelectedBidang] = useState(null);

  const openModal = (bidang) => setSelectedBidang(bidang);
  const closeModal = () => setSelectedBidang(null);

  useEffect(() => {
    // Tembak API
    axios.get('/api/bidang')
      .then(res => {
        setBidangs(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full bg-ipm-paper dark:bg-gray-900">
      <div className="container mx-auto px-4 pb-5 pt-6 sm:px-6">
        <BackButton />
      </div>
      
      {/* ===== 1. HERO SECTION "TENTANG" ===== */}
      <motion.section
        className="hero-texture w-full py-20 text-white md:py-24"
        style={{ background: 'linear-gradient(135deg, #0B3D2E 0%, #14532D 100%)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <p className="mb-2 text-sm font-semibold text-ipm-yellow">Tentang PC IPM Mayong</p>
          <motion.h1 className="text-3xl font-extrabold md:text-5xl">
            Tentang Kami
          </motion.h1>
          <motion.p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-200 md:text-lg">
            Kami adalah Pimpinan Cabang Ikatan Pelajar Muhammadiyah Mayong yang bertumbuh bersama pelajar, ilmu, dan nilai keislaman.
          </motion.p>
        </div>
      </motion.section>

      
      {/* ===== 2. SECTION VISI & MISI ===== */}
      {/* Section ini background-nya 'bg-white', jadi harus kita cat */}
      <section className="relative overflow-hidden bg-ipm-green-gradient pt-20 pb-16 text-white"> {/* 2. "CAT" SECTION */ }
        <motion.div
          className="container mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // <-- Bug fix
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            
            {/* --- KOLOM VISI --- */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🎯</span>
                <h2 className="text-3xl font-bold text-white">
                  Visi Kami
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-200">
                &quot;Terwujudnya pelajar Muslim yang berilmu, berakhlak mulia...&quot;
              </p>
            </motion.div>

            {/* --- KOLOM MISI --- */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">✅</span>
                <h2 className="text-3xl font-bold text-white">
                  Misi Kami
                </h2>
              </div>
              <ul className="space-y-3 text-lg text-gray-200">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3 mt-1.5">●</span>
                  <span>Menanamkan nilai-nilai ke-Islam-an...</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3 mt-1.5">●</span>
                  <span>Mengembangkan potensi keilmuan...</span>
                </li>
                {/* ... (list lainnya) ... */}
              </ul>
            </motion.div>

          </div>
        </motion.div>
      </section>

      
      {/* ===== 3. SECTION STAT COUNTER ===== */}
      {/* Section ini udah 'bg-ipm-gradient', aman. Teksnya aja kita cat. */}
      <section className="w-full bg-ipm-gradient py-24">
        <motion.div
          className="container mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // <-- Bug fix
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
            
            {/* Teksnya udah 'text-gray-900' (item), jadi aman di background kuning */}
            <motion.div variants={itemVariants} className="text-gray-900">
              <h3 className="text-6xl font-extrabold">
                <AnimatedCounter targetNumber={50} />+
              </h3>
              <p className="mt-2 text-xl font-semibold">Kader Aktif</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-gray-900">
              <h3 className="text-6xl font-extrabold">
                <AnimatedCounter targetNumber={150} />+
              </h3>
              <p className="mt-2 text-xl font-semibold">Alumni & Demisioner</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-gray-900">
              <h3 className="text-6xl font-extrabold">
                <AnimatedCounter targetNumber={6} />
              </h3>
              <p className="mt-2 text-xl font-semibold">Bidang Aktif</p>
            </motion.div>

          </div>
        </motion.div>
      </section>
      
      {/* ===== 4. SECTION BIDANG KAMI (DINAMIS) ===== */}
      <section className="w-full bg-gray-50 py-16 dark:bg-gray-800 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6"> {/* Hapus motion.div di sini biar gak ganggu */}
          
          {/* Judul & Deskripsi (Animasi Standar) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
              Struktur Bidang Kami
            </h2>
            <p className="mb-12 mt-4 text-center text-lg text-gray-600 dark:text-gray-300">
              Klik kartu di bawah untuk melihat anggota bidang.
            </p>
          </motion.div>

          {/* GRID KARTU (LOGIC BARU) */}
          {loading ? (
             // Skeleton Loading
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {[1,2,3].map(i => <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse dark:bg-gray-700"/>)}
             </div>
          ) : (
            // Pake motion.div DI SINI, biar animasi baru mulai PAS data udah ada
            <motion.div 
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible" // Pemicu animasi saat scroll
              viewport={{ once: true, amount: 0.1 }}
            >
              {bidangs.map((bidang) => (
                <motion.div key={bidang.id} variants={itemVariants}>
                  <div
                    onClick={() => openModal(bidang)}
                    className="group flex h-full transform cursor-pointer flex-col items-center rounded-xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-700 dark:hover:shadow-ipm-yellow-dark/20"
                  >
                    <div className="mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">
                      {bidang.icon || '📂'} 
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {bidang.nama}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 dark:text-gray-300">
                      {bidang.deskripsi_singkat || "Klik untuk detail."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        <BidangModal 
          isOpen={!!selectedBidang} 
          onClose={closeModal}      
          bidang={selectedBidang}   
        />
      </AnimatePresence>

    </div>
  );
}