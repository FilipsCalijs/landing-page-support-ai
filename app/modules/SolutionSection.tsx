// modules/SolutionSection.tsx
import { useTranslations } from 'next-intl';
import { Typography } from '@/components/ui/Typography';
import { Card, CardContent } from '@/components/ui/Card';
import { problemItems, solutionItems } from './data';

export function SolutionSection() {
  const t = useTranslations('Main');

  const renderList = (items: typeof problemItems) =>
    items.map((item) => {
      const Icon = item.icon;
      return (
        <div key={item.id} className="flex items-center gap-4">
          <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${item.bgColor}`}>
            <Icon className={`w-6 h-6 ${item.color}`} />
          </div>
          <Typography variant="body1" weight="semibold" className="text-[1.15rem]">
            {item.text}
          </Typography>
        </div>
      );
    });

  return (
    <section id="solution" className="mt-32 w-full max-w-[74rem] px-4 flex flex-col items-center gap-6">
      <Typography variant="h2" weight="bold">{t('Cards.title')}</Typography>
      
      <Typography variant="body1">{t('Cards.description')}</Typography>
      <div className="mt-6 flex flex-col md:flex-row gap-8 w-full justify-center">
        <Card variant="elevated" className="max-w-[24rem] w-full rounded-[2.5rem] bg-white border-none shadow-sm">
          <CardContent className="flex flex-col gap-8 p-8">
            <Typography variant="body2" weight="bold" className="text-[1.5rem]">
              {t('Cards.BadgeBefore.heading')}
            </Typography>
            {renderList(problemItems)}
          </CardContent>
        </Card>

        <Card variant="elevated" className="max-w-[24rem] w-full rounded-[2.5rem] bg-white border-none shadow-sm">
          <CardContent className="flex flex-col gap-8 p-8">
            <Typography variant="body2" weight="bold" className="text-[1.5rem]">
               {t('Cards.BadgeAfter.heading')}
            </Typography>
            {renderList(solutionItems)}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
