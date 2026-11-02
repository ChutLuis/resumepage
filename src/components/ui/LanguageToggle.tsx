import { locales } from "../../i18n/translations";
import { useLocale } from "../../i18n/LocaleContext";

const LanguageToggle = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div role="group" aria-label={t.language.label} className="flex items-center">
      {locales.map((language) => {
        const active = locale === language;
        return (
          <button
            key={language}
            type="button"
            lang={language}
            aria-pressed={active}
            onClick={() => setLocale(language)}
            className={`inline-flex h-11 min-w-11 items-center justify-center text-small font-medium transition-colors duration-200 ${
              active ? "text-heading" : "text-body hover:text-heading"
            }`}
          >
            <span
              className={
                active ? "underline decoration-accent-400 decoration-1 underline-offset-[6px]" : undefined
              }
            >
              {t.language[language]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
