"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '@/services/api';
import { Instagram, Youtube, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import BackButton from '@/components/BackButton';

const contactSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Format email tidak valid'),
  pesan: z.string().min(10, 'Pesan minimal 10 karakter').max(5000, 'Pesan maksimal 5000 karakter'),
});

const fixUrl = (url) => (url ? url.replace('/uploads/', '/storage/') : null);
const formatWaLink = (number) => {
  if (!number) return '#';
  const clean = number.replace(/\D/g, '').replace(/^0/, '62');
  return `https://wa.me/${clean}`;
};

function LeaderCard({ person, role, fallback }) {
  if (!person) return null;
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-ipm-green-deep text-white ring-4 ring-ipm-yellow/30">
          {person.foto_url ? (
            <Image src={fixUrl(person.foto_url)} alt={person.nama_lengkap} fill className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full items-center justify-center text-xl font-bold">{person.nama_lengkap?.charAt(0) || fallback}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-ipm-green-soft">{person.jabatan || role}</p>
          <h3 className="truncate text-lg font-extrabold text-ipm-ink dark:text-white">{person.nama_lengkap}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">“{person.kutipan || 'Bergerak dan bertumbuh bersama pelajar.'}”</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {person.email && <a href={`mailto:${person.email}`} className="rounded-full bg-ipm-paper px-3 py-1.5 text-xs font-semibold text-ipm-green-deep hover:bg-ipm-yellow">Email</a>}
        {person.whatsapp && <a href={formatWaLink(person.whatsapp)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ipm-green-deep px-3 py-1.5 text-xs font-semibold text-white hover:bg-ipm-green-soft">WhatsApp</a>}
      </div>
    </article>
  );
}

export default function KontakPage() {
  const [pimpinan, setPimpinan] = useState({ ketum: null, sekum: null });
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(contactSchema) });

  useEffect(() => {
    Promise.all([apiService.getPimpinan(), apiService.getSettings()])
      .then(([leaders, settings]) => {
        setPimpinan(leaders.data.data || { ketum: null, sekum: null });
        setSetting(settings.data.data || settings.data);
      })
      .catch((error) => console.error('Gagal load data kontak:', error))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      await apiService.submitContact(data);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Pesan belum terkirim. Coba lagi beberapa saat lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-ipm-paper dark:bg-gray-900">
      <div className="container mx-auto px-6 pt-6"><BackButton /></div>

      <header className="hero-texture mt-5 bg-ipm-green-gradient py-20 text-white md:py-24">
        <div className="container mx-auto px-6">
          <p className="mb-2 text-sm font-semibold text-ipm-yellow">Kontak PC IPM Mayong</p>
          <h1 className="max-w-2xl text-3xl font-extrabold md:text-5xl">Mari mulai percakapan yang baik.</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-200 md:text-lg">
            {setting?.deskripsi_singkat || 'Punya pertanyaan, usulan, atau ingin berkolaborasi? Kirim pesan kepada kami.'}
          </p>
        </div>
      </header>

      <main className="container mx-auto grid gap-12 px-6 py-16 lg:grid-cols-[1.1fr_.9fr]">
        <section>
          <div className="accent-rule mb-4 w-16" />
          <h2 className="text-3xl font-extrabold text-ipm-ink dark:text-white">Kirim pesan</h2>
          <p className="mt-2 max-w-lg text-gray-600 dark:text-gray-300">Pesanmu diteruskan langsung ke pengurus melalui panel admin.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 md:p-8">
            <div className="space-y-5">
              <div><label className="mb-2 block text-sm font-bold text-ipm-ink dark:text-white">Nama</label><input {...register('nama')} placeholder="Nama Anda" className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none focus:border-ipm-green-deep focus:ring-2 focus:ring-ipm-yellow/40 dark:bg-gray-900" />{errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama.message}</p>}</div>
              <div><label className="mb-2 block text-sm font-bold text-ipm-ink dark:text-white">Email</label><input {...register('email')} type="email" placeholder="nama@email.com" className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none focus:border-ipm-green-deep focus:ring-2 focus:ring-ipm-yellow/40 dark:bg-gray-900" />{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}</div>
              <div><label className="mb-2 block text-sm font-bold text-ipm-ink dark:text-white">Pesan</label><textarea {...register('pesan')} rows={5} placeholder="Tulis pesan Anda di sini..." className="w-full resize-y rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none focus:border-ipm-green-deep focus:ring-2 focus:ring-ipm-yellow/40 dark:bg-gray-900" />{errors.pesan && <p className="mt-1 text-xs text-red-600">{errors.pesan.message}</p>}</div>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-ipm-green-deep px-6 py-3 text-sm font-bold text-white transition hover:bg-ipm-green-soft disabled:opacity-50"><Send size={16} />{isSubmitting ? 'Mengirim pesan...' : 'Kirim pesan'}</button>
              {submitSuccess && <p className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-800">Pesan berhasil dikirim. Terima kasih sudah menghubungi kami.</p>}
              {submitError && <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{submitError}</p>}
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-ipm-green-deep p-6 text-white md:p-8">
            <p className="text-sm font-semibold text-ipm-yellow">Informasi langsung</p>
            <h2 className="mt-2 text-2xl font-extrabold">Datang atau hubungi kami</h2>
            <div className="mt-6 space-y-4 text-sm text-gray-200">
              <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-ipm-yellow" />{setting?.alamat || 'Alamat sekretariat belum diatur'}</p>
              <a href={`mailto:${setting?.email || ''}`} className="flex gap-3 hover:text-ipm-yellow"><Mail className="h-5 w-5 shrink-0 text-ipm-yellow" />{setting?.email || 'Email belum diatur'}</a>
              {setting?.whatsapp && <a href={formatWaLink(setting.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-ipm-yellow"><MessageCircle className="h-5 w-5 shrink-0 text-ipm-yellow" />{setting.whatsapp}</a>}
            </div>
            <div className="mt-7 flex gap-3 border-t border-white/15 pt-5">
              {setting?.instagram && <a href={setting.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 hover:bg-ipm-yellow hover:text-ipm-green-deep"><Instagram size={20} /></a>}
              {setting?.youtube && <a href={setting.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full bg-white/10 p-2.5 hover:bg-ipm-yellow hover:text-ipm-green-deep"><Youtube size={20} /></a>}
            </div>
          </section>
          {setting?.google_maps_embed && <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-200"><iframe src={setting.google_maps_embed} title="Lokasi PC IPM Mayong" className="h-full w-full" style={{ border: 0 }} loading="lazy" /></div>}
        </aside>
      </main>

      <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-6"><div className="accent-rule mb-4 w-16" /><h2 className="text-3xl font-extrabold text-ipm-ink dark:text-white">Pimpinan yang dapat dihubungi</h2><p className="mt-2 text-gray-600 dark:text-gray-300">Untuk kebutuhan koordinasi langsung.</p>
          {loading ? <div className="mt-8 grid gap-5 md:grid-cols-2"><div className="h-48 animate-pulse rounded-2xl bg-gray-200" /><div className="h-48 animate-pulse rounded-2xl bg-gray-200" /></div> : <div className="mt-8 grid gap-5 md:grid-cols-2"><LeaderCard person={pimpinan.ketum} role="Ketua Umum" fallback="K" /><LeaderCard person={pimpinan.sekum} role="Sekretaris Umum" fallback="S" /></div>}
        </div>
      </section>
    </div>
  );
}
