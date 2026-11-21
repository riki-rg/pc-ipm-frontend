"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Search } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function PengurusPage() {
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [nameOrder, setNameOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    axios.get('/api/bidang')
      .then(({ data }) => setPeople((data.data || []).flatMap((bidang) =>
        (bidang.penguruses || []).map((person) => ({ ...person, bidang: bidang.nama }))
      )))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const { periods, fields } = useMemo(() => {
    const all = [...new Set(people.map((person) => person.periode).filter(Boolean))];
    const parsed = all.map((period) => ({ period, years: period.match(/\d{4}/g)?.map(Number) || [] }));
    const newest = parsed.filter(({ years }) => years.length >= 2).sort((a, b) => b.years[0] - a.years[0])[0];
    if (newest) {
      const previous = `${newest.years[0] - 2}-${newest.years[1] - 2}`;
      if (!all.includes(previous)) all.push(previous);
    }
    return {
      periods: all.sort((a, b) => (b.match(/\d{4}/)?.[0] || '').localeCompare(a.match(/\d{4}/)?.[0] || '')),
      fields: [...new Set(people.map((person) => person.bidang).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id-ID')),
    };
  }, [people]);

  const filteredPeople = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('id-ID');
    return people.filter((person) =>
      (!selectedPeriod || person.periode === selectedPeriod) &&
      (!selectedField || person.bidang === selectedField) &&
      (!needle || [person.nama_lengkap, person.jabatan, person.bidang, person.periode]
        .some((value) => value?.toLocaleLowerCase('id-ID').includes(needle)))
    ).sort((a, b) => nameOrder === 'asc'
      ? a.nama_lengkap.localeCompare(b.nama_lengkap, 'id-ID')
      : b.nama_lengkap.localeCompare(a.nama_lengkap, 'id-ID'));
  }, [people, query, selectedPeriod, selectedField, nameOrder]);

  const filterClass = 'min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white';

  return (
    <main className="min-h-screen bg-ipm-paper px-4 py-6 dark:bg-gray-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <BackButton />
        <header className="mt-8 rounded-2xl bg-ipm-green-deep px-6 py-10 text-white sm:px-10 sm:py-12">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Pengurus PC IPM Mayong</h1>
          <p className="mt-3 max-w-2xl text-white/85">Cari pengurus berdasarkan nama, jabatan, bidang, atau periode.</p>
        </header>

        <div className="relative mt-6">
          <label htmlFor="search-pengurus" className="sr-only">Cari pengurus</label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            id="search-pengurus"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama, jabatan, atau informasi lain"
            className="min-h-12 w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 outline-none focus:border-ipm-green-deep focus:ring-2 focus:ring-ipm-green-soft/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="filter-nama" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Urutkan nama</label>
            <select id="filter-nama" value={nameOrder} onChange={(event) => setNameOrder(event.target.value)} className={`${filterClass} w-full`}>
              <option value="asc">A–Z</option>
              <option value="desc">Z–A</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-periode" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Periode</label>
            <select id="filter-periode" value={selectedPeriod} onChange={(event) => setSelectedPeriod(event.target.value)} className={`${filterClass} w-full`}>
              <option value="">Semua periode</option>
              {periods.map((period) => <option key={period} value={period}>{period}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-bidang" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Bidang</label>
            <select id="filter-bidang" value={selectedField} onChange={(event) => setSelectedField(event.target.value)} className={`${filterClass} w-full`}>
              <option value="">Semua bidang</option>
              {fields.map((field) => <option key={field} value={field}>{field}</option>)}
            </select>
          </div>
        </div>

        <p className="mb-4 mt-5 text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          {loading ? 'Memuat data pengurus…' : `${filteredPeople.length} pengurus`}
        </p>

        {failed ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">Data pengurus gagal dimuat. Coba muat ulang halaman.</p>
        ) : !loading && filteredPeople.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300">
            {query ? 'Tidak ada pengurus yang cocok dengan pencarian.' : 'Data pengurus belum tersedia.'}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPeople.map((person) => (
              <li key={person.id}>
                <Link href={`/pengurus/${person.id}`} className="group flex min-h-32 items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-ipm-green-soft hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ipm-green-soft dark:border-gray-700 dark:bg-gray-800">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    {person.foto_url && <Image src={person.foto_url} alt="" fill sizes="80px" className="object-cover" unoptimized />}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-gray-900 group-hover:text-ipm-green-deep dark:text-white">{person.nama_lengkap}</h2>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{person.jabatan}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{person.bidang}{person.periode ? ` · ${person.periode}` : ''}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
