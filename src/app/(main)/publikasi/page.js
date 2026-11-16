"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Kategori buat filter
const categories = [
  { id: 'all', label: 'Semua' },
  { id: 'berita', label: 'Berita' },
  { id: 'kajian', label: 'Kajian' },
  { id: 'kegiatan', label: 'Kegiatan' },
];

// Jumlah item per halaman
const ITEMS_PER_PAGE = 6;

export default function PublikasiPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [allData, setAllData] = useState([]);      // Data mentah semua
  const [displayData, setDisplayData] = useState([]); // Data setelah difilter
  const [loading, setLoading] = useState(true);
  
  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // --- 1. FETCH API GABUNGAN ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resBerita, resKajian, resKegiatan] = await Promise.all([
          axios.get('/api/artikel').catch(() => ({ data: { data: [] } })),
          axios.get('/api/kajian').catch(() => ({ data: { data: [] } })),
          axios.get('/api/kegiatan').catch(() => ({ data: { data: [] } }))
        ]);

        // Normalisasi (Samain Struktur)
        const berita = (resBerita.data.data || []).map(item => ({
          ...item, type: 'berita', label: 'Berita', color: 'bg-ipm-yellow/20 text-ipm-yellow-dark',
          dateSort: new Date(item.created_at), desc: stripHtml(item.isi_konten)
        }));
        const kajian = (resKajian.data.data || []).map(item => ({
          ...item, type: 'kajian', label: 'Kajian', color: 'bg-ipm-green/15 text-ipm-green-deep',
          dateSort: new Date(item.waktu), desc: stripHtml(item.deskripsi)
        }));
        const kegiatan = (resKegiatan.data.data || []).map(item => ({
          ...item, type: 'kegiatan', label: 'Kegiatan', color: 'bg-blue-100 text-blue-800',
          dateSort: new Date(item.waktu), desc: stripHtml(item.deskripsi)
        }));

        // Gabung & Sort
        const combined = [...berita, ...kajian, ...kegiatan].sort((a, b) => b.dateSort - a.dateSort);
        setAllData(combined);
        setDisplayData(combined);
      } catch (error) {
        console.error("Gagal load publikasi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. FILTER LOGIC ---
  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman 1 tiap ganti filter
    if (activeTab === 'all') {
      setDisplayData(allData);
    } else {
      setDisplayData(allData.filter(item => item.type === activeTab));
    }
  }, [activeTab, allData]);

  // --- 3. PAGINATION LOGIC ---
  const totalPages = Math.ceil(displayData.length / ITEMS_PER_PAGE);
  const paginatedData = displayData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const stripHtml = (html) => {
      // 1. Cek kalo datanya kosong (misal Poster), balikin teks default
      if (!html) return "Klik untuk melihat detail."; 

      // 2. Hapus tag HTML (<p>, <div>, dll)
      let text = html.replace(/<\/?[^>]+(>|$)/g, "");

      // 3. Ganti &nbsp; jadi spasi biasa (FIX MASALAH KEDUA LO)
      text = text.replace(/&nbsp;/g, " ");

      // 4. Potong jadi 100 karakter
      return text.substring(0, 100) + "...";
  };

  return (
    <div className="min-h-screen bg-ipm-paper pb-20">

      {/* HERO SECTION */}
      <motion.section
        className="w-full bg-ipm-green-gradient pt-20 pb-16 text-white"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="hero-texture absolute inset-0 opacity-0" aria-hidden="true" />
        <div className="relative container mx-auto px-6">
          <p className="mb-2 text-sm font-semibold text-ipm-yellow">Publikasi</p>
          <h1 className="text-3xl font-extrabold md:text-5xl">Publikasi Kami</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-200 md:text-lg">
            Jelajahi berita terbaru, kajian mendalam, dan rangkuman kegiatan seru dari PC IPM Mayong.
          </p>
        </div>
      </motion.section>

      {/* FILTER BAR (Sticky) */}
      <section className="w-full py-4 sticky top-[64px] z-40 bg-ipm-paper/90 backdrop-blur-md border-b border-gray-200 transition-colors">
        <div className="container mx-auto px-6 flex justify-center gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === cat.id
                ? 'bg-ipm-green-deep text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* GRID KONTEN */}
      <section className="w-full py-16 min-h-[60vh]">
        <div className="container mx-auto px-6">
          
          {loading ? (
             // SKELETON LOADING
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1,2,3,4,5,6].map(n => <div key={n} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"/>)}
             </div>
          ) : (
            <>
              {/* LIST ITEM */}
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {paginatedData.map((item) => (
                    <motion.div
                      key={`${item.type}-${item.id}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        href={`/publikasi/${item.type}/${item.slug}`}
                        className="group block h-full bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                      >
                        {/* GAMBAR */}
                        <div className="relative aspect-video w-full bg-gray-200">
                          <Image
                            src={item.gambar_header_url ? item.gambar_header_url.replace('/uploads/', '/storage/') : '/logo.png'}
                            alt={item.judul}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            unoptimized
                          />
                          <div className="absolute top-3 left-3">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.color}`}>
                               {item.label}
                             </span>
                          </div>
                        </div>

                        {/* TEKS */}
                        <div className="p-6">
                          <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                             📅 {item.tanggal_formatted || 'Baru saja'}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-ipm-green-soft transition-colors">
                            {item.judul}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* EMPTY STATE */}
              {displayData.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada konten untuk kategori ini.</p>
                </div>
              )}

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-16 gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        currentPage === page
                          ? 'bg-ipm-green-deep text-white shadow-md scale-110'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}