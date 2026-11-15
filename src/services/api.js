import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';

// Create axios instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api`,
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
    if (error.response?.status === 500) {
      console.error('Server Error');
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
