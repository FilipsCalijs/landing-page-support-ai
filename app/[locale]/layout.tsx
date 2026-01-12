  // app/[locale]/layout.tsx
  import './../globals.css'; // Проверь путь! Обычно он такой, если файл в корне app/
  import { NextIntlClientProvider } from 'next-intl';
  import { getMessages } from 'next-intl/server';
  import Header from '@/components/Header';
  import Footer from '@/components/Footer'
  import { Button } from '@/components/ui/Button';
  import { Typography } from '@/components/ui/Typography';

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