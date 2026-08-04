"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Calendar, MapPin, UserCheck } from 'lucide-react'; 

export default function DetailKajianPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(slug) {
        const fetchData = async () => {
          setLoading(true);
          try {
            const res = await axios.get(`http://127.0.0.1:8000/api/kajian/${slug}`);
            setData(res.data.data);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Kajian tidak ditemukan.</div>;

  // ==========================================
  // OPSI 1: TAMPILAN MODE POSTER (FULL SCREEN)
  // ==========================================
  if (data.jenis === 'poster') {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center py-10 px-4">
        
        {/* Label Mode */}
        <div className="mb-6">
            <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                Poster Kajian
            </span>
        </div>

        {/* Poster Gede */}
        <div className="relative w-full max-w-xl h-auto shadow-2xl rounded-lg overflow-hidden border border-gray-700 bg-black">
             {/* Gunakan Next.js Image untuk optimasi */}
             <Image 
                src={data.gambar_header_url.replace('/uploads/', '/storage/')} 
                alt={data.judul}
                width={800}
                height={1200}
                className="w-full h-auto object-contain"
                unoptimized
             />
        </div>

        {/* Info di Bawah Poster */}
        <div className="mt-8 text-center text-white max-w-2xl space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">{data.judul}</h1>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm md:text-base">
                <span className="flex gap-2 items-center">
                    <UserCheck size={20} className="text-green-400"/> 
                    {data.pemateri || "-"}
                </span>
                <span className="flex gap-2 items-center">
                    <Calendar size={20} className="text-blue-400"/> 
                    {data.tanggal_formatted}
                </span>
                <span className="flex gap-2 items-center">
                    <MapPin size={20} className="text-red-400"/> 
                    {data.lokasi || "Online"}
                </span>
            </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // OPSI 2: TAMPILAN MODE ARTIKEL (FORMAL)
  // ==========================================
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
      <div className="relative w-full h-[400px]">
        {data.gambar_header_url ? (
          <Image 
            src={data.gambar_header_url.replace('/uploads/', '/storage/')} 
            alt={data.judul} 
            fill 
            className="object-cover" 
            unoptimized 
          />
        ) : <div className="w-full h-full bg-green-900" />}
        
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute bottom-0 w-full p-6 md:p-12 container mx-auto">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
            Kajian Formal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {data.judul}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-200">
             <span className="flex gap-2 items-center"><UserCheck size={18}/> {data.pemateri}</span>
             <span className="flex gap-2 items-center"><Calendar size={18}/> {data.tanggal_formatted}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert max-w-none">
            {/* Render HTML dari RichEditor */}
            <div dangerouslySetInnerHTML={{ __html: data.deskripsi }} />
        </article>
      </div>
    </div>
  );
}

{/* backup
    "use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Calendar, MapPin, UserCheck, Download } from 'lucide-react'; 

export default function DetailKajianPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [data, setData] = useState(null);

  useEffect(() => {
    if(slug) {
        axios.get(`http://127.0.0.1:8000/api/kajian/${slug}`)
             .then(res => setData(res.data.data))
             .catch(err => console.error(err));
    }
  }, [slug]);

  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // --- LOGIC TAMPILAN KHUSUS POSTER ---
  if (data.jenis === 'poster') {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center py-10 px-4">
     
        <div className="absolute top-24 left-4 md:left-10 z-10">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                Mode Poster
            </span>
        </div>

    
        <div className="relative w-full max-w-2xl h-auto shadow-2xl rounded-lg overflow-hidden border-4 border-gray-800">
       
             <img 
                src={data.gambar_header_url.replace('/uploads/', '/storage/')} 
                alt={data.judul}
                className="w-full h-auto object-contain"
             />
        </div>

  
        <div className="mt-8 text-center text-white max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{data.judul}</h1>
            <div className="flex flex-wrap justify-center gap-6 text-gray-300">
                <span className="flex gap-2 items-center"><UserCheck size={20} className="text-green-400"/> {data.pemateri || "-"}</span>
                <span className="flex gap-2 items-center"><Calendar size={20} className="text-yellow-400"/> {data.tanggal_formatted}</span>
                <span className="flex gap-2 items-center"><MapPin size={20} className="text-red-400"/> {data.lokasi || "Online"}</span>
            </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN DEFAULT (KAJIAN FORMAL / ARTIKEL) ---
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
    
      <div className="relative w-full h-[400px]">
        {data.gambar_header_url ? (
          <Image src={data.gambar_header_url.replace('/uploads/', '/storage/')} alt={data.judul} fill className="object-cover" unoptimized />
        ) : <div className="w-full h-full bg-green-900" />}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 w-full p-12 container mx-auto">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">Kajian Formal</span>
          <h1 className="text-4xl font-bold text-white mb-2">{data.judul}</h1>
          <div className="flex gap-4 text-gray-200">
             <span className="flex gap-2 items-center"><UserCheck size={18}/> {data.pemateri}</span>
             <span className="flex gap-2 items-center"><Calendar size={18}/> {data.tanggal_formatted}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.deskripsi }} />
        </article>
      </div>
    </div>
  );
} 
*/}