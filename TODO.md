# TODO - Bug Fixes & Improvements (Frontend)

Daftar prioritas perbaikan dan improvement untuk PC IPM Frontend Next.js.

---

## 🔴 CRITICAL (Harus segera diperbaiki)

### 1. ✅ Remove Unused TanStack React Query
**File**: `package.json`
**Problem**: Package `@tanstack/react-query` di-install tapi tidak digunakan

**Action**:
```bash
# Option A: Hapus jika memang tidak mau pakai
npm uninstall @tanstack/react-query

# Option B: Implementasikan dengan benar (recommended)
# Lihat item #4 di bawah
```

**Status**: ⏳ Pending

---

### 2. ✅ Add Global Error Boundary
**Files**: `src/app/layout.js`, `src/app/error.js` (create)
**Problem**: Tidak ada error handling global, blank page jika API down

**Action**:
```bash
# Create error boundary file
touch src/app/error.js
```

**File**: `src/app/error.js`
```jsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <svg
          className="mx-auto h-16 w-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Terjadi Kesalahan
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Maaf, terjadi kesalahan pada aplikasi. Silakan coba lagi.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors"
          >
            Coba Lagi
          </button>
          <a
            href="/"
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
```

**File**: `src/app/global-error.js` (untuk layout errors)
```jsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900">
              Aplikasi Error
            </h2>
            <p className="mt-2 text-gray-600">
              {error.message || 'Terjadi kesalahan tidak terduga'}
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

**Status**: ⏳ Pending

---

### 3. ✅ Create Centralized API Service Layer
**Problem**: API calls tersebar di setiap component, tidak maintainable

**Action**:
```bash
# Create service directory
mkdir -p src/services
touch src/services/api.js
touch src/services/endpoints.js
```

**File**: `src/services/endpoints.js`
```javascript
export const API_ENDPOINTS = {
  // Settings
  settings: '/pengaturan',
  
  // Hero
  heroSlides: '/hero-slides',
  
  // Articles
  articles: '/artikel',
  article: (slug) => `/artikel/${slug}`,
  
  // Kajian
  kajian: '/kajian',
  kajianDetail: (slug) => `/kajian/${slug}`,
  
  // Kegiatan
  kegiatan: '/kegiatan',
  kegiatanDetail: (slug) => `/kegiatan/${slug}`,
  
  // Gallery
  galleries: '/galeri',
  galleryDetail: (id) => `/galeri/${id}`,
  
  // Bidang
  bidang: '/bidang',
  
  // Leadership
  pimpinan: '/pimpinan',
  
  // Contact
  contact: '/pesan-masuk',
};
```

**File**: `src/services/api.js`
```javascript
import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.code === 'ECONNABORTED') {
      console.error('API Timeout');
    }
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const apiService = {
  // Settings
  getSettings: () => api.get(API_ENDPOINTS.settings),
  
  // Hero
  getHeroSlides: () => api.get(API_ENDPOINTS.heroSlides),
  
  // Articles
  getArticles: (params = {}) => api.get(API_ENDPOINTS.articles, { params }),
  getArticle: (slug) => api.get(API_ENDPOINTS.article(slug)),
  
  // Kajian
  getKajian: (params = {}) => api.get(API_ENDPOINTS.kajian, { params }),
  getKajianDetail: (slug) => api.get(API_ENDPOINTS.kajianDetail(slug)),
  
  // Kegiatan
  getKegiatan: (params = {}) => api.get(API_ENDPOINTS.kegiatan, { params }),
  getKegiatanDetail: (slug) => api.get(API_ENDPOINTS.kegiatanDetail(slug)),
  
  // Gallery
  getGalleries: (params = {}) => api.get(API_ENDPOINTS.galleries, { params }),
  getGalleryDetail: (id) => api.get(API_ENDPOINTS.galleryDetail(id)),
  
  // Bidang
  getBidang: () => api.get(API_ENDPOINTS.bidang),
  
  // Leadership
  getPimpinan: () => api.get(API_ENDPOINTS.pimpinan),
  
  // Contact
  submitContact: (data) => api.post(API_ENDPOINTS.contact, data),
};

export default api;
```

**Usage di components**:
```javascript
// Before
useEffect(() => {
  axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artikel`)...
}, []);

// After
import { apiService } from '@/services/api';

useEffect(() => {
  apiService.getArticles()...
}, []);
```

**Status**: ⏳ Pending

---

### 4. ✅ Implement TanStack React Query (if keeping)
**Files**: `src/services/queries.js` (create)
**Problem**: Manual fetching tanpa caching, refetching, deduping

**Action**:
```bash
# Create query hooks
mkdir -p src/hooks
touch src/hooks/useApi.js
```

**File**: `src/hooks/useApi.js`
```javascript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';

// Query Keys
export const QUERY_KEYS = {
  settings: ['settings'],
  heroSlides: ['heroSlides'],
  articles: (params) => ['articles', params],
  article: (slug) => ['article', slug],
  kajian: (params) => ['kajian', params],
  kajianDetail: (slug) => ['kajian', slug],
  kegiatan: (params) => ['kegiatan', params],
  kegiatanDetail: (slug) => ['kegiatan', slug],
  galleries: (params) => ['galleries', params],
  galleryDetail: (id) => ['gallery', id],
  bidang: ['bidang'],
  pimpinan: ['pimpinan'],
};

// Settings
export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: () => apiService.getSettings().then((res) => res.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Articles
export function useArticles(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.articles(params),
    queryFn: () => apiService.getArticles(params).then((res) => res.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useArticle(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.article(slug),
    queryFn: () => apiService.getArticle(slug).then((res) => res.data.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// Kajian
export function useKajian(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.kajian(params),
    queryFn: () => apiService.getKajian(params).then((res) => res.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

// Kegiatan
export function useKegiatan(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.kegiatan(params),
    queryFn: () => apiService.getKegiatan(params).then((res) => res.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

// Gallery
export function useGalleries(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.galleries(params),
    queryFn: () => apiService.getGalleries(params).then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGalleryDetail(id) {
  return useQuery({
    queryKey: QUERY_KEYS.galleryDetail(id),
    queryFn: () => apiService.getGalleryDetail(id).then((res) => res.data.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Bidang
export function useBidang() {
  return useQuery({
    queryKey: QUERY_KEYS.bidang,
    queryFn: () => apiService.getBidang().then((res) => res.data.data),
    staleTime: 10 * 60 * 1000,
  });
}

// Pimpinan
export function usePimpinan() {
  return useQuery({
    queryKey: QUERY_KEYS.pimpinan,
    queryFn: () => apiService.getPimpinan().then((res) => res.data.data),
    staleTime: 10 * 60 * 1000,
  });
}

// Contact Mutation
export function useSubmitContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => apiService.submitContact(data),
    onSuccess: () => {
      // Optionally invalidate queries
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}
```

**Wrap App dengan QueryClientProvider**:
```jsx
// src/app/providers.js
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Update** `src/app/layout.js`:
```jsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <ThemeProvider ...>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
```

**Status**: ⏳ Pending

---

## 🟠 HIGH PRIORITY (Penting untuk UX)

### 5. ✅ Add Consistent Loading States
**Problem**: Loading states tidak konsisten, user experience buruk

**Action**:
```bash
# Create reusable loading components
mkdir -p src/components/ui
touch src/components/ui/LoadingSkeleton.jsx
touch src/components/ui/PageLoader.jsx
```

**File**: `src/components/ui/LoadingSkeleton.jsx`
```jsx
export function LoadingSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
    </div>
  );
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
    </div>
  );
}

export function GallerySkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
```

**File**: `src/components/ui/PageLoader.jsx`
```jsx
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat...</p>
      </div>
    </div>
  );
}

export function SectionLoader({ children }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <LoadingSkeleton key={i} className="max-w-2xl" />
      ))}
    </div>
  );
}
```

**Usage**:
```jsx
// Before
{loading && <div>Loading...</div>}

// After
import { PageLoader, CardSkeleton } from '@/components/ui';

{isLoading ? (
  <SectionLoader />
) : error ? (
  <ErrorMessage error={error} />
) : (
  <Content data={data} />
)}
```

**Status**: ⏳ Pending

---

### 6. ✅ Add Client-Side Form Validation
**File**: `src/app/(main)/kontak/page.js`
**Problem**: Form kontak tidak ada validasi client-side

**Action**:
```jsx
// Install react-hook-form + zod
npm install react-hook-form @hookform/resolvers zod
```

**Update Kontak Page**:
```jsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitContact } from '@/hooks/useApi';

const contactSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  pesan: z.string().min(10, 'Pesan minimal 10 karakter').max(5000),
});

export default function KontakPage() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting, isSubmitSuccessful } 
  } = useForm({
    resolver: zodResolver(contactSchema),
  });
  
  const { mutate: submitContact } = useSubmitContact();
  
  const onSubmit = (data) => {
    submitContact(data, {
      onSuccess: () => {
        // Reset form
        // Show success toast
      },
      onError: (error) => {
        // Show error toast
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nama" className="block text-sm font-medium mb-1">
          Nama
        </label>
        <input
          {...register('nama')}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.nama ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.nama && (
          <p className="mt-1 text-sm text-red-500">{errors.nama.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="pesan" className="block text-sm font-medium mb-1">
          Pesan
        </label>
        <textarea
          {...register('pesan')}
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.pesan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.pesan && (
          <p className="mt-1 text-sm text-red-500">{errors.pesan.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
      
      {isSubmitSuccessful && (
        <p className="text-green-600 text-center">Pesan berhasil dikirim!</p>
      )}
    </form>
  );
}
```

**Status**: ⏳ Pending

---

### 7. ✅ Create Centralized Image URL Helper
**Problem**: Image URL handling tersebar, replace('/uploads/', '/storage/') tidak konsisten

**Action**:
```bash
touch src/lib/image.js
```

**File**: `src/lib/image.js`
```javascript
/**
 * Centralized image URL handler
 * Handles both local and external images
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000';

/**
 * Get full image URL from backend path
 * @param {string|null|undefined} path - Image path from API
 * @returns {string|null} Full image URL or null
 */
export function getImageUrl(path) {
  if (!path) return null;
  
  // Already full URL (external images, YouTube thumbnails, etc)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Handle different path formats
  // Backend stores as: "artikel/filename.jpg" or "slides/filename.jpg"
  // We need to prepend storage URL
  if (cleanPath.includes('storage/')) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  // Default: assume it's in storage folder
  return `${API_BASE_URL}/storage/${cleanPath}`;
}

/**
 * Get image URL with fallback
 * @param {string|null|undefined} path 
 * @param {string} fallback 
 * @returns {string}
 */
export function getImageUrlWithFallback(path, fallback = '/placeholder.jpg') {
  const url = getImageUrl(path);
  return url || fallback;
}

/**
 * Check if image URL is valid (for external images)
 * @param {string} url 
 * @returns {Promise<boolean>}
 */
export async function isValidImageUrl(url) {
  if (!url) return false;
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

/**
 * Generate YouTube thumbnail URL from video ID
 * @param {string} videoId 
 * @param {string} quality - 'default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault'
 * @returns {string}
 */
export function getYouTubeThumbnail(videoId, quality = 'hqdefault') {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url 
 * @returns {string|null}
 */
export function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Preload image for better UX
 * @param {string} url 
 * @returns {Promise<void>}
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Preload multiple images
 * @param {string[]} urls 
 * @returns {Promise<void[]>}
 */
export function preloadImages(urls) {
  return Promise.all(urls.map(preloadImage));
}
```

**Usage**:
```jsx
import { getImageUrl, getYouTubeThumbnail, extractYouTubeId } from '@/lib/image';

// In component
<Image 
  src={getImageUrl(article.gambar_header)} 
  alt={article.judul}
  fill
  className="object-cover"
/>

// For hero slides
{slide.type === 'video' && (
  <img 
    src={getYouTubeThumbnail(extractYouTubeId(slide.video_id_youtube))} 
    alt={slide.judul}
  />
)}
```

**Status**: ⏳ Pending

---

## 🟡 MEDIUM PRIORITY (Code Quality)

### 8. ✅ Add TypeScript Support
**Problem**: JavaScript only, no type safety

**Action**:
```bash
# Install TypeScript
npm install -D typescript @types/react @types/node @types/react-dom

# Create tsconfig.json
touch tsconfig.json
```

**File**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Rename files**: `.js` → `.tsx` (for components with JSX)

**Status**: ⏳ Pending

---

### 9. ✅ Add ESLint Rules for Consistency
**File**: `eslint.config.mjs`
**Problem**: Basic ESLint config, tidak ada rules untuk React/Next.js best practices

**Action**:
```javascript
// eslint.config.mjs
import { defineConfig } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginNext from '@next/eslint-plugin-next';
import pluginTailwind from 'eslint-plugin-tailwindcss';

export default defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      next: pluginNext,
      tailwindcss: pluginTailwind,
    },
    settings: {
      react: {
        version: '19',
      },
      tailwindcss: {
        config: 'tailwind.config.js',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginNext.configs.recommended.rules,
      ...pluginTailwind.configs.recommended.rules,
      
      // Custom rules
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-useless-fragment': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Next.js
      'next/no-html-link-for-pages': 'error',
      'next/no-img-element': 'error',
      
      // Tailwind
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
    },
  },
]);
```

**Install dependencies**:
```bash
npm install -D eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next eslint-plugin-tailwindcss
```

**Status**: ⏳ Pending

---

### 10. ✅ Add SEO Metadata to All Pages
**Problem**: Hanya root layout yang punya metadata, halaman lain tidak

**Action**:
```jsx
// src/app/(main)/home/page.js
export const metadata = {
  title: 'Beranda | PC IPM Mayong',
  description: 'Website resmi Pimpinan Cabang Ikatan Pelajar Muhammadiyah Mayong',
  openGraph: {
    title: 'PC IPM Mayong',
    description: 'Website resmi PC IPM Mayong',
    type: 'website',
    locale: 'id_ID',
    siteName: 'PC IPM Mayong',
  },
};

// src/app/(main)/tentang/page.js
export const metadata = {
  title: 'Tentang Kami | PC IPM Mayong',
  description: 'Visi, misi, struktur organisasi, dan bidang PC IPM Mayong',
  openGraph: {
    title: 'Tentang Kami - PC IPM Mayong',
    description: 'Visi, misi, struktur organisasi, dan bidang PC IPM Mayong',
    type: 'website',
  },
};

// src/app/(main)/publikasi/page.js
export const metadata = {
  title: 'Publikasi | PC IPM Mayong',
  description: 'Berita, kajian, dan kegiatan terbaru PC IPM Mayong',
  openGraph: {
    title: 'Publikasi - PC IPM Mayong',
    description: 'Berita, kajian, dan kegiatan terbaru PC IPM Mayong',
    type: 'website',
  },
};

// Dynamic metadata for detail pages
// src/app/(main)/publikasi/berita/[slug]/page.js
export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);
  return {
    title: `${article.judul} | PC IPM Mayong`,
    description: article.excerpt || article.isi_konten?.substring(0, 160),
    openGraph: {
      title: article.judul,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.tanggal_publish,
      images: [getImageUrl(article.gambar_header)],
    },
  };
}
```

**Status**: ⏳ Pending

---

### 11. ✅ Add Sitemap & Robots.txt Generation
**Problem**: Tidak ada sitemap.xml untuk SEO

**Action**:
```bash
npm install next-sitemap
```

**File**: `next-sitemap.config.js`
```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pcipm-mayong.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://pcipm-mayong.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Skip private pages
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return null;
    }
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  // Additional paths for dynamic routes
  additionalPaths: async (config) => [
    {
      loc: '/home',
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: '/tentang',
      changefreq: 'weekly',
      priority: 0.8,
    },
    // Add dynamic routes from API
    // Will need a script to fetch and add them
  ],
};
```

**Add to package.json**:
```json
"scripts": {
  "postbuild": "next-sitemap"
}
```

**Status**: ⏳ Pending

---

## 🟢 LOW PRIORITY (Nice to have)

### 12. ✅ Add PWA Support
**Problem**: Bisa di-install sebagai app di mobile

**Action**:
```bash
npm install next-pwa
```

**File**: `next.config.mjs`
```javascript
import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);

export default nextConfig;
```

**File**: `public/manifest.json`
```json
{
  "name": "PC IPM Mayong",
  "short_name": "PC IPM",
  "description": "Website resmi Pimpinan Cabang Ikatan Pelajar Muhammadiyah Mayong",
  "start_url": "/home",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Status**: ⏳ Pending

---

### 13. ✅ Add Analytics (Vercel Analytics / GA4)
**Problem**: Tidak ada tracking user behavior

**Action**:
```bash
# Vercel Analytics (recommended for Vercel deploy)
npm install @vercel/analytics
```

**File**: `src/app/layout.js`
```jsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <ThemeProvider ...>
            {children}
            <Analytics />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
```

**Or GA4**:
```bash
npm install @next/third-parties
```

```jsx
import { GoogleAnalytics } from '@next/third-parties/google';

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

**Status**: ⏳ Pending

---

### 14. ✅ Add Unit/Integration Tests
**Problem**: Tidak ada automated testing

**Action**:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

**File**: `jest.config.js`
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};
```

**File**: `jest.setup.js`
```javascript
import '@testing-library/jest-dom';
```

**Example test**:
```javascript
// src/components/__tests__/Navbar.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('PC IPM Mayong')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  
  it('toggles mobile menu', () => {
    render(<Navbar />);
    const button = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(button);
    expect(screen.getByText('Home')).toBeVisible();
  });
});
```

**Status**: ⏳ Pending

---

### 15. ✅ Add Storybook for Component Documentation
**Problem**: Component library tidak terdokumentasi

**Action**:
```bash
npx storybook@latest init
```

**Status**: ⏳ Pending

---

## 📊 Progress Tracker

- **Critical**: 0/4 completed (0%)
- **High**: 0/3 completed (0%)
- **Medium**: 0/4 completed (0%)
- **Low**: 0/4 completed (0%)

**Total**: 0/15 completed (0%)

---

## 🚀 Quick Start Order

1. **Week 1**: Critical fixes
   - [ ] Error boundaries
   - [ ] API service layer
   - [ ] React Query implementation
   - [ ] Remove unused deps

2. **Week 2**: High priority UX
   - [ ] Loading skeletons
   - [ ] Form validation
   - [ ] Image URL helper

3. **Week 3**: Code quality
   - [ ] TypeScript migration
   - [ ] ESLint rules
   - [ ] SEO metadata

4. **Week 4**: Production ready
   - [ ] Sitemap
   - [ ] PWA
   - [ ] Analytics
   - [ ] Tests

---

## 🔧 Quick Fixes Commands

```bash
# 1. Remove unused dependency
npm uninstall @tanstack/react-query

# 2. Install new dependencies for improvements
npm install react-hook-form @hookform/resolvers zod
npm install -D typescript @types/react @types/node @types/react-dom

# 3. Create folder structure
mkdir -p src/services src/hooks src/components/ui src/lib

# 4. Run lint to see current issues
npm run lint
```

---

**Last Updated**: August 4, 2026
**Priority**: Start with CRITICAL items