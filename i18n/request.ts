import { getRequestConfig } from 'next-intl/server';
import { locales } from '../i18n.config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Wait for locale, as in Next 15 it's a Promise
  let locale = await requestLocale;

  // Check if the received string is in our list of allowed locales
  // Use type casting to string so .includes doesn't complain about types
  if (!locale || !locales.includes(locale as typeof locales[number])) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});