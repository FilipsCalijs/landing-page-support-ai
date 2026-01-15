'use client';

import { useTransition } from 'react'; // Добавляем этот хук
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from './../i18n.navigation'; 
import { locales, type Locale } from './../i18n.config'; 

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition(); // Инициализируем переход
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
   
    // Оборачиваем навигацию в startTransition
    // Это говорит React и Next.js, что обновление роутера — это ожидаемое действие
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className={`flex gap-2 p-2 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      {locales.map((lang) => (
        <button
          key={lang}
          disabled={isPending}
          onClick={() => handleLanguageChange(lang)}
          className={`px-2 py-1 transition-colors ${
            locale === lang 
              ? 'font-bold underline text-blue-600' 
              : 'text-gray-600 hover:text-black'
          }`}
          style={{ cursor: isPending ? 'not-allowed' : 'pointer' }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}