"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link'; 
import Image from 'next/image';
import axios from 'axios';
import BackButton from '@/components/BackButton';

const kategoriFilter = ['Semua', 'Kegiatan', 'Kajian', 'Lainnya'];
const ITEMS_PER_PAGE = 6; 

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

export default function GaleriPage() {
  const [albums, setAlbums] = useState([]); // Data API
  const [loading, setLoading] = useState(true);
  const [filterAktif, setFilterAktif] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  // --- 1. FETCH API ---
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/galeri');
        setAlbums(response.data.data);
      } catch (error) {
        console.error("Gagal load galeri:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  // --- 2. FILTER LOGIC ---
  const filteredAlbums = albums.filter(item => {
    if (filterAktif === 'Semua') return true;
    // Pastikan case huruf sama (Database lo mungkin 'Kegiatan', filter juga 'Kegiatan')
    return item.kategori === filterAktif;
  });

  // --- 3. PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredAlbums.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAlbums = filteredAlbums.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterAktif]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-ipm-paper dark:bg-gray-900">
      <div className="container mx-auto px-6 pt-6 pb-5">
        <BackButton />
      </div>
      
      {/* HERO SECTION */}
      <motion.section 
        className="relative overflow-hidden bg-ipm-green-gradient pt-20 pb-16 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-extrabold md:text-5xl text-white">
            Galeri Jejak Langkah
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-200 md:text-lg">
            Visual adalah cerita. Lihat rangkuman momen dan keseruan kami dalam bentuk album foto & video.
          </p>
        </div>
      </motion.section>

      {/* FILTER BUTTON */}
      <section className="w-full py-8 sticky top-[64px] z-40 bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {kategoriFilter.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setFilterAktif(kategori)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  filterAktif === kategori 
                    ? 'bg-ipm-gradient text-gray-900 shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {kategori}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* GRID ALBUM */}
      <section className="w-full bg-gray-50 py-24 min-h-[60vh] dark:bg-gray-800">
        <div className="container mx-auto px-6">
          
          {loading ? (
             // SKELETON LOADING
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
               {[1,2,3].map(n => <div key={n} className="h-64 bg-gray-200 rounded-xl animate-pulse"/>)}
             </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {currentAlbums.map((album) => (
                  <motion.div
                    key={album.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    {/* Link ke Detail Album (Pake ID karena di model lo gak ada slug) */}
                    <Link
                      href={`/galeri/${album.id}`}
                      className="group block transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-700"
                    >
                      <div className="relative aspect-video w-full bg-gray-200">
                        {/* GAMBAR DARI API */}
                        <Image
                            src={album.cover_url ? album.cover_url.replace('/uploads/', '/storage/') : '/logo.png'}
                            alt={album.judul}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            unoptimized
                        />
                        
                        {/* Overlay */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                          <span className="mb-2 inline-block rounded-md bg-yellow-400/90 px-2 py-0.5 text-xs font-bold text-black">
                            {album.kategori}
                          </span>
                          <h3 className="text-xl font-bold text-white line-clamp-1">
                            {album.judul}
                          </h3>
                          <span className="text-sm text-gray-300">
                             {/* foto_galeri_count diambil dari withCount di Controller */}
                            {album.foto_galeri_count || 0} Foto
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pesan Kalo Kosong */}
          {!loading && currentAlbums.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Oops! Belum ada album di kategori &quot;{filterAktif}&quot;.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* PAGINATION */}
      <section className="w-full bg-gray-50 pb-24 dark:bg-gray-800">
        <div className="container mx-auto px-6 flex justify-center">
          {totalPages > 1 && (
            <div className="flex items-center space-x-2 rounded-lg bg-white p-2 shadow-md dark:bg-gray-700">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-50 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-md font-semibold transition ${
                    currentPage === page
                      ? 'bg-ipm-yellow-dark text-gray-900'
                      : 'hover:bg-yellow-50 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-50 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}