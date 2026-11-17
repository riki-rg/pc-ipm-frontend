const SITE_URL = 'https://pc-ipm-mayong.web.id';
const API_URL = `${SITE_URL}/api`;

async function getPublishedItems(endpoint) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return [];

    const payload = await response.json();
    if (payload?.status !== 'success' || !Array.isArray(payload.data)) return [];

    return payload.data;
  } catch (error) {
    console.error(`Failed to load ${endpoint} for sitemap:`, error);
    return [];
  }
}

function validDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function entry(path, options = {}) {
  return {
    url: `${SITE_URL}${path}`,
    ...options,
  };
}

export default async function sitemap() {
  const staticPages = [
    entry('/', { changeFrequency: 'weekly', priority: 1 }),
    entry('/home', { changeFrequency: 'weekly', priority: 1 }),
    entry('/tentang', { changeFrequency: 'monthly', priority: 0.7 }),
    entry('/publikasi', { changeFrequency: 'daily', priority: 0.9 }),
    entry('/galeri', { changeFrequency: 'weekly', priority: 0.8 }),
    entry('/kontak', { changeFrequency: 'monthly', priority: 0.6 }),
  ];

  const [articles, kajian, activities, albums] = await Promise.all([
    getPublishedItems('artikel'),
    getPublishedItems('kajian'),
    getPublishedItems('kegiatan'),
    getPublishedItems('galeri'),
  ]);

  const articlePages = articles
    .filter((item) => item?.slug && item.status === 'published')
    .map((item) => entry(`/publikasi/berita/${encodeURIComponent(item.slug)}`, {
      lastModified: validDate(item.updated_at || item.tanggal_publish),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const studyPages = kajian
    .filter((item) => item?.slug)
    .map((item) => entry(`/publikasi/kajian/${encodeURIComponent(item.slug)}`, {
      lastModified: validDate(item.updated_at || item.waktu),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  const activityPages = activities
    .filter((item) => item?.slug)
    .map((item) => entry(`/publikasi/kegiatan/${encodeURIComponent(item.slug)}`, {
      lastModified: validDate(item.updated_at || item.tanggal),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  const albumPages = albums
    .filter((item) => item?.id !== undefined && item?.id !== null)
    .map((item) => entry(`/galeri/${encodeURIComponent(String(item.id))}`, {
      lastModified: validDate(item.updated_at || item.created_at),
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  return [...staticPages, ...articlePages, ...studyPages, ...activityPages, ...albumPages];
}

export const revalidate = 3600;
