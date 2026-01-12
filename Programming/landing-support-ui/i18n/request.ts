// i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import {locales} from '../i18n.config';

export default getRequestConfig(async ({requestLocale}) => {
  // Ожидаем locale, так как в Next 15 это Promise
  let locale = await requestLocale;

  // Если локаль не поддерживается, берем дефолтную
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en';
  }

  return {
    locale,
    // ПУТЬ ДОЛЖЕН БЫТЬ ПРАВИЛЬНЫМ:
    messages: (await import(`../messages/${locale}.json`)).default
  };
});