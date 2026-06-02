import { ui, defaultLang, type Lang } from './ui';

// Which English routes have a hand-translated /zh/ counterpart. The language
// switcher only offers the toggle for paths in this set (or any /zh/ page),
// so it never dead-links. Add a path here when you add its /zh/ page.
// Use trailing-slash-free, leading-slash form. '/' is the homepage.
export const ZH_ROUTES = new Set<string>([
  '/',
  '/mine/agent',
  '/mine/resources',
]);

/** Detect the active locale from the URL pathname. */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return seg === 'zh' ? 'zh' : 'en';
}

/** t(key) bound to a locale, with English fallback for missing keys. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)['en']): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[defaultLang][key];
  };
}

/** Strip the /zh prefix → the underlying English route ('/' for home). */
export function toBaseRoute(pathname: string): string {
  const stripped = pathname.replace(/^\/zh(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** Prefix a base route with the locale ('/zh' for zh, unchanged for en). */
export function localizePath(baseRoute: string, lang: Lang): string {
  if (lang === 'en') return baseRoute;
  return baseRoute === '/' ? '/zh/' : `/zh${baseRoute}`;
}

/** True if the given base route has a translated /zh/ page available. */
export function hasZh(baseRoute: string): boolean {
  return ZH_ROUTES.has(baseRoute);
}
