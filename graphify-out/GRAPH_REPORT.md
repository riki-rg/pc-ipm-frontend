# Graph Report - pc-ipm-frontend  (2026-11-18)

## Corpus Check
- Corpus is ~11,374 words - fits in a single context window. You may not need a graph.

## Summary
- 194 nodes · 315 edges · 21 communities (12 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Next.js Dependencies & ESLint Config
- Galeri Pages & Error Handling
- PC IPM Brand Assets & Features
- Docker Compose & Webstack Config
- Kontak Page, Validation & API Client
- Splash, Tentang & Motion Components
- Main Layout, Navbar, Footer & Axios
- Loading Skeletons & Page Loaders
- Root Layout, Fonts & Theme Provider
- Image URL & Thumbnail Utilities
- Dynamic XML Sitemap Generator
- JSConfig Path Aliases
- Next.js Config
- Starter UI SVG Icons
- Logo Proxy Route Handler
- PostCSS ESM Config

## God Nodes (most connected - your core abstractions)
1. `react` - 18 edges
2. `next` - 17 edges
3. `BackButton()` - 17 edges
4. `axios` - 13 edges
5. `framer-motion` - 12 edges
6. `PC IPM Mayong Frontend Application` - 10 edges
7. `pc-ipm-frontend` - 8 edges
8. `lucide-react` - 8 edges
9. `scripts` - 5 edges
10. `PC IPM Mayong Pelantikan & Raker Group Portrait` - 5 edges

## Surprising Connections (you probably didn't know these)
- `PC IPM Mayong Pelantikan & Raker Group Portrait` --conceptually_related_to--> `Homepage & Animated Splash Page Feature`  [INFERRED]
  public/foto-kami.jpg → README.md
- `PC IPM Mayong Pelantikan & Raker Group Portrait` --conceptually_related_to--> `Galeri Foto & Lightbox Feature`  [INFERRED]
  public/foto-kami.jpg → README.md
- `Next.js 16.0.2 & React 19.2.0 Frontend Tech Stack` --conceptually_related_to--> `Next.js Brand Wordmark Logo SVG`  [INFERRED]
  README.md → public/next.svg
- `30 Inaugurated PC IPM Mayong Officers (14 Women Seated, 16 Men Standing)` --conceptually_related_to--> `Tentang Kami (Visi, Misi, Bidang & Pengurus) Feature`  [INFERRED]
  public/foto-kami.jpg → README.md
- `Vercel Deployment Target` --conceptually_related_to--> `Vercel Triangle Brand Mark SVG`  [INFERRED]
  README.md → public/vercel.svg

## Import Cycles
- None detected.

## Communities (21 total, 9 thin omitted)

### Community 0 - "Next.js Dependencies & ESLint Config"
Cohesion: 0.07
Nodes (36): eslintConfig, dependencies, axios@^1.13.2, framer-motion@^12.23.24, @headlessui/react@^2.2.9, lucide-react@^0.562.0, next@16.0.2, react@19.2.0 (+28 more)

### Community 1 - "Galeri Pages & Error Handling"
Cohesion: 0.19
Nodes (16): axios, lucide-react, next, react, DetailGaleriPage(), cardVariants, GaleriPage(), kategoriFilter (+8 more)

### Community 2 - "PC IPM Brand Assets & Features"
Cohesion: 0.14
Nodes (18): Kecamatan Mayong District Hall (Pendopo/Aula) Venue, PELANTIKAN & RAKER Backdrop Banner with PC IPM Mayong Branding, PC IPM Mayong Pelantikan & Raker Group Portrait, 30 Inaugurated PC IPM Mayong Officers (14 Women Seated, 16 Men Standing), Surah Al-Qalam (Quran 68:1) Calligraphy & Open Book Symbolism, Ikatan Pelajar Muhammadiyah (IPM) Official Pen-Shield Emblem, Next.js Brand Wordmark Logo SVG, Vercel Triangle Brand Mark SVG (+10 more)

### Community 3 - "Docker Compose & Webstack Config"
Cohesion: 0.12
Nodes (16): context, dockerfile, NEXT_TELEMETRY_DISABLED, NODE_ENV, networks, webstack, build, container_name (+8 more)

### Community 4 - "Kontak Page, Validation & API Client"
Cohesion: 0.19
Nodes (12): @hookform/resolvers@^5.7.1, zod@^3.25.76, @hookform/resolvers, zod, contactSchema, fixUrl(), formatWaLink(), KontakPage() (+4 more)

### Community 5 - "Splash, Tentang & Motion Components"
Cohesion: 0.29
Nodes (6): framer-motion, containerVariants, itemVariants, TentangPage(), AnimatedCounter(), BidangModal()

### Community 6 - "Main Layout, Navbar, Footer & Axios"
Cohesion: 0.31
Nodes (6): MainLayout(), Footer(), dummyMenu, Navbar(), ThemeSwitcher(), api

### Community 7 - "Loading Skeletons & Page Loaders"
Cohesion: 0.44
Nodes (7): CardSkeleton(), GallerySkeleton(), ListSkeleton(), LoadingSkeleton(), PageLoader(), SectionLoader(), SpinnerLoader()

### Community 8 - "Root Layout, Fonts & Theme Provider"
Cohesion: 0.28
Nodes (5): next-themes@^0.4.6, next-themes, jakarta, RootLayout(), NextThemeProvider()

### Community 9 - "Image URL & Thumbnail Utilities"
Cohesion: 0.28
Nodes (4): getImageUrl(), getImageUrlWithFallback(), preloadImage(), preloadImages()

### Community 10 - "Dynamic XML Sitemap Generator"
Cohesion: 0.53
Nodes (5): entry(), getPublishedItems(), revalidate, sitemap(), validDate()

### Community 13 - "Starter UI SVG Icons"
Cohesion: 1.00
Nodes (3): Document / File UI Icon (16x16 Next.js Starter Asset), Globe / Web UI Icon (16x16 Next.js Starter Asset), Browser Window UI Icon (16x16 Next.js Starter Asset)

## Knowledge Gaps
- **7 isolated node(s):** `Publikasi (Berita, Kajian, Kegiatan) Feature`, `Kontak & Info Pimpinan Feature`, `Laravel Backend REST API (http://localhost:8000/api)`, `Kecamatan Mayong District Hall (Pendopo/Aula) Venue`, `Surah Al-Qalam (Quran 68:1) Calligraphy & Open Book Symbolism` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 60 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Galeri Pages & Error Handling` to `Next.js Dependencies & ESLint Config`, `Kontak Page, Validation & API Client`, `Splash, Tentang & Motion Components`, `Main Layout, Navbar, Footer & Axios`, `Root Layout, Fonts & Theme Provider`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `Publikasi (Berita, Kajian, Kegiatan) Feature`, `Kontak & Info Pimpinan Feature`, `Laravel Backend REST API (http://localhost:8000/api)` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Next.js Dependencies & ESLint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06827880512091039 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Galeri Pages & Error Handling` to `Next.js Dependencies & ESLint Config`, `Kontak Page, Validation & API Client`, `Splash, Tentang & Motion Components`, `Main Layout, Navbar, Footer & Axios`, `Root Layout, Fonts & Theme Provider`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `PC IPM Brand Assets & Features` be split into smaller, more focused modules?**
  _Cohesion score 0.1437908496732026 - nodes in this community are weakly interconnected._
- **Why does `axios` connect `Galeri Pages & Error Handling` to `Next.js Dependencies & ESLint Config`, `Kontak Page, Validation & API Client`, `Splash, Tentang & Motion Components`, `Main Layout, Navbar, Footer & Axios`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `Docker Compose & Webstack Config` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._