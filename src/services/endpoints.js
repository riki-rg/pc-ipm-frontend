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
