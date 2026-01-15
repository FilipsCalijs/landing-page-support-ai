"use client";

import { useTranslations } from 'next-intl';
import { Star, Briefcase, Building2 } from 'lucide-react';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function PricingSection() {
  const t = useTranslations('Main');

  const plans = [
    {
      id: 'Starter',
      icon: <Star className="w-8 h-8 text-slate-700" />,
      iconBg: 'bg-slate-50',
      color: 'default' as const,
      border: 'border border-transparent',
      features: ['li1', 'li2', 'li3'],
    },
    {
      id: 'Business',
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      iconBg: 'bg-blue-50',
      color: 'blue50' as const,
      border: 'border border-transparent',
      features: ['li1', 'li2', 'li3', 'li4'],
    },
    {
      id: 'Enterprise',
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
      iconBg: 'bg-orange-50',
      color: 'orange500' as const,
      border: 'border-2 border-orange-200',
      features: ['li1', 'li2', 'li3', 'li4'],
    },
  ];

  return (
    <section className="mt-32 px-4 flex flex-col items-center bg-[url('/bg-pattern.png')] bg-repeat">
      <div className="text-center mb-20">
        <Typography variant="h2" weight="bold">
          {t('Pricing.title')}
        </Typography>
        <div className="mt-4">
          <Typography variant="body1" color="muted">
            {t('Pricing.description')}
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[80rem] border-orange-200">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            size="card" 
            color={plan.color} 
            className={cn("flex flex-col h-full", plan.border)}
          >
            <CardHeader padding="lg">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8", plan.iconBg)}>
                {plan.icon}
              </div>
              <Typography weight="bold">
                {t(`Pricing.Plans.${plan.id}.title`)}
              </Typography>
            </CardHeader>

            <CardContent padding="lg" className="flex-grow">
              <div className="mb-8">
                <Typography variant="body3" className="text-slate-600 leading-relaxed">
                  {t(`Pricing.Plans.${plan.id}.description`)}
                </Typography>
              </div>

              <ul className="space-y-5">
                {plan.features.map((featureKey) => (
                  <li key={featureKey} className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                    <Typography variant="body3">
                      {t(`Pricing.Plans.${plan.id}.li.${featureKey}`)}
                    </Typography>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter padding="lg" className="flex gap-4">
                {/* Основная кнопка */}
                <Button
                    className="flex-1"
                    variant={plan.id === 'Starter' ? 'outline' : 'primary'}
                    size="lg"
                >
                    {t(`Pricing.Plans.${plan.id}.btn`)}
                </Button>

           
                {plan.id !== 'Starter' && (
                    <Button
                    className="flex-1"
                    variant="outline"
                    size="lg"
                    >
                    {t(`Pricing.Plans.${plan.id}.btn2`)}
                    </Button>
                )}
                </CardFooter>

          </Card>
        ))}
      </div>
    </section>
  );
}