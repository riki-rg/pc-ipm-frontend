"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import axios from 'axios';
import BackButton from '@/components/BackButton';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

export default function DetailKegiatanPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil detail kegiatan dari API.
        const response = await axios.get(`/api/kegiatan/${slug}`);
        setData(response.data.data);
      } catch (error) {
        console.error("Gagal load kegiatan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-ipm-paper text-gray-700 dark:bg-gray-900 dark:text-gray-200">Memuat kegiatan…</div>;
  if (!data) return <div className="flex min-h-screen items-center justify-center bg-ipm-paper px-4 text-center text-gray-700 dark:bg-gray-900 dark:text-gray-200">Kegiatan tidak ditemukan.</div>;

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
          <div className="flex h-full w-full items-center justify-center bg-ipm-green-deep px-4 text-center text-white">Poster kegiatan belum tersedia.</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        <div className="container absolute bottom-0 left-0 mx-auto w-full px-4 pb-8 sm:px-6 sm:pb-10 md:pb-12">
          <span className="mb-4 inline-block rounded-full bg-ipm-yellow px-3 py-1 text-sm font-bold text-ipm-green-deep">
            Kegiatan
          </span>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {data.judul}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-200 sm:gap-6 md:text-base">
            <div className="flex items-center gap-2">
              <Calendar aria-hidden="true" size={18} className="text-ipm-yellow" />
              {data.tanggal_formatted}
            </div>
            {data.lokasi && (
              <div className="flex items-center gap-2">
                <MapPin aria-hidden="true" size={18} className="text-ipm-yellow" />
                {data.lokasi}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* 2. KOLOM KIRI: DESKRIPSI UTAMA */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-4">Tentang Kegiatan</h2>
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.deskripsi }} />
          </article>
        </div>

        {/* 3. KOLOM KANAN: SIDEBAR INFO */}
        <div className="space-y-8">
            
          {/* Box Panitia */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Users size={20} className="text-blue-500" />
              Panitia / Pengurus
            </h3>
            
            {data.penguruses && data.penguruses.length > 0 ? (
              <ul className="space-y-3">
                {data.penguruses.map((panitia) => (
                  <li key={panitia.id} className="flex items-center gap-3">
                    {/* Kalau ada foto pengurus, tampilin. Kalau gak, inisial aja */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {panitia.nama_lengkap.charAt(0)}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {panitia.nama_lengkap}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Belum ada data panitia.</p>
            )}
          </div>

          {/* Box Waktu Detail */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock size={20} className="text-orange-500" />
              Detail Waktu
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
                Mulai: <span className="font-semibold">{data.tanggal_formatted}</span>
            </p>
            {/* Kalau ada waktu selesai, tampilin juga */}
            {data.waktu_selesai && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Selesai: <span className="font-semibold">
                        {new Date(data.waktu_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}