import { Link } from '@/i18n.navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { Typography } from './ui/Typography';
import { Button } from './ui/Button';

export default function Footer() {

  const t = useTranslations('Footer');
  return (
    <footer className="w-full max-w-[74rem] mx-auto flex justify-between items-center p-8 mt-20 border-t bg-white">
      <div className="flex items-center gap-2 font-bold text-xl">
        <img
          src="/odly_blue_logo.png" 
          alt={t('altImg')} 
          className=""
        />
    
      </div>
      
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/product">{t('product')}</Link>
        <Link href="/solution">{t('solution')}</Link>
        <LanguageSwitcher />
      </nav>

      <Button size="sm">
        {t('altimg')}
      </Button>
    </footer>
  );
}