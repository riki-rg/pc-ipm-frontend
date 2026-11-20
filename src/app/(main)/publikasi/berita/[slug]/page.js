"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import BackButton from '@/components/BackButton';
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

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-ipm-paper text-gray-700 dark:bg-gray-900 dark:text-gray-200">Memuat berita…</div>;
  if (!data) return <div className="flex min-h-screen items-center justify-center bg-ipm-paper px-4 text-center text-gray-700 dark:bg-gray-900 dark:text-gray-200">Berita tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-ipm-paper pb-20 dark:bg-gray-900">
      <div className="container mx-auto px-4 pb-5 pt-6 sm:px-6">
        <BackButton />
      </div>
      
      <div className="relative h-[360px] w-full sm:h-[420px] md:h-[500px]">
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
          <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200">Gambar belum tersedia.</div>
        )}
        {/* Lapisan gelap menjaga teks tetap terbaca di atas foto. */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="container absolute bottom-0 left-0 mx-auto w-full px-4 pb-8 sm:px-6 sm:pb-10 md:pb-12">
          <span className="mb-4 inline-block rounded-full bg-ipm-yellow px-3 py-1 text-sm font-bold text-ipm-green-deep">
            Berita
          </span>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {data.judul}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-200 sm:gap-6 md:text-base">
            <div className="flex items-center gap-2">
              <Calendar aria-hidden="true" size={18} />
              {data.tanggal_formatted}
            </div>
            <div className="flex items-center gap-2">
              <User aria-hidden="true" size={18} />
              {data.author?.id ? <Link href={`/pengurus/${data.author.id}`} className="underline decoration-ipm-yellow underline-offset-4 hover:text-ipm-yellow">{data.author.name}</Link> : "Tim redaksi"}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {/* Konten berita dari editor. */}
          <div dangerouslySetInnerHTML={{ __html: data.isi_konten }} />
        </article>
      </div>

    </div>
  );
}