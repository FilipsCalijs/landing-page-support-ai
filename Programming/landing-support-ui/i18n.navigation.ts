// i18n.navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { locales } from './i18n.config';

// В новых версиях используется createNavigation
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales
});