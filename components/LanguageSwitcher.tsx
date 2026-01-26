'use client';

import { useTransition } from 'react'; // Add this hook
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from './../i18n.navigation'; 
import { locales, type Locale } from './../i18n.config'; 

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition(); // Initialize transition
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
   
    // Wrap navigation in startTransition
    // This tells React and Next.js that the router update is an expected action
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
              ? 'text-[16px] font-semibold text-blue-600' 
              : 'text-[16px] font-semibold text-foreground/70 hover:text-foreground'
          }`}
          style={{ cursor: isPending ? 'not-allowed' : 'pointer' }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}