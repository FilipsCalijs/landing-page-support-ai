import 'server-only';

export type Dictionary = typeof import('@/dictionaries/en.json');

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (!Object.hasOwn(dictionaries, locale)) return dictionaries.en();
  return dictionaries[locale]();
};
