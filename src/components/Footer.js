"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function Footer() {
  const [setting, setSetting] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    api.get('/pengaturan')
      .then(res => {
        if(res.data.status === 'success') setSetting(res.data.data);
      })
      .catch(err => console.error("Gagal load footer:", err));
  }, []);

  return (
    <footer className="w-full bg-ipm-green-deep text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center text-center md:flex-row md:justify-between">

          {/* Bagian Kiri: Info Copyright & Alamat */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <p className="font-bold text-white mb-1">
              &copy; {currentYear} {setting?.nama_website || "PC IPM Mayong"}.
            </p>
            <p className="text-sm max-w-xs italic text-gray-500 mb-2">
              {setting?.alamat || "Alamat belum diatur"}
            </p>
            <p className="mt-2 text-xs">
              Developed by{' '}
              <a
                href="https://rizqymaulanahakim.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ipm-yellow hover:text-ipm-yellow-light"
              >
                Rizzy
              </a>
            </p>
          </div>

          {/* Bagian Kanan: Ikon Media Sosial Dinamis */}
          <div className="flex space-x-6">
            
            {setting?.instagram && (
              <a
                href={`https://instagram.com/${setting.instagram}`}
                target="_blank"
                className="transition-colors duration-300 hover:text-pink-500"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            )}

            {setting?.youtube && (
              <a
                href={`https://youtube.com/@${setting.youtube}`}
                target="_blank"
                className="transition-colors duration-300 hover:text-red-500"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 4.63 6.13 2 12 2s9.5 2.63 9.5 5a24.12 24.12 0 0 1 0 10c0 2.37-3.63 5-9.5 5S2.5 19.37 2.5 17z"></path><path d="m10 15 5-3-5-3z"></path></svg>
              </a>
            )}
            
          </div>
          
        </div>
      </div>
    </footer>
  );
}