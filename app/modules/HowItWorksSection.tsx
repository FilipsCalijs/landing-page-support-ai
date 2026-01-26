// modules/HowItWorksSection.tsx
import { Typography } from '@/components/ui/Typography';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';
import { getSteps } from './data';
import type { Dictionary } from '@/i18n/dictionaries';

export function HowItWorksSection({ dictionary }: { dictionary: Dictionary }) {
  const steps = getSteps(dictionary);

  return (
    <section id="how-it-works" className="mt-32 w-full max-w-296 px-4 flex flex-col items-center">
      <Typography variant="h2" weight="bold">{dictionary.Main.HowItWorks.title}</Typography>

      <div className="flex flex-row items-stretch justify-between gap-6 mt-12 w-full">
        {steps.map((step) => (
          <Card key={step.id} className="rounded-3xl border-none bg-white shadow-sm flex-1">
            <CardContent className="flex flex-row items-start gap-4">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-[#F0F7FF]">
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
