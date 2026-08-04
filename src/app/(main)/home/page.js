"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { motion } from 'framer-motion';
import HeroSlider from '@/components/HeroSlider';

export default function HomePage() {
  const [sorotan, setSorotan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemuaData = async () => {
      try {
        setLoading(true);
        // 1. Tembak 3 API sekaligus biar cepet
        const [resBerita, resKajian, resKegiatan] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/artikel'),
          axios.get('http://127.0.0.1:8000/api/kajian'),
          axios.get('http://127.0.0.1:8000/api/kegiatan')
        ]);

        // 2. Kasih label "tipe" biar kita tau mana yang berita/kajian/kegiatan
        const dataBerita = (resBerita.data.data || []).map(item => ({ ...item, tipe: 'Berita', warna: 'bg-yellow-100 text-yellow-700', folder: 'berita' }));
        const dataKajian = (resKajian.data.data || []).map(item => ({ ...item, tipe: 'Kajian', warna: 'bg-green-100 text-green-700', folder: 'kajian' }));
        const dataKegiatan = (resKegiatan.data.data || []).map(item => ({ ...item, tipe: 'Kegiatan', warna: 'bg-blue-100 text-blue-700', folder: 'kegiatan' }));

        // 3. Gabungin semua jadi satu array
        const gabungan = [...dataBerita, ...dataKajian, ...dataKegiatan];

        // 4. Urutin dari yang paling baru (berdasarkan created_at)
        const sorted = gabungan.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // 5. Ambil 4 teratas buat ditampilin
        setSorotan(sorted.slice(0, 4));
      } catch (error) {
        console.error("Gagal ambil data sorotan gabungan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemuaData();
  }, []);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "...";
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[calc(100vh-64px)] flex-col-reverse items-center justify-center px-6 py-12 md:flex-row md:space-x-12">
        <div className="mt-12 w-full text-center md:mt-0 md:w-1/2 md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 md:text-6xl dark:text-gray-100">
            Bergerak, Berilmu,<br />
            <span className="bg-ipm-gradient bg-clip-text text-transparent">Mencerahkan.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 md:text-xl dark:text-gray-300">
            Selamat datang di Website resmi PC IPM Mayong. Pusat informasi, kegiatan, dan kajian Ikatan Pelajar Muhammadiyah.
          </p>
          <div className="mt-10">
            <Link href="/tentang" className="rounded-full bg-ipm-gradient px-10 py-4 text-lg font-bold text-gray-900 shadow-lg">
              Kenali Kami Lebih Jauh
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <HeroSlider />
        </div>
      </section>

      {/* Section Sorotan Dinamis */}
      <section className="w-full bg-gray-50 py-24 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">Sorotan Terbaru Kami</h2>
          <p className="mb-12 mt-4 text-center text-lg text-gray-600 dark:text-gray-300">Campuran berita, kajian, dan kegiatan terbaru dari kami.</p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
              ))
            ) : sorotan.length > 0 ? (
              sorotan.map((item) => (
                <motion.div key={`${item.tipe}-${item.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Link
                    href={`/publikasi/${item.folder}/${item.slug}`}
                    // 1. PINDAHIN EFEK ZOOM KE SINI (hover:scale-105)
                    // Hapus 'hover:-translate-y-2' kalau mau murni zoom, atau gabungin aja gpp.
                    // Di sini gua ganti translate jadi scale biar "Zoom In" satu badan.
                    className="group block h-full overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-gray-700"
                  >
                    <div className="relative aspect-video w-full bg-gray-200">
                      <Image
                        src={item.gambar_header_url ? item.gambar_header_url.replace('/uploads/', '/storage/') : '/logo.png'}
                        alt={item.judul}
                        fill
                        // 2. HAPUS 'group-hover:scale-110' DARI SINI
                        // Biar gambarnya diem aja ngikutin kotaknya
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${item.warna}`}>
                          {item.tipe}
                        </span>
                        <span className="text-[10px] text-gray-400">{item.tanggal_formatted || 'Baru saja'}</span>
                      </div>
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-gray-100">{item.judul}</h3>
                      <p className="line-clamp-3 text-xs text-gray-600 dark:text-gray-300">{stripHtml(item.isi_konten || item.deskripsi)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">Tidak ada data untuk ditampilkan.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}