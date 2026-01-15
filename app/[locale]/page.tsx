import { HeroSection } from '../modules/HeroSection';
import { SolutionSection } from '../modules/SolutionSection';
import { HowItWorksSection } from '../modules/HowItWorksSection';
import { ChannelSection } from '../modules/ChannelSection';
import { PricingSection } from '../modules/PricingSection';
import { ContactSection } from '../modules/ContactSection'

export default function IndexPage() {
  return (
    <main className="flex flex-col items-center pb-32">
      <HeroSection />
      <SolutionSection />
      <HowItWorksSection />
      <ChannelSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}
