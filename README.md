# PC IPM Mayong - Frontend

Website resmi PC IPM (Pimpinan Cabang Ikatan Pelajar Muhammadiyah) Mayong yang dibangun dengan Next.js 16 dan React 19. Aplikasi ini menyediakan informasi lengkap tentang organisasi, publikasi (berita, kajian, kegiatan), galeri foto, dan formulir kontak.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.2 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS 3.4.0
- **HTTP Client**: Axios 1.13.2
- **Animations**: Framer Motion 12.23.24
- **UI Components**: Headless UI 2.2.9
- **Icons**: Lucide React 0.562.0
- **Carousel**: Swiper 12.0.3
- **Theme**: Next Themes 0.4.6 (Dark Mode Support)
- **State Management**: TanStack React Query 5.90.8

## 📋 Fitur Utama

### 1. **Homepage**
- Splash page dengan animasi
- Hero slider dinamis (foto/video YouTube)
- Sorotan publikasi terbaru (berita, kajian, kegiatan)
- Responsive design

### 2. **Tentang Kami**
- Visi & Misi organisasi
- Daftar bidang/divisi dengan detail pengurus
- Modal untuk detail setiap bidang
- Statistik organisasi dengan animated counter

### 3. **Publikasi**
- Filter berdasarkan kategori (Semua, Berita, Kajian, Kegiatan)
- Pagination
- Detail artikel dengan HTML content
- Detail kajian (poster/artikel) dengan informasi pemateri & waktu
- Detail kegiatan dengan daftar peserta

### 4. **Galeri**
- Album foto dengan filter kategori
- Lightbox untuk view foto fullscreen
- Detail album dengan grid layout

### 5. **Kontak**
- Formulir kontak (nama, email, pesan)
- Info pimpinan (Ketua & Sekretaris Umum)
- Informasi kontak (WhatsApp, Instagram, YouTube, Alamat)

### 6. **Lainnya**
- Dark mode toggle
- Responsive navbar dengan mobile menu
- Footer dinamis
- SEO-friendly dengan metadata dinamis

## 🛠️ Prerequisites

- **Node.js**: v18 atau lebih tinggi
- **npm/yarn/pnpm**: Package manager
- **Backend API**: Laravel backend harus berjalan di `http://localhost:8000`

## ⚙️ Environment Variables

Buat file `.env.local` di root directory dengan konfigurasi berikut:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## 📦 Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd pc-ipm-frontend
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.local.example .env.local
# Edit .env.local sesuai konfigurasi backend
```

4. **Jalankan development server**
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

5. **Buka browser**
```
http://localhost:3000
```

## 🏗️ Struktur Project

```
pc-ipm-frontend/
├── src/
│   ├── app/                          # App Router
│   │   ├── layout.js                 # Root layout
│   │   ├── page.js                   # Splash page
│   │   ├── globals.css               # Global styles
│   │   └── (main)/                   # Route group
│   │       ├── layout.js             # Layout dengan Navbar & Footer
│   │       ├── home/                 # Homepage
│   │       ├── tentang/              # About page
│   │       ├── kontak/               # Contact page
│   │       ├── galeri/               # Gallery pages
│   │       │   ├── page.js           # List albums
│   │       │   └── [id]/page.js      # Album detail
│   │       └── publikasi/            # Publications
│   │           ├── page.js           # List publikasi
│   │           ├── berita/[slug]/    # News detail
│   │           ├── kajian/[slug]/    # Kajian detail
│   │           └── kegiatan/[slug]/  # Activity detail
│   │
│   ├── components/                   # Reusable components
│   │   ├── Navbar.js                 # Navigation bar
│   │   ├── Footer.js                 # Footer
│   │   ├── HeroSlider.js             # Hero carousel
│   │   ├── AnimatedCounter.js        # Counter animation
│   │   ├── BidangModal.js            # Division modal
│   │   ├── ThemeProvider.js          # Dark mode provider
│   │   └── ThemeSwitcher.js          # Theme toggle
│   │
│   └── lib/
│       └── axios.js                  # Axios instance
│
├── public/                           # Static assets
│   ├── logo.png
│   └── *.svg
│
├── .env.local                        # Environment variables
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.js                # Tailwind configuration
└── package.json
```

## 🎨 Routing

| Route | Page | Deskripsi |
|-------|------|-----------|
| `/` | Splash Page | Landing page dengan animasi |
| `/home` | Homepage | Hero slider & sorotan publikasi |
| `/tentang` | About | Visi, misi, bidang, statistik |
| `/kontak` | Contact | Form kontak & info pimpinan |
| `/galeri` | Gallery List | Daftar album galeri |
| `/galeri/[id]` | Album Detail | Detail album dengan lightbox |
| `/publikasi` | Publications | List berita, kajian, kegiatan |
| `/publikasi/berita/[slug]` | News Detail | Detail artikel berita |
| `/publikasi/kajian/[slug]` | Kajian Detail | Detail kajian |
| `/publikasi/kegiatan/[slug]` | Activity Detail | Detail kegiatan & peserta |

## 🔌 API Integration

Frontend berkomunikasi dengan Laravel backend melalui REST API:

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/pengaturan` | GET | Website settings (logo, nama, kontak) |
| `/hero-slides` | GET | Hero slider data |
| `/artikel` | GET | List berita |
| `/artikel/{slug}` | GET | Detail berita |
| `/kajian` | GET | List kajian |
| `/kajian/{slug}` | GET | Detail kajian |
| `/kegiatan` | GET | List kegiatan |
| `/kegiatan/{slug}` | GET | Detail kegiatan |
| `/galeri` | GET | List album galeri |
| `/galeri/{id}` | GET | Detail album + foto |
| `/bidang` | GET | List bidang & pengurus |
| `/pimpinan` | GET | Data ketua & sekretaris |
| `/pesan-masuk` | POST | Submit contact form |

**Base URL**: `http://localhost:8000/api`

## 🎯 Scripts

```bash
# Development
npm run dev          # Jalankan dev server (localhost:3000)

# Production
npm run build        # Build untuk production
npm run start        # Jalankan production server

# Linting
npm run lint         # Check code quality
```

## 🌓 Dark Mode

Aplikasi mendukung dark mode yang persistent menggunakan `next-themes`. User dapat toggle melalui tombol di navbar (icon sun/moon).

## 📱 Responsive Design

- **Mobile**: < 768px (hamburger menu, stack layout)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🖼️ Image Handling

- Menggunakan `next/image` untuk optimasi otomatis
- Image dari backend: `http://localhost:8000/storage/...`
- Konfigurasi domain di `next.config.mjs`

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Manual Deployment

```bash
# Build production
npm run build

# Start production server
npm run start
```

## 🔧 Configuration

### next.config.mjs
```javascript
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
};
```

### tailwind.config.js
```javascript
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // Custom theme configuration
    },
  },
};
```

## 🐛 Troubleshooting

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

### Image tidak muncul
- Pastikan backend Laravel running di `http://localhost:8000`
- Check `php artisan storage:link` sudah dijalankan di backend
- Verify `NEXT_PUBLIC_API_BASE_URL` di `.env.local`

### API error
- Pastikan backend sudah running
- Check CORS settings di backend Laravel
- Verify endpoint API di `src/lib/axios.js`

## 📝 Notes

- Pastikan backend API running sebelum menjalankan frontend
- Image harus diakses via `/storage/` bukan `/uploads/`
- Dark mode state disimpan di localStorage
- Semua API response menggunakan format JSON

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Private project - All rights reserved

## 👨‍💻 Developer

Dikembangkan untuk PC IPM Mayong

---

**Last Updated**: August 2026
