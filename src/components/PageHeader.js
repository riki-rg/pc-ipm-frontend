/**
 * Header halaman konsisten untuk semua halaman publik (list & detail).
 * Dipakai bersama BackButton agar navigasi seragam.
 */
export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-10">
      <div className="accent-rule mb-4 w-16" aria-hidden="true" />
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold tracking-wide text-ipm-green-soft">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-extrabold text-ipm-ink md:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-2xl leading-relaxed text-gray-600">{description}</p>
      )}
    </div>
  );
}
