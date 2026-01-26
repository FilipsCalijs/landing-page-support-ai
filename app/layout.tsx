import './globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChatProvider } from '@/components/ChatProvider';
import { getDictionary } from '../i18n/dictionaries';
import { getLocale } from '@/lib/locale';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return {
    title: 'Odly - Every Message. Every Department. In one place.',
    description: 'AI-powered platform for support, sales, HR, and billing. Consolidate email, Telegram, Slack into one intelligent inbox.',
    keywords: ['AI', 'support', 'automation', 'customer service', 'multi-channel'],
    authors: [{ name: 'Odly' }],
    openGraph: {
      title: 'Odly - Every Message. Every Department. In one place.',
      description: 'AI-powered platform for support, sales, HR, and billing',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Odly Platform',
      description: 'AI-powered multi-department communication platform',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header dictionary={dictionary} />
          <main>{children}</main>
          <Footer dictionary={dictionary} />
          <ChatProvider locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}