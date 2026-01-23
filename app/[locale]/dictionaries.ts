import 'server-only';

export type Dictionary = typeof import('@/messages/en.json');

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/messages/en.json').then((module) => module.default),
  ru: () => import('@/messages/ru.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (!Object.hasOwn(dictionaries, locale)) return dictionaries.en();
  return dictionaries[locale]();
};
