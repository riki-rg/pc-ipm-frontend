// Nama file: app/(main)/layout.js (INI NESTED LAYOUT YANG BENAR)

import Navbar from '@/components/Navbar'; // '@/' artinya 'dari folder src/'
import Footer from '@/components/Footer';

export default function MainLayout({ children }) {
  return (
    // Kita pake React Fragment (<>...</>) karena gak perlu tag HTML
    <>
      {/* Kita bikin flex-col biar footernya nempel di bawah */}
      <div className="flex min-h-screen flex-col">
        
        {/* 1. Pasang Navbar di sini */}
        <Navbar />

        {/* 2. 'children' adalah isi halaman (kayak HomePage tadi) */}
        {/* 'flex-grow' bikin kontennya ngisi ruang kosong */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 3. Pasang Footer di sini */}
        <Footer />

      </div>
    </>
  );
}