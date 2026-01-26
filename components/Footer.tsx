import Image from 'next/image';
import { Link } from '@/i18n.navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from './ui/Button';
import type { Dictionary } from '@/i18n/dictionaries';

export default function Footer({ dictionary }: { dictionary: Dictionary }) {

  return (
    <footer className="w-full max-w-[74rem] mx-auto flex justify-between items-center p-8 mt-20 border-t bg-white">
      <div className="flex items-center gap-2 font-bold text-xl">
        <Image
          src="/odly_blue_logo.png" 
          alt={dictionary.Main.Footer.altImg} 
          width={120}
          height={32}
          priority
        />
      </div>
      
      <nav className="hidden md:flex gap-6 items-center">
  
        <Link href="/product">{dictionary.Main.Footer.product}</Link>
        <Link href="/solution">{dictionary.Main.Footer.solution}</Link>
        <LanguageSwitcher />
      </nav>

      <Button size="sm" className='rounded-4xl px-8'>
        {dictionary.Main.Footer.getStarted} 
      </Button>
    </footer>
  );
}
