# Dictionary Pattern Usage

This project uses **pure dictionary objects** instead of `next-intl`'s `t()` function for better type safety and autocomplete.

## Setup

1. **Dictionary loader**: `app/[locale]/dictionaries.ts`
```typescript
import 'server-only';

export type Dictionary = typeof import('@/messages/en.json');

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/messages/en.json').then((module) => module.default),
  ru: () => import('@/messages/ru.json').then((module) => module.default),
  lv: () => import('@/messages/lv.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (!Object.hasOwn(dictionaries, locale)) return dictionaries.en();
  return dictionaries[locale]();
};
```

## Usage in Server Components

### ❌ Old Pattern (with next-intl)
```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('Main');
  
  return <h1>{t('Hero.title')}</h1>;
}
```

### ✅ New Pattern (with dictionaries)
```tsx
import { getDictionary } from '../dictionaries';

export default async function MyComponent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  return <h1>{dict.Main.Hero.title}</h1>;
}
```

## Benefits

1. **Type Safety**: Full TypeScript autocomplete for all translation keys
2. **No Magic Strings**: Direct object access instead of string paths like `t('Hero.title')`
3. **Better Refactoring**: Rename keys and get compile errors instead of runtime errors
4. **Server-Only**: Smaller client bundle - translations stay on server
5. **Pure Objects**: Direct JSON access without library overhead

## For Client Components

Client components still need `'use client'` directive and should use `useTranslations` from `next-intl`:

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function ClientComponent() {
  const t = useTranslations('Main');
  return <button>{t('Header.getStarted')}</button>;
}
```

## Example Access Patterns

```tsx
const dict = await getDictionary(locale);

// Direct property access with autocomplete
dict.Main.Header.product
dict.Main.Hero.title
dict.Main.Hero.description
dict.Main.Cards.BadgeBefore.feature1
dict.Main.Pricing.Plans.Starter.title
dict.Main.ContactUs.name
```

## Migration Notes

- **All translation JSON files** must have identical structure
- Currently `ru.json` and `lv.json` have old structures and need updating
- Server components get dictionary via `getDictionary(locale)`
- Client components keep using `useTranslations()` hook
