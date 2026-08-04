// Nama file: app/layout.js
import { Inter } from 'next/font/google';
import './globals.css'; 
import { NextThemeProvider } from '@/components/ThemeProvider'; 
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
  title: 'PC IPM Mayong',
  description: 'Website Resmi Pimpinan Cabang Ikatan Pelajar Muhammadiyah Mayong',
};
export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>{/* <--- WAJIB TAMBAH ini */}
      <body className={inter.className}>
        <NextThemeProvider>
          {children}
        </NextThemeProvider>
      </body>
    </html>
  );
}