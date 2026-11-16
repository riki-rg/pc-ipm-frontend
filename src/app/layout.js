// Nama file: app/layout.js
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { NextThemeProvider } from '@/components/ThemeProvider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'PC IPM Mayong',
  description: 'Website Resmi Pimpinan Cabang Ikatan Pelajar Muhammadiyah Mayong',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={jakarta.variable}>
      <body className="font-jakarta bg-ipm-paper">
        <NextThemeProvider>{children}</NextThemeProvider>
      </body>
    </html>
  );
}
