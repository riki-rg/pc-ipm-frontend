"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import HeroSlider from '@/components/HeroSlider';

export default function HomePage() {
  const [sorotan, setSorotan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemuaData = async () => {
      try {
        setLoading(true);
        const [resBerita, resKajian, resKegiatan] = await Promise.all([
          axios.get('/api/artikel'),
          axios.get('/api/kajian'),
          axios.get('/api/kegiatan'),
        ]);

        const dataBerita = (resBerita.data.data || []).map((item) => ({
          ...item,
          tipe: 'Berita',
          folder: 'berita',
          warna: 'bg-ipm-yellow/20 text-ipm-yellow-dark',
        }));
        const dataKajian = (resKajian.data.data || []).map((item) => ({
          ...item,
          tipe: 'Kajian',
          folder: 'kajian',
          warna: 'bg-ipm-green/15 text-ipm-green-deep',
        }));
        const dataKegiatan = (resKegiatan.data.data || []).map((item) => ({
          ...item,
          tipe: 'Kegiatan',
          folder: 'kegiatan',
          warna: 'bg-blue-100 text-blue-800',
        }));

        const gabungan = [...dataBerita, ...dataKajian, ...dataKegiatan];
        const sorted = gabungan.sort((a, b) => {
          const dateA = a.tanggal_publish || a.waktu || a.created_at;
          const dateB = b.tanggal_publish || b.waktu || b.created_at;
          return new Date(dateB) - new Date(dateA);
        });
        setSorotan(sorted.slice(0, 4));
      } catch (error) {
        console.error('Gagal ambil data sorotan gabungan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemuaData();
  }, []);

  const stripHtml = (html) => {
    if (!html) return '';
    const plainText = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
      .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
      .replace(/\s+/g, ' ')
      .trim();
    return plainText.length > 120 ? `${plainText.slice(0, 120).trimEnd()}…` : plainText;
  };

  const gambarSrc = (item) =>
    item.gambar_header_url ? item.gambar_header_url.replace('/uploads/', '/storage/') : '/logo.png';

  const featured = sorotan[0];
  const sisanya = sorotan.slice(1, 4);

  return (
    <div className="w-full bg-ipm-paper dark:bg-gray-900">
      {/* ===== HERO: panel hijau tua dengan tekstur, konten asimetris ===== */}
      <section className="relative overflow-hidden bg-ipm-green-gradient text-white">
        <div className="hero-texture absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative container mx-auto flex min-h-[calc(100vh-72px)] flex-col-reverse items-center gap-10 px-6 py-16 md:flex-row md:gap-14">
          <div className="w-full text-center md:w-1/2 md:text-left">
            <p className="mb-3 text-sm font-semibold tracking-wide text-ipm-yellow">
              Pimpinan Cabang Ikatan Pelajar Muhammadiyah
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Bergerak, Berilmu,
              <br />
              <span className="text-ipm-yellow">Mencerahkan.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-gray-200 md:mx-0 md:text-lg">
              Pusat informasi kegiatan, kajian, dan publikasi resmi PC IPM Mayong —
              wadah pelajar Muhammadiyah untuk bergerak dan mengilmu bersama.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link
                href="/tentang"
                className="rounded-full bg-ipm-yellow px-8 py-3.5 text-base font-bold text-ipm-green-deep transition-transform hover:scale-105"
              >
                Kenali Kami
              </Link>
              <Link
                href="/publikasi"
                className="rounded-full border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:border-ipm-yellow hover:text-ipm-yellow"
              >
                Baca Publikasi
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <HeroSlider />
          </div>
        </div>
        <div className="accent-rule absolute bottom-0 left-0 w-full" aria-hidden="true" />
      </section>

      {/* ===== SOROTAN: 1 featured besar + 3 kecil ===== */}
      <section className="w-full py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="accent-rule mb-4 w-16" aria-hidden="true" />
              <h2 className="text-3xl font-extrabold text-ipm-ink dark:text-gray-100">Sorotan Terbaru</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Berita, kajian, dan kegiatan terbaru dari kami.
              </p>
            </div>
            <Link
              href="/publikasi"
              className="hidden shrink-0 rounded-full border-2 border-ipm-green-deep px-5 py-2 text-sm font-semibold text-ipm-green-deep transition-colors hover:bg-ipm-green-deep hover:text-white dark:border-ipm-yellow/70 dark:text-ipm-yellow dark:hover:bg-ipm-yellow dark:hover:text-ipm-green-deep sm:block"
            >
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-96 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="grid gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-28 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            </div>
          ) : sorotan.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Featured */}
              {featured && (
                <Link
                  href={`/publikasi/${featured.folder}/${featured.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-xl dark:bg-gray-800 dark:ring-gray-700"
                >
                  <div className="relative aspect-[16/10] w-full bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={gambarSrc(featured)}
                      alt={featured.judul}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${featured.warna}`}
                    >
                      {featured.tipe}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {featured.tanggal_formatted || 'Baru saja'}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-2xl font-bold text-ipm-ink dark:text-gray-100">
                      {featured.judul}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {stripHtml(featured.isi_konten || featured.deskripsi)}
                    </p>
                  </div>
                </Link>
              )}

              {/* 3 kecil horizontal */}
              <div className="flex flex-col gap-6">
                {sisanya.map((item) => (
                  <Link
                    key={`${item.tipe}-${item.id}`}
                    href={`/publikasi/${item.folder}/${item.slug}`}
                    className="group flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-lg dark:bg-gray-800 dark:ring-gray-700"
                  >
                    <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={gambarSrc(item)}
                        alt={item.judul}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 py-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${item.warna}`}
                        >
                          {item.tipe}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.tanggal_formatted || 'Baru saja'}
                        </span>
                      </div>
                      <h3 className="mt-1.5 line-clamp-2 font-bold leading-snug text-ipm-ink dark:text-gray-100">
                        {item.judul}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                        {stripHtml(item.isi_konten || item.deskripsi)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 py-16 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300">
              Belum ada publikasi. Nantikan konten dari kami!
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/publikasi" className="font-semibold text-ipm-green-deep underline dark:text-ipm-yellow">
              Lihat semua publikasi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
