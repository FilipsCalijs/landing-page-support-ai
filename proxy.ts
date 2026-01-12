// proxy.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localeCookie: {
    name: 'locale',
    maxAge: 31536000,
    path: '/'
  }
});

export function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  const cookie = request.cookies.get('locale');

  if (!cookie) {
    // Если куки нет, проверяем путь или ставим дефолт (теперь lv)
    const locale = request.nextUrl.pathname.split('/')[1] || defaultLocale;
    
    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Добавляем lv в регулярку матчера: (ru|en|lv)
  matcher: ['/', '/(ru|en|lv)/:path*', '/((?!api|_next|.*\\..*).*)']
};