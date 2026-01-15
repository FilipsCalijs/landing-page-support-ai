import { Link } from '@/i18n.navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { Button } from './ui/Button';

export default function Footer() {
  // Мы сразу входим в ветку Main -> Footer
  const t = useTranslations('Main.Footer');

  return (
    <footer className="w-full max-w-[74rem] mx-auto flex justify-between items-center p-8 mt-20 border-t bg-white">
      <div className="flex items-center gap-2 font-bold text-xl">
        <img
          src="/odly_blue_logo.png" 
          alt={t('altImg')} 
        />
      </div>
      
      <nav className="hidden md:flex gap-6 items-center">
  
        <Link href="/product">{t('product')}</Link>
        <Link href="/solution">{t('solution')}</Link>
        <LanguageSwitcher />
      </nav>

      <Button size="sm">
        {t('getStarted')} 
      </Button>
    </footer>
  );
}