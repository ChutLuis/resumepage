import { locales } from "../../i18n/translations";
import { useLocale } from "../../i18n/LocaleContext";

const LanguageToggle = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div role="group" aria-label={t.language.label} className="flex overflow-hidden rounded-full border border-line bg-bg-2/60">
      {locales.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-pressed={locale === language}
          onClick={() => setLocale(language)}
          data-cursor="hover"
          className={`px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 ${
            locale === language
              ? "bg-accent-500/25 text-white"
              : "text-body hover:text-heading"
          }`}
        >
          {t.language[language]}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
