import NextLink from 'next/link';
import Image from 'next/image';
import { Button } from './ui/Button';
import type { Dictionary } from '@/i18n/dictionaries';
import { LocaleSwitcher } from './LocaleSwitcher';
import { getLocale } from '@/lib/locale';

export default async function Header({ dictionary }: { dictionary: Dictionary }) {
  const currentLocale = await getLocale();

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[1180px] max-w-[95%] flex items-center px-8 py-4 border bg-white/80 backdrop-blur-md z-50 rounded-4xl shadow-sm">
      <NextLink href="/" className="flex items-center gap-2">
        <Image
          src="/odly_blue_logo.png" 
          alt={dictionary.Main.Header.altImg} 
          width={120}
          height={32}
          className="h-8 w-auto object-contain"
          priority
        />
      </NextLink>

      <nav className="hidden md:flex gap-8 justify-center items-center flex-1">
        <NextLink 
          href="#product" 
          className="text-[16px] font-semibold text-foreground/70 hover:text-foreground transition-colors"
        >
          {dictionary.Main.Header.product}
        </NextLink>
        <NextLink 
          href="#solution" 
          className="text-[16px] font-semibold text-foreground/70 hover:text-foreground transition-colors"
        >
          {dictionary.Main.Header.solution}
        </NextLink>
        <NextLink 
          href="#how-it-works" 
          className="text-[16px] font-semibold text-foreground/70 hover:text-foreground transition-colors"
        >
          {dictionary.Main.Header.howItWork}
        </NextLink>
        <NextLink 
          href="#channel" 
          className="text-[16px] font-semibold text-foreground/70 hover:text-foreground transition-colors"
        >
          {dictionary.Main.Header.channels}
        </NextLink>
        <NextLink 
          href="#pricing" 
          className="text-[16px] font-semibold text-foreground/70 hover:text-foreground transition-colors"
        >
          {dictionary.Main.Header.pricing}
        </NextLink>
        <NextLink 
          href="#contact-us" 
          className="text-[16px] font-semibold text-foreground/70 hover:text-foreground transition-colors"
        >
          {dictionary.Main.Header.contactUs}
        </NextLink>
        <div className="w-px h-4 bg-border mx-2" />
        {/* <LocaleSwitcher currentLocale={currentLocale} /> */}
      </nav>

    </header>
  );
}