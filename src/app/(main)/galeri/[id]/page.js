"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowLeft, X, ZoomIn } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function DetailGaleriPage({ params }) {
  // 1. Unwrap Params (Wajib di Next.js baru)
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State buat Lightbox (Pop-up Foto Fullscreen)
  const [selectedImage, setSelectedImage] = useState(null);

  // 2. FETCH DATA DETAIL ALBUM
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Album...</div>;
  if (!album) return <div className="min-h-screen flex items-center justify-center">Album tidak ditemukan :(</div>;

  // Helper url gambar
  const fixUrl = (url) => url ? url.replace('/uploads/', '/storage/') : '/logo.png';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-6 pt-6 pb-5">
        <BackButton />
      </div>
      
      {/* ===== 1. HERO HEADER (COVER ALBUM) ===== */}
      <div className="relative w-full h-[50vh] md:h-[60vh] flex items-end">
        {/* Background Image Blur */}
        <div className="absolute inset-0">
          <Image
            src={fixUrl(album.cover_url)}
            alt={album.judul}
            fill
            className="object-cover brightness-50 blur-[2px]" // Efek gelap & blur dikit
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        {/* Konten Judul */}
        <div className="relative container mx-auto px-6 pb-12 z-10 text-white">
          <Link 
            href="/galeri"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} /> Kembali ke Galeri
          </Link>

          <div className="flex items-center gap-3 mb-4">
             <span className="bg-ipm-yellow-main text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               {album.kategori}
             </span>
             <span className="flex items-center gap-2 text-sm text-gray-300">
               <Calendar size={16} />
               {new Date(album.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
             </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
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
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 border-l-4 border-ipm-yellow-main pl-4">
          Dokumentasi Kegiatan
        </h2>

        {/* Cek apakah ada foto di dalam album */}
        {album.foto_galeri && album.foto_galeri.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.foto_galeri.map((foto, index) => (
              <motion.div
                key={foto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-200"
                onClick={() => setSelectedImage(fixUrl(foto.foto_url))}
              >
                <Image
                  src={fixUrl(foto.foto_url)}
                  alt={`Dokumentasi ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                
                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-white drop-shadow-md" size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-300">
            <p className="text-gray-500">Belum ada dokumentasi yang diunggah di album ini.</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)} // Klik luar buat tutup
          >
            {/* Tombol Close */}
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>

            {/* Gambar Fullscreen */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-5xl h-[80vh]"
              onClick={(e) => e.stopPropagation()} // Biar klik gambar gak nutup
            >
              <Image
                src={selectedImage}
                alt="Fullscreen Preview"
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