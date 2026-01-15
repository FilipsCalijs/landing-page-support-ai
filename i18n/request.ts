import { getRequestConfig } from 'next-intl/server';
import { locales } from '../i18n.config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Ожидаем locale, так как в Next 15 это Promise
  let locale = await requestLocale;

  // Проверяем, входит ли полученная строка в наш список допустимых локалей
  // Используем приведение к string, чтобы .includes не ругался на типы
  if (!locale || !locales.includes(locale as typeof locales[number])) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});