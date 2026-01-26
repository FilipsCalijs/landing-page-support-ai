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
import type { Dictionary } from '@/i18n/dictionaries';

export function PricingSection({ dictionary }: { dictionary: Dictionary }) {

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
    <section id="pricing" className="mt-32 px-4 flex flex-col items-center bg-[url('/bg-pattern.png')] bg-repeat">
      <div className="text-center mb-20">
        <Typography variant="h2" weight="bold">
          {dictionary.Main.Pricing.title}
        </Typography>
        <div className="mt-4">
          <Typography variant="body1" color="muted">
            {dictionary.Main.Pricing.description}
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl border-orange-200">
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
                {dictionary.Main.Pricing.Plans[plan.id as keyof typeof dictionary.Main.Pricing.Plans].title}
              </Typography>
            </CardHeader>

            <CardContent padding="lg" className="grow">
              <div className="mb-8">
                <Typography variant="body3" className="text-slate-600 leading-relaxed">
                  {dictionary.Main.Pricing.Plans[plan.id as keyof typeof dictionary.Main.Pricing.Plans].description}
                </Typography>
              </div>

              <ul className="space-y-5">
                {plan.features.map((featureKey) => (
                  <li key={featureKey} className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                    <Typography variant="body3">
                      {dictionary.Main.Pricing.Plans[plan.id as keyof typeof dictionary.Main.Pricing.Plans].li[featureKey as keyof typeof dictionary.Main.Pricing.Plans.Starter.li]}
                    </Typography>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter padding="lg" className="flex gap-4">
                {/* Main button */}
                <Button
                    className="flex-1 rounded-xl"
                    variant={plan.id === 'Starter' ? 'outline' : 'primary'}
                    size="lg"
                >
                    <Typography variant="body4" color={plan.id === 'Starter' ? 'black' : 'white'} className="whitespace-nowrap">
                    {dictionary.Main.Pricing.Plans[plan.id as keyof typeof dictionary.Main.Pricing.Plans].btn}
                    </Typography>
                </Button>

           
                {plan.id !== 'Starter' && (
                    <a href="#contact-us" className="flex-1">
                      <Button
                      className="w-full rounded-xl"
                      variant="outline"
                      size="lg"
                      >
                        <Typography variant="body4" className="whitespace-nowrap">{dictionary.Main.Pricing.Plans[plan.id as keyof typeof dictionary.Main.Pricing.Plans].btn2}</Typography>
                      </Button>
                    </a>
                )}
                </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}