"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '@/services/api';
// 1. IMPORT ICON YANG DIPAKE AJA
import { Instagram, Youtube } from 'lucide-react';
import BackButton from '@/components/BackButton';

// Form validation schema
const contactSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Format email tidak valid'),
  pesan: z.string().min(10, 'Pesan minimal 10 karakter').max(5000, 'Pesan maksimal 5000 karakter'),
}); 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default function KontakPage() {
  const [pimpinan, setPimpinan] = useState({ ketum: null, sekum: null });
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resPimpinan, resSetting] = await Promise.all([
          apiService.getPimpinan(),
          apiService.getSettings()
        ]);

        setPimpinan(resPimpinan.data.data);
        const dataSetting = resSetting.data.data || resSetting.data;
        setSetting(dataSetting);

      } catch (error) {
        console.error("Gagal load data kontak:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      
      await apiService.submitContact(data);
      
      setSubmitSuccess(true);
      reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError(error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const fixUrl = (url) => url ? url.replace('/uploads/', '/storage/') : null;

  const formatWaLink = (number) => {
    if (!number) return '#';
    let clean = number.replace(/\D/g, ''); 
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    return `https://wa.me/${clean}`;
  };

  return (
    <div className="w-full bg-ipm-paper dark:bg-gray-900">
      <div className="container mx-auto px-6 pt-6">
        <BackButton />
      </div>
      
      {/* 1. HERO SECTION */}
      <motion.section 
        className="relative overflow-hidden bg-ipm-green-gradient pt-20 pb-16 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h1 className="text-3xl font-extrabold md:text-5xl text-white">
            Hubungi Kami
          </motion.h1>
          <motion.p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-200 md:text-lg">
            {setting?.deskripsi_singkat || "Punya pertanyaan, saran, atau ide kolaborasi? Jangan ragu untuk menghubungi kami."}
          </motion.p>
        </div>
      </motion.section>

      {/* 2. SECTION PIMPINAN */}
      <section className="w-full bg-gray-50 py-24 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
              Pimpinan Kami
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Silakan hubungi perwakilan pimpinan kami untuk informasi lebih lanjut.
            </p>
          </motion.div>
          
          {loading ? (
             <div className="grid grid-cols-1 gap-10 md:grid-cols-2 max-w-4xl mx-auto">
                {[1, 2].map((i) => (
                  <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse dark:bg-gray-700"></div>
                ))}
             </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 gap-10 md:grid-cols-2 max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
               {/* KARTU KETUM */}
               {pimpinan.ketum ? (
                  <motion.div className="flex flex-col items-center text-center rounded-xl bg-white p-8 shadow-lg dark:bg-gray-700 transition-transform hover:-translate-y-2" variants={itemVariants}>
                    <div className="relative w-32 h-32 rounded-full bg-gray-300 mb-4 overflow-hidden border-4 border-ipm-yellow-main">
                      {pimpinan.ketum.foto_url ? <Image src={fixUrl(pimpinan.ketum.foto_url)} alt="Ketum" fill className="object-cover" unoptimized /> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-2xl">{pimpinan.ketum.nama_lengkap.charAt(0)}</div>}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pimpinan.ketum.nama_lengkap}</h3>
                    <p className="text-ipm-yellow-dark font-semibold uppercase text-sm mt-1">{pimpinan.ketum.jabatan}</p>
                    <p className="mt-3 text-gray-600 italic text-sm dark:text-gray-300">&quot;{pimpinan.ketum.kutipan || 'Bergerak mencerahkan semesta.'}&quot;</p>
                    <div className="mt-4 flex flex-col gap-1">
                        {pimpinan.ketum.email && <a href={`mailto:${pimpinan.ketum.email}`} className="text-sm font-medium text-ipm-green hover:underline dark:text-ipm-yellow-light">📧 {pimpinan.ketum.email}</a>}
                        {pimpinan.ketum.whatsapp && <a href={`https://wa.me/${pimpinan.ketum.whatsapp}`} target="_blank" className="text-sm font-medium text-ipm-green hover:underline dark:text-ipm-yellow-light">📞 WhatsApp</a>}
                    </div>
                  </motion.div>
               ) : (
                  <motion.div variants={itemVariants} className="flex items-center justify-center p-8 bg-white rounded-xl shadow text-gray-500 dark:bg-gray-700 dark:text-gray-400">Data Ketua Umum belum ditemukan.</motion.div>
               )}

               {/* KARTU SEKUM */}
               {pimpinan.sekum ? (
                  <motion.div className="flex flex-col items-center text-center rounded-xl bg-white p-8 shadow-lg dark:bg-gray-700 transition-transform hover:-translate-y-2" variants={itemVariants}>
                    <div className="relative w-32 h-32 rounded-full bg-gray-300 mb-4 overflow-hidden border-4 border-ipm-yellow-main">
                      {pimpinan.sekum.foto_url ? <Image src={fixUrl(pimpinan.sekum.foto_url)} alt="Sekum" fill className="object-cover" unoptimized /> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-2xl">{pimpinan.sekum.nama_lengkap.charAt(0)}</div>}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pimpinan.sekum.nama_lengkap}</h3>
                    <p className="text-ipm-yellow-dark font-semibold uppercase text-sm mt-1">{pimpinan.sekum.jabatan}</p>
                    <p className="mt-3 text-gray-600 italic text-sm dark:text-gray-300">&quot;{pimpinan.sekum.kutipan || 'Tertib administrasi.'}&quot;</p>
                    <div className="mt-4 flex flex-col gap-1">
                        {pimpinan.sekum.email && <a href={`mailto:${pimpinan.sekum.email}`} className="text-sm font-medium text-ipm-green hover:underline dark:text-ipm-yellow-light">📧 {pimpinan.sekum.email}</a>}
                        {pimpinan.sekum.whatsapp && <a href={`https://wa.me/${pimpinan.sekum.whatsapp}`} target="_blank" className="text-sm font-medium text-ipm-green hover:underline dark:text-ipm-yellow-light">📞 WhatsApp</a>}
                    </div>
                  </motion.div>
               ) : (
                  <motion.div variants={itemVariants} className="flex items-center justify-center p-8 bg-white rounded-xl shadow text-gray-500 dark:bg-gray-700 dark:text-gray-400">Data Sekretaris Umum belum ditemukan.</motion.div>
               )}
            </motion.div>
          )}

        </div>
      </section>

      {/* 3. SECTION FORM & INFO */}
      <section className="w-full bg-white py-24 dark:bg-gray-900">
        <motion.div
          className="container mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Kirim Pesan Langsung</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Nama Anda" 
                    {...register('nama')}
                    className={`w-full rounded-lg border p-3 dark:bg-gray-800 dark:text-white ${
                      errors.nama 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.nama && (
                    <p className="mt-1 text-sm text-red-500">{errors.nama.message}</p>
                  )}
                </div>
                
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Anda" 
                    {...register('email')}
                    className={`w-full rounded-lg border p-3 dark:bg-gray-800 dark:text-white ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <textarea 
                    placeholder="Pesan Anda" 
                    rows={4} 
                    {...register('pesan')}
                    className={`w-full rounded-lg border p-3 dark:bg-gray-800 dark:text-white ${
                      errors.pesan 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  ></textarea>
                  {errors.pesan && (
                    <p className="mt-1 text-sm text-red-500">{errors.pesan.message}</p>
                  )}
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-ipm-gradient px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim'}
                </button>

                {submitSuccess && (
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg">
                    <p className="text-green-700 dark:text-green-400 font-medium">
                      ✓ Pesan berhasil dikirim! Terima kasih telah menghubungi kami.
                    </p>
                  </div>
                )}

                {submitError && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 font-medium">
                      ✗ {submitError}
                    </p>
                  </div>
                )}
              </form>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Info Lainnya</h2>
              <p className="text-lg text-gray-700 mb-4 dark:text-gray-300">
                 Kunjungi kami langsung di: <br/>
                 <span className="font-semibold">{setting?.alamat || "Mayong, Jepara"}</span>
              </p>
              
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 shadow-lg dark:border-gray-700">
                <iframe
                  src={setting?.google_maps_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d110.74561575664062!3d-6.734266399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70c55555555555%3A0x5555555555555555!2sMayong!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid"}
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" className="dark:grayscale"
                ></iframe>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📧</span>
                  <a href={`mailto:${setting?.email}`} className="text-lg text-gray-700 hover:text-ipm-green dark:text-gray-300 dark:hover:text-ipm-yellow-light">
                    {setting?.email || "Email belum diatur"}
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📞</span>
                  <a href={formatWaLink(setting?.whatsapp)} target="_blank" className="text-lg text-gray-700 hover:text-ipm-green dark:text-gray-300 dark:hover:text-ipm-yellow-light">
                    {setting?.whatsapp || "No HP belum diatur"} (WhatsApp)
                  </a>
                </div>

                 {/* 2. SOSMED ICON (CUMA IG & YOUTUBE) */}
                 <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {setting?.instagram && (
                        <a 
                          href={setting.instagram} 
                          target="_blank" 
                          className="p-2 rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-pink-100 hover:text-pink-600 hover:-translate-y-1 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-pink-900/30 dark:hover:text-pink-400"
                          title="Instagram"
                        >
                           <Instagram size={24} />
                        </a>
                    )}
                    
                    {/* FACEBOOK DIHAPUS DISINI */}
                    
                    {setting?.youtube && (
                        <a 
                          href={setting.youtube} 
                          target="_blank" 
                          className="p-2 rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-red-100 hover:text-red-600 hover:-translate-y-1 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          title="YouTube"
                        >
                           <Youtube size={24} />
                        </a>
                    )}
                 </div>

              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

    </div>
  );
}