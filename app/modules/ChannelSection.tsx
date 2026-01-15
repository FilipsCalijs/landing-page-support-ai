"use client";

import Image from 'next/image';
import { channelLogos, channelActions } from './data';
import { useTranslations } from 'next-intl';
import { Typography } from '@/components/ui/Typography';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function ChannelSection() {
  const t = useTranslations('Main');

  return (
    <section
      id="channel"
      className="mt-32 w-full max-w-[74rem] px-4 flex flex-col items-center"
    >
      {/* Заголовок */}
      <Typography variant="h2" weight="bold">
        {t('Actions.title')}
      </Typography>

      {/* Описание */}
      <div className="mt-4 max-w-[40rem] text-center">
        <Typography variant="body1">
          {t('Actions.description')}
        </Typography>
      </div>

      {/* Логотипы каналов */}
      <div className="flex items-center justify-center gap-12 mt-8">
        {channelLogos.map((logo) => (
          <div
            key={logo.id}
            className="w-12 h-12 relative grayscale opacity-80 hover:opacity-100 transition"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Блоки действий */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
        {channelActions.map((action) => (
          <Card
            key={action.id}
            variant="elevated"
            color='orange500'
            className="flex flex-col items-center justify-center p-4"
            style={{ width: '224px', height: '200px' }} // фиксированный размер
          >
            <div className="w-10 h-10 mb-4 flex items-center justify-center bg-green-100 rounded-2">
              <ArrowRight className="w-5 h-5 text-green-700" />
            </div>
            <Typography variant="body2" className="text-center">
              {action.name}
            </Typography>
          </Card>
        ))}
      </div>
    </section>
  );
}
