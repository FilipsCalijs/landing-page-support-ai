import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n.config';

export function proxy(request: NextRequest) {
  // Get locale from cookie or browser Accept-Language header
  const cookieLocale = request.cookies.get('locale')?.value;
  const acceptLanguage = request.headers.get('accept-language');
  
  // Determine locale priority: cookie > browser > default
  let locale: Locale = defaultLocale;
  
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  } else if (acceptLanguage) {
    // Parse accept-language header (e.g., "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7")
    const browserLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(browserLocale as Locale)) {
      locale = browserLocale as Locale;
    }
  }
  
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);
  
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Set locale cookie if not already set or different
  if (!cookieLocale || cookieLocale !== locale) {
    response.cookies.set('locale', locale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
    });
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)'],
};