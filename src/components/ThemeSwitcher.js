"use client";

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher() {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();

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
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ipm-green-deep transition-colors hover:bg-ipm-green-deep/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ipm-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ipm-paper disabled:cursor-wait dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-offset-gray-900"
    >
      <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
    </button>
  );
}