'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from './../i18n.navigation'; 
// 1. Импортируем список языков из твоего конфига
import { locales } from './../i18n.config'; 

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Обновляем куку
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

    // Переключаем язык
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2 p-2">
      {/* 2. Используем переменную locales из конфига */}
      {locales.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          style={{
            fontWeight: locale === lang ? 'bold' : 'normal',
            textDecoration: locale === lang ? 'underline' : 'none',
            color: locale === lang ? '#0070f3' : 'inherit',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}