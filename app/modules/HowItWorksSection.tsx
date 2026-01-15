// modules/HowItWorksSection.tsx
import { useTranslations } from 'next-intl';
import { Typography } from '@/components/ui/Typography';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';
import { steps } from './data';

export function HowItWorksSection() {
  const t = useTranslations('Main');

  return (
    <section id="how-it-works" className="mt-32 w-full max-w-[74rem] px-4 flex flex-col items-center">
      <Typography variant="h2" weight="bold">{t('HowItWorks.title')}</Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full">
        {steps.map((step) => (
          <Card key={step.id} className="rounded-[1.5rem] border-none bg-white shadow-sm">
            <CardContent className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 flex flex-wrap items-center justify-center rounded-xl bg-[#F0F7FF]">
                <ArrowRight className="w-5 h-5 text-[#0070F3]" />
              </div>
              <Typography variant="body1" weight="bold">
                {step.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
