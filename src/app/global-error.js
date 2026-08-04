'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900">
              Aplikasi Error
            </h2>
            <p className="mt-2 text-gray-600">
              {error?.message || 'Terjadi kesalahan tidak terduga'}
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
