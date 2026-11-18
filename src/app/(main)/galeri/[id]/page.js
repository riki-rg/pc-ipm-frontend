"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowLeft, X, ZoomIn } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function DetailGaleriPage({ params }) {
  // Ambil ID album dari parameter rute.
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Gambar yang sedang dibuka dalam tampilan layar penuh.
  const [selectedImage, setSelectedImage] = useState(null);

  // Ambil detail album dari API.
  useEffect(() => {
    if (id) {
      axios.get(`/api/galeri/${id}`)
        .then(res => {
          setAlbum(res.data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-ipm-paper text-gray-700 dark:bg-gray-900 dark:text-gray-200">Memuat album…</div>;
  if (!album) return <div className="flex min-h-screen items-center justify-center bg-ipm-paper px-4 text-center text-gray-700 dark:bg-gray-900 dark:text-gray-200">Album tidak ditemukan.</div>;

  // Sesuaikan URL gambar ke jalur penyimpanan publik.
  const fixUrl = (url) => url ? url.replace('/uploads/', '/storage/') : '/logo.png';

  return (
    <div className="min-h-screen bg-ipm-paper pb-20 dark:bg-gray-900">
      <div className="container mx-auto px-4 pb-5 pt-6 sm:px-6">
        <BackButton />
      </div>
      
      {/* ===== 1. HERO HEADER (COVER ALBUM) ===== */}
      <div className="relative flex min-h-[22rem] w-full items-end sm:min-h-[26rem] md:h-[60vh]">
        {/* Background Image Blur */}
        <div className="absolute inset-0">
          <Image
            src={fixUrl(album.cover_url)}
            alt={album.judul}
            fill
            className="object-cover brightness-50 blur-[2px]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        {/* Konten Judul */}
        <div className="relative z-10 container mx-auto px-4 pb-10 text-white sm:px-6 sm:pb-12">
          <Link
            href="/galeri"
            className="mb-6 inline-flex min-h-11 items-center gap-2 text-gray-300 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} /> Kembali ke Galeri
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3">
             <span className="rounded-full bg-ipm-yellow px-3 py-1 text-xs font-bold text-ipm-green-deep">
               {album.kategori}
             </span>
             <span className="flex items-center gap-2 text-sm text-gray-300">
               <Calendar aria-hidden="true" size={16} />
               {new Date(album.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
             </span>
          </div>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
            {album.judul}
          </h1>
          
          {album.deskripsi && (
            <p className="text-gray-200 text-lg max-w-2xl line-clamp-3">
              {album.deskripsi}
            </p>
          )}
        </div>
      </div>


      {/* ===== 2. GRID DOKUMENTASI (FOTO-FOTO) ===== */}
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-8 border-l-4 border-ipm-yellow pl-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Dokumentasi Kegiatan
        </h2>

        {/* Cek apakah ada foto di dalam album */}
        {album.foto_galeri && album.foto_galeri.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {album.foto_galeri.map((foto, index) => (
              <motion.div
                key={foto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                role="button"
                tabIndex={0}
                aria-label={`Perbesar foto dokumentasi ${index + 1}`}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700"
                onClick={() => setSelectedImage(fixUrl(foto.foto_url))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedImage(fixUrl(foto.foto_url));
                  }
                }}
              >
                <Image
                  src={fixUrl(foto.foto_url)}
                  alt={`Dokumentasi ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                
                {/* Overlay Hover */}
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                  <ZoomIn className="text-white drop-shadow-md" size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-300">Belum ada dokumentasi yang diunggah di album ini.</p>
          </div>
        )}
      </div>


      {/* ===== 3. LIGHTBOX (POP-UP FULLSCREEN) ===== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              aria-label="Tutup gambar"
              className="absolute right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 sm:right-6 sm:top-6"
              onClick={() => setSelectedImage(null)}
            >
              <X aria-hidden="true" size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative h-[min(80vh,80svh)] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={`Pratinjau foto dokumentasi ${album.judul}`}
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}