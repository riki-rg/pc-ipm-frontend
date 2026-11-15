"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { usePathname } from 'next/navigation'; // Buat ngecek URL
import { Calendar, User, MapPin, Clock } from 'lucide-react'; // Icon biar cakep

// Kita pake "use" dari React buat unwrap params (Next.js 15/16 terbaru butuh ini)
import { use } from 'react'; 

export default function DetailBeritaPage({ params }) {
  // Unwrapping params (Wajib di Next.js versi baru)
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Tembak API Berita berdasarkan slug
        const response = await axios.get(`/api/artikel/${slug}`);
        setData(response.data.data);
      } catch (error) {
        console.error("Gagal load berita:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Berita tidak ditemukan :(</div>;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
      
      {/* 1. HEADER GAMBAR FULL WIDTH */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        {data.gambar_header_url ? (
          <Image
            src={data.gambar_header_url.replace('/uploads/', '/storage/')}
            alt={data.judul}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">No Image</div>
        )}
        {/* Overlay Gelap biar tulisan kebaca */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto">
          <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
            Berita
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {data.judul}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-gray-200 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {data.tanggal_formatted}
            </div>
            <div className="flex items-center gap-2">
              <User size={18} />
              {data.user?.name || "Admin"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. KONTEN BERITA */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {/* Render HTML dari RichEditor Laravel */}
          <div dangerouslySetInnerHTML={{ __html: data.isi_konten }} />
        </article>
      </div>

    </div>
  );
}