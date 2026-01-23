// i18n.navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { locales } from './i18n.config';

// In newer versions, createNavigation is used
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales
});