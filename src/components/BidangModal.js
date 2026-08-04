"use client";

import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function BidangModal({ isOpen, onClose, bidang }) {
  if (!bidang) return null;

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
    exit: { opacity: 0, y: 50, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div className="fixed inset-0 bg-black/60" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" />

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 overflow-y-auto">
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit">
              
              <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden dark:bg-gray-800">
                
                {/* Header */}
                <div className="bg-gray-50 p-6 flex items-center space-x-4 dark:bg-gray-700">
                  <span className="text-4xl">{bidang.icon || '📂'}</span>
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {bidang.nama} {/* SESUAI JSON */}
                    </Dialog.Title>
                    <p className="text-gray-600 dark:text-gray-300">Struktur & Anggota Bidang</p>
                  </div>
                </div>

                {/* Konten */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Tentang Bidang</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {bidang.deskripsi_lengkap || bidang.deskripsi_singkat} {/* PRIORITAS LENGKAP */}
                  </p>
                  
                  <hr className="my-6 border-gray-200 dark:border-gray-600" />

                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Pengurus ({bidang.penguruses?.length || 0})
                  </h3>
                  
                  {/* Grid Pengurus */}
                  {bidang.penguruses && bidang.penguruses.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {bidang.penguruses.map((pengurus) => (
                        <div key={pengurus.id} className="flex flex-col items-center text-center">
                          
                          {/* Foto Pengurus */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 mb-2 relative">
                            {pengurus.foto_url ? (
                              <Image 
                                src={pengurus.foto_url.replace('/uploads/', '/storage/')} 
                                alt={pengurus.nama_lengkap} 
                                fill 
                                className="object-cover" 
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full bg-ipm-yellow-light flex items-center justify-center text-ipm-yellow-dark font-bold text-xl">
                                {pengurus.nama_lengkap?.charAt(0)}
                              </div>
                            )}
                          </div>
                          
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {pengurus.nama_lengkap}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {pengurus.jabatan}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada data pengurus di bidang ini.</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 text-right dark:bg-gray-700">
                  <button onClick={onClose} className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    Tutup
                  </button>
                </div>
                
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}