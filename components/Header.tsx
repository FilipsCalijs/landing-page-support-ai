import NextLink from 'next/link';
import { Link } from '@/i18n.navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

import { Button } from './ui/Button';

export default function Header() {
  const t = useTranslations('Main');

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[1180px] max-w-[95%] flex justify-between items-center px-8 py-4 border bg-white/80 backdrop-blur-md z-50 rounded-[2rem] shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/odly_blue_logo.png" 
          alt={t('Header.altImg')} 
          className="h-8 w-auto object-contain"
        />
      </Link>

      <nav className="hidden md:flex gap-8 items-center">
        <NextLink 
          href="#product" 
          className="text-[15px] font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          {t('Header.product')}
        </NextLink>
        <NextLink 
          href="#solution" 
          className="text-[15px] font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          {t('Header.solution')}
        </NextLink>
        <div className="w-[1px] h-4 bg-border mx-2" />
        <LanguageSwitcher />
      </nav>

      <div className="flex items-center gap-4">
        <Button size="sm" className="rounded-full px-6">
          {t('Header.getStarted')}
        </Button>
      </div>
    </header>
  );
}