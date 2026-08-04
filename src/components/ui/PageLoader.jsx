import { LoadingSkeleton } from './LoadingSkeleton';

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

export function SectionLoader({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} className="max-w-2xl" />
      ))}
    </div>
  );
}

export function SpinnerLoader({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizes[size]} ${className}`} />
  );
}
