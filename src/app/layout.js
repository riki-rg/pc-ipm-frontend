// Nama file: app/layout.js
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { NextThemeProvider } from '@/components/ThemeProvider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export async function generateMetadata() {
  const metadata = {
    title: 'PC IPM Mayong',
    description: 'Website Resmi Pimpinan Cabang Ikatan Pelajar Muhammadiyah Mayong',
  };

  try {
    const response = await fetch('https://pc-ipm-mayong.web.id/api/pengaturan', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Settings API returned ${response.status}`);
    const payload = await response.json();
    const settings = payload?.data;
    if (settings?.logo_url) {
      const version = encodeURIComponent(settings.updated_at || settings.logo || 'current');
      metadata.icons = { icon: [{ url: `/favicon?v=${version}`, type: 'image/png' }] };
    } else {
      metadata.icons = { icon: [{ url: '/favicon', type: 'image/png' }] };
    }
  } catch (error) {
    console.error('Could not load website icon settings:', error);
    metadata.icons = { icon: [{ url: '/favicon', type: 'image/png' }] };
  }

  return metadata;
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={jakarta.variable}>
      <body className="font-jakarta bg-ipm-paper dark:bg-gray-900">
        <NextThemeProvider>{children}</NextThemeProvider>
      </body>
    </html>
  );
}
