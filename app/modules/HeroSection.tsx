// modules/HeroSection.tsx
import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import type { Dictionary } from '@/app/[locale]/dictionaries';

export function HeroSection({ dictionary }: { dictionary: Dictionary }) {

  return (
    <section id="product" className="flex mt-32 max-w-296 flex-col items-center gap-8">
      <Typography variant="h2" weight="bold" className='text-center'>{dictionary.Main.Hero.title}</Typography>

      <div className="max-w-160">
        <Typography variant="body1">{dictionary.Main.Hero.description}</Typography>
      </div>

      <div className="flex gap-4">
        <Button size="lg" className='rounded-4xl px-8'>{dictionary.Main.Hero.demo}</Button>
        <Button  size="lg" className='rounded-4xl px-8'>{dictionary.Main.Hero.contactUs}</Button>
      </div>

      <Image
        src="/odly_front_image_demo.png"
        alt={dictionary.Main.Hero.altimg}
        width={960}
        height={640}
        className="w-full max-w-240 rounded-2xl shadow-2xl border"
        priority
      />
    </section>
  );
}
