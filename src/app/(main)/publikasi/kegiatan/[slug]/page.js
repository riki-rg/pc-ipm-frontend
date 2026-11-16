"use client";

import { useEffect, useState, use } from 'react'; // Pakai 'use' buat params
import Image from 'next/image';
import axios from 'axios';
import BackButton from '@/components/BackButton';
import { Calendar, MapPin, Clock, Users } from 'lucide-react'; // Icon lengkap

export default function DetailKegiatanPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Tembak API Kegiatan
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Kegiatan tidak ditemukan :(</div>;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen
      <div className="container mx-auto px-6 pt-6">
        <BackButton />
      </div> pb-20">
      
      {/* 1. HEADER GAMBAR */}
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
          <div className="w-full h-full bg-blue-900 flex items-center justify-center text-white">No Poster Available</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
            Kegiatan
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {data.judul}
          </h1>
          
          {/* Info Baris 1: Waktu & Lokasi */}
          <div className="flex flex-wrap gap-6 text-gray-200 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-400" />
              {data.tanggal_formatted}
            </div>
            {data.lokasi && (
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-red-400" />
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