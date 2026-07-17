import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getLocalizedContent } from "../constants";
import { dictionaries, type Dictionary, type Locale } from "./translations";

const STORAGE_KEY = "lfortiz-locale";

const getInitialLocale = (): Locale => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {
    // Storage can be unavailable in private browsing contexts.
  }

  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
};

const updateMeta = (selector: string, content: string) => {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
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
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const t = dictionaries[locale];
  const content = useMemo(() => getLocalizedContent(t), [t]);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {
      // Locale remains active for this session if storage is unavailable.
    }
  };

  useEffect(() => {
    document.documentElement.lang = t.meta.lang;
    const skipLink = document.querySelector<HTMLAnchorElement>('a[href="#main-content"]');
    if (skipLink) skipLink.textContent = t.system.skipToContent;
    document.title = t.meta.title;
    updateMeta('meta[name="title"]', t.meta.title);
    updateMeta('meta[name="description"]', t.meta.description);
    updateMeta('meta[property="og:title"]', t.meta.title);
    updateMeta('meta[property="og:description"]', t.meta.description);
    updateMeta('meta[property="og:locale"]', t.meta.ogLocale);
    updateMeta('meta[property="og:locale:alternate"]', t.meta.ogLocaleAlternate);
    updateMeta('meta[property="twitter:title"]', t.meta.title);
    updateMeta('meta[property="twitter:description"]', t.meta.description);
    updateStructuredData(t);
  }, [t]);

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
