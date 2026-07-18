import { Fragment } from "react";
import { locales } from "../../i18n/translations";
import { useLocale } from "../../i18n/LocaleContext";

const LanguageToggle = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="flex items-center gap-1.5 text-[13px]"
    >
      {locales.map((language, index) => (
        <Fragment key={language}>
          {index > 0 && (
            <span aria-hidden="true" className="text-body/50">
              ·
            </span>
          )}
          <button
            type="button"
            lang={language}
            aria-pressed={locale === language}
            onClick={() => setLocale(language)}
            className={`transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-400 ${
              locale === language
                ? "font-medium text-heading"
                : "text-body hover:text-heading"
            }`}
          >
            {t.language[language]}
          </button>
        </Fragment>
      ))}
    </div>
  );
};

export default LanguageToggle;
