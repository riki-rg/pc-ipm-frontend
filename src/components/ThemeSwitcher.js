"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const label = isDark ? 'Aktifkan tema terang' : 'Aktifkan tema gelap';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      disabled={!mounted}
      title={label}
      aria-label={label}
      aria-pressed={isDark}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ipm-green-deep transition-colors hover:bg-ipm-green-deep/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ipm-yellow focus-visible:ring-offset-2 disabled:cursor-wait dark:text-gray-100 dark:hover:bg-white/10"
    >
      <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
    </button>
  );
}