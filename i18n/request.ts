import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { defaultLocale } from '../i18n.config';

export default getRequestConfig(async () => {
  // Get locale from header set by middleware
  const headersList = await headers();
  const locale = headersList.get('x-locale') || defaultLocale;

  return {
    locale,
    messages: (await import(`../dictionaries/${locale}.json`)).default
  };
});