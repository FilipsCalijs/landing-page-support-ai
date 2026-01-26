import { cookies, headers } from 'next/headers';
import { defaultLocale } from '@/i18n.config';

export async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // Try to get locale from cookie first
  const cookieLocale = cookieStore.get('locale')?.value;
  if (cookieLocale) {
    return cookieLocale;
  }
  
  // Fallback to header set by middleware
  const headerLocale = headersList.get('x-locale');
  if (headerLocale) {
    return headerLocale;
  }
  
  return defaultLocale;
}
