"use client";

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Mail, MessageCircle } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function ProfilPengurusPage({ params }) {
  const { id } = use(params);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/pengurus/${id}/profil`)
      .then((response) => setPerson(response.data.data))
      .catch(() => setPerson(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="grid min-h-[60vh] place-items-center bg-ipm-paper text-gray-700 dark:bg-gray-900 dark:text-gray-200">Memuat profil…</main>;
  if (!person) return <main className="grid min-h-[60vh] place-items-center bg-ipm-paper text-gray-700 dark:bg-gray-900 dark:text-gray-200">Profil tidak ditemukan.</main>;

  const whatsapp = person.whatsapp ? String(person.whatsapp).replace(/\D/g, '').replace(/^0/, '62') : null;

  return (
    <main className="min-h-screen bg-ipm-paper px-4 py-6 dark:bg-gray-900 sm:px-6">
      <div className="mx-auto max-w-4xl"><BackButton />
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="h-2 bg-ipm-green-deep" />
          <div className="flex flex-col gap-8 p-6 sm:flex-row sm:p-10">
            <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 sm:mx-0 sm:h-48 sm:w-48">
              {person.foto_url && <Image src={person.foto_url} alt={person.name} fill className="object-cover" unoptimized />}
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              {person.bidang && <p className="mb-2 text-sm font-semibold text-ipm-green-soft">{person.bidang}</p>}
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{person.name}</h1>
              {person.jabatan && <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">{person.jabatan}</p>}
              {person.kutipan && <p className="mt-5 max-w-2xl text-gray-600 dark:text-gray-300">{person.kutipan}</p>}
              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                {person.email && <a className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ipm-green-deep px-4 text-sm font-semibold text-white hover:opacity-90" href={`mailto:${person.email}`}><Mail size={16} />Email</a>}
                {person.whatsapp && <a className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp</a>}
              </div>
            </div>
          </div>
        </section>
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">Kontak diambil dari data Pengurus yang ditampilkan organisasi.</p>
      </div>
    </main>
  );
}
