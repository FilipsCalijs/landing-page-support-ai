'use client';

import { useRouter } from 'next/navigation';
import { locales } from '@/i18n.config';

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();

  const handleLocaleChange = (newLocale: string) => {
    // Set cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Refresh page to apply new locale
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            currentLocale === locale
              ? 'bg-[#0070F3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
