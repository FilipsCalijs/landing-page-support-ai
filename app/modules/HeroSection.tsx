// modules/HeroSection.tsx
import { useTranslations } from 'next-intl';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const t = useTranslations('Main');

  return (
    <section id="product" className="flex mt-32 max-w-[74rem] flex-col items-center gap-8">
      <Typography variant="h2" weight="bold" className='text-center'>{t('Hero.title')}</Typography>

      <div className="max-w-[40rem]">
        <Typography variant="body1">{t('Hero.description')}</Typography>
      </div>

      <div className="flex gap-4">
        <Button size="lg" className='rounded-[2rem]'>{t('Hero.demo')}</Button>
        <Button  size="lg" className='rounded-[2rem]'>{t('Hero.contactUs')}</Button>
      </div>

      <img
        src="/odly_front_image_demo.png"
        alt={t('Hero.altimg')}
        className="w-full max-w-[60rem] rounded-2xl shadow-2xl border"
      />
    </section>
  );
}
