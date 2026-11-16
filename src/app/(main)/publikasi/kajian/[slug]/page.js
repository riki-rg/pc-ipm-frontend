"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Calendar, MapPin, UserCheck } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function DetailKajianPage({ params }) {
  const { slug } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    axios.get(`/api/kajian/${slug}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.error('Gagal memuat kajian:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Memuat kajian...</div>;
  if (!data) return <div className="flex min-h-screen items-center justify-center">Kajian tidak ditemukan.</div>;

  const imageUrl = data.gambar_header_url?.replace('/uploads/', '/storage/');
  const metadata = (
    <div className="flex flex-wrap gap-4 text-sm text-gray-200">
      {data.pemateri && <span className="flex items-center gap-2"><UserCheck size={18} />{data.pemateri}</span>}
      {data.tanggal_formatted && <span className="flex items-center gap-2"><Calendar size={18} />{data.tanggal_formatted}</span>}
      {data.lokasi && <span className="flex items-center gap-2"><MapPin size={18} />{data.lokasi}</span>}
    </div>
  );

  if (data.jenis === 'poster') {
    return (
      <div className="min-h-screen bg-ipm-green-deep px-4 py-6 text-white">
        <div className="container mx-auto max-w-4xl">
          <BackButton label="Kembali ke publikasi" />
          <div className="mt-8 flex flex-col items-center">
            <span className="mb-5 rounded-full bg-ipm-yellow px-4 py-1 text-sm font-bold text-ipm-green-deep">Poster Kajian</span>
            <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl">
              {imageUrl && <Image src={imageUrl} alt={data.judul} width={800} height={1200} className="h-auto w-full object-contain" unoptimized />}
            </div>
            <div className="mt-8 max-w-2xl text-center">
              <h1 className="text-2xl font-extrabold md:text-3xl">{data.judul}</h1>
              <div className="mt-5 flex justify-center">{metadata}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ipm-paper pb-20 dark:bg-gray-900">
      <div className="container mx-auto px-6 pt-6"><BackButton label="Kembali ke publikasi" /></div>
      <header className="relative mt-5 h-[380px] overflow-hidden md:h-[480px]">
        {imageUrl ? <Image src={imageUrl} alt={data.judul} fill className="object-cover" priority unoptimized /> : <div className="h-full bg-ipm-green-deep" />}
        <div className="absolute inset-0 bg-ipm-green-deep/70" />
        <div className="absolute inset-x-0 bottom-0 container mx-auto px-6 pb-10">
          <span className="mb-4 inline-block rounded-full bg-ipm-yellow px-3 py-1 text-sm font-bold text-ipm-green-deep">Kajian</span>
          <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-white md:text-5xl">{data.judul}</h1>
          <div className="mt-5">{metadata}</div>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl px-6 py-12">
        <article className="prose prose-lg max-w-none prose-headings:text-ipm-green-deep prose-a:text-ipm-green-soft dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: data.deskripsi || '' }} />
        </article>
      </main>
    </div>
  );
}
