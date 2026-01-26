import { getDictionary } from '../i18n/dictionaries';
import { getLocale } from '@/lib/locale';
import { HeroSection } from './modules/HeroSection';
import { SolutionSection } from './modules/SolutionSection';
import { HowItWorksSection } from './modules/HowItWorksSection';
import { ChannelSection } from './modules/ChannelSection';
import { PricingSection } from './modules/PricingSection';
import { ContactSection } from './modules/ContactSection';

export default async function IndexPage() {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  return (
    <main className="flex flex-col items-center pb-32">
      <HeroSection dictionary={dictionary} />
      <SolutionSection dictionary={dictionary} />
      <HowItWorksSection dictionary={dictionary} />
      <ChannelSection dictionary={dictionary} />
      <PricingSection dictionary={dictionary} />
      <ContactSection />
    </main>
  );
}
