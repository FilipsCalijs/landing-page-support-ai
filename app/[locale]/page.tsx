import { useTranslations } from 'next-intl';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  MailWarning, 
  Pointer, 
  MessageSquareDashed, 
  Signal, 
  Bot, 
  CheckCircle2, 
  Sparkles, 
  Zap,
  ArrowRight
} from 'lucide-react';

export default function IndexPage() {
  const t = useTranslations('Main');

  const problemItems = [
    { id: 1, text: 'Inbox overload', icon: <MailWarning className="w-6 h-6 text-orange-500" />, bgColor: 'bg-orange-50' },
    { id: 2, text: 'Manual sorting', icon: <Pointer className="w-6 h-6 text-orange-500" />, bgColor: 'bg-orange-50' },
    { id: 3, text: 'Missed requests', icon: <MessageSquareDashed className="w-6 h-6 text-orange-500" />, bgColor: 'bg-orange-50' },
    { id: 4, text: 'Noise instead of signal', icon: <Signal className="w-6 h-6 text-orange-500" />, bgColor: 'bg-orange-50' },
  ];

  const solutionItems = [
    { id: 1, text: 'AI automated replies', icon: <Bot className="w-6 h-6 text-blue-500" />, bgColor: 'bg-blue-50' },
    { id: 2, text: 'Smart categorization', icon: <Zap className="w-6 h-6 text-blue-500" />, bgColor: 'bg-blue-50' },
    { id: 3, text: 'Instant response', icon: <Sparkles className="w-6 h-6 text-blue-500" />, bgColor: 'bg-blue-50' },
    { id: 4, text: 'Clear signal only', icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />, bgColor: 'bg-blue-50' },
  ];

  const steps = [
    { id: 1, title: 'Intent detected' },
    { id: 2, title: 'Classification' },
    { id: 3, title: 'Information extraction' },
    { id: 4, title: 'Action triggered' },
  ];

  return (
    <main className="flex flex-col items-center pb-32">
      <section id="product" className="flex pt-40 max-w-[74rem] flex-col items-center text-center px-4">
        <Typography variant="h2" color="foreground" weight="bold">
          {t('Hero.title')}
        </Typography>
        <div className="mt-4 max-w-[40rem]">
          <Typography variant="body1" color="foreground" weight="normal">
            {t('Hero.description')}
          </Typography>
        </div>
        <div className="flex gap-4 mt-8">
          <Button size="lg">{t('Hero.demo')}</Button>
          <Button variant="outline" size="lg">{t('Hero.contactUs')}</Button>
        </div>
        <img
          src="/odly_front_image_demo.png"
          alt={t('Hero.altimg')}
          className="mt-16 w-full max-w-[60rem] rounded-2xl shadow-2xl border"
        />
      </section>

      <section id="solution" className="pt-32 w-full max-w-[74rem] px-4 flex flex-col items-center">
        <div className="text-center mb-12">
          <Typography variant="h2" color="foreground" weight="bold">
            {t('Cards.title')}
          </Typography>
          <div className="mt-4 max-w-[40rem] mx-auto">
            <Typography variant="body1" color="muted">
              {t('Hero.description')}
            </Typography>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 w-full">
          <Card className="w-full max-w-[24rem] min-h-[28rem] rounded-[2.5rem] shadow-sm border-none bg-white">
            <CardContent className="flex flex-col gap-8 p-8">
              <Typography variant="body2" weight="bold" className="text-[1.5rem]">
                {t('Cards.BadgeBefore.heading')}
              </Typography>
              <div className="flex flex-col gap-6">
                {problemItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${item.bgColor}`}>
                      {item.icon}
                    </div>
                    <Typography variant="body1" weight="semibold" className="text-[1.15rem]">
                      {item.text}
                    </Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-[24rem] min-h-[28rem] rounded-[2.5rem] shadow-sm border-none bg-white">
            <CardContent className="flex flex-col gap-8 p-8">
              <Typography variant="body2" weight="bold" className="text-[1.5rem]">
                After AI Concierge
              </Typography>
              <div className="flex flex-col gap-6">
                {solutionItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${item.bgColor}`}>
                      {item.icon}
                    </div>
                    <Typography variant="body1" weight="semibold" className="text-[1.15rem]">
                      {item.text}
                    </Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="mt-32 w-full max-w-[74rem] px-4 flex flex-col items-center">
        <div className="text-center mb-12">
          <Typography variant="h2" color="foreground" weight="bold">
            {t('HowItWorks.title')}
          </Typography>
          <div className="mt-4 max-w-[40rem] mx-auto">
            <Typography variant="body1" color="muted">
              {t('HowItWorks.description')}
            </Typography>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((step) => (
            <Card 
              key={step.id} 
              className="rounded-[1.5rem] border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] bg-white overflow-hidden"
            >
              <CardContent className="flex items-center gap-4 p-6 min-h-[6rem]">
                <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-[#F0F7FF] border border-[#E0EFFF]">
                  <ArrowRight className="w-5 h-5 text-[#0070F3]" />
                </div>
                <Typography 
                  variant="body1" 
                  weight="bold" 
                  className="text-[1.15rem] leading-[1.2] tracking-tight text-[#1A1A1A]"
                >
                  {step.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

      </section>

      

      
    </main>
  );
}