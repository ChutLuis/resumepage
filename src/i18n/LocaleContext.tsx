import { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLocalizedContent } from "../constants";
import { dictionaries, type Dictionary, type Locale } from "./translations";

const STORAGE_KEY = "lfortiz-locale";
const SITE_URL = "https://www.lfortiz.com";

/** Locale is derived from the URL so each language is a distinct, indexable page. */
const localeFromPath = (pathname: string): Locale =>
  pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";

const canonicalForLocale = (locale: Locale): string =>
  locale === "es" ? `${SITE_URL}/es` : `${SITE_URL}/`;

const updateMeta = (selector: string, content: string) => {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
};

const updateHref = (selector: string, href: string) => {
  document.querySelector<HTMLLinkElement>(selector)?.setAttribute("href", href);
};

const updateStructuredData = (dictionary: Dictionary) => {
  const scripts = document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]');
  const [person, service] = scripts;

  try {
    if (person) {
      const data = JSON.parse(person.textContent ?? "{}") as Record<string, unknown>;
      data.description = dictionary.meta.personDescription;
      data.jobTitle = dictionary.meta.lang === "es" ? "Ingeniero Full-Stack Senior" : "Senior Full-Stack Engineer";
      person.textContent = JSON.stringify(data);
    }
    if (service) {
      const data = JSON.parse(service.textContent ?? "{}") as Record<string, unknown>;
      data.description = dictionary.meta.serviceDescription;
      service.textContent = JSON.stringify(data);
    }
  } catch {
    // Static JSON-LD remains available if a third party has modified the document.
  }
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  content: ReturnType<typeof getLocalizedContent>;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const locale = localeFromPath(location.pathname);
  const t = dictionaries[locale];
  const content = useMemo(() => getLocalizedContent(t), [t]);

  const setLocale = (nextLocale: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {
      // Preference storage can be unavailable in private browsing contexts.
    }
    const path = nextLocale === "es" ? "/es" : "/";
    navigate(`${path}${location.hash}`);
  };

  useEffect(() => {
    const canonical = canonicalForLocale(locale);
    document.documentElement.lang = t.meta.lang;
    const skipLink = document.querySelector<HTMLAnchorElement>('a[href="#main-content"]');
    if (skipLink) skipLink.textContent = t.system.skipToContent;
    document.title = t.meta.title;
    updateMeta('meta[name="title"]', t.meta.title);
    updateMeta('meta[name="description"]', t.meta.description);
    updateHref('link[rel="canonical"]', canonical);
    updateMeta('meta[property="og:title"]', t.meta.title);
    updateMeta('meta[property="og:description"]', t.meta.description);
    updateMeta('meta[property="og:url"]', canonical);
    updateMeta('meta[property="og:locale"]', t.meta.ogLocale);
    updateMeta('meta[property="og:locale:alternate"]', t.meta.ogLocaleAlternate);
    updateMeta('meta[property="twitter:title"]', t.meta.title);
    updateMeta('meta[property="twitter:description"]', t.meta.description);
    updateMeta('meta[property="twitter:url"]', canonical);
    updateStructuredData(t);
  }, [t, locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, content }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
};
