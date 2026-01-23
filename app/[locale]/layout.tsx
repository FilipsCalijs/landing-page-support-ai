  // app/[locale]/layout.tsx
  import './../globals.css'; // Check the path! Usually it's like this if the file is in the app/ root
  import type { Metadata } from 'next';
  import { NextIntlClientProvider } from 'next-intl';
  import { getMessages } from 'next-intl/server';
  import Header from '@/components/Header';
  import Footer from '@/components/Footer'

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    
    return {
      title: 'Landing Page Support AI',
      description: 'AI-powered support automation for your business. Automate replies, smart categorization, and instant responses.',
      keywords: ['AI', 'support', 'automation', 'customer service', 'chatbot'],
      authors: [{ name: 'Your Company' }],
      openGraph: {
        title: 'Landing Page Support AI',
        description: 'AI-powered support automation for your business',
        type: 'website',
        locale: locale,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Landing Page Support AI',
        description: 'AI-powered support automation for your business',
      },
    };
  }

  export default async function LocaleLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
      <html lang={locale}>
        <body className="antialiased">
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Header />
            <main>{children}</main>
            <Footer/>
          </NextIntlClientProvider>
        </body>
      </html>
    );
  }