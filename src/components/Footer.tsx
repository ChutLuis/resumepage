import { useLocale } from "../i18n/LocaleContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();

  const linkClass =
    "inline-flex min-h-11 items-center text-small text-body transition-colors duration-200 hover:text-heading";

  return (
    <footer id="site-footer" className="border-t border-line">
      <div className="mx-auto flex w-full max-w-content flex-wrap justify-between gap-6 px-6 py-8 sm:px-10 lg:py-10">
        <div className="flex-[1_1_240px]">
          <p className="text-small font-medium text-body-strong">© {currentYear} Luis Ortiz</p>
          <p className="text-small text-body">
            {t.hero.metaRole} — {t.hero.metaLocation}
          </p>
        </div>

        <div className="min-w-0 flex-[2_1_420px]">
          <div className="flex flex-wrap items-center gap-x-6 text-small text-body">
            <a href="#work" className={linkClass}>
              {t.nav.work}
            </a>
            <a href="/resume.pdf" download="Luis_Ortiz_Resume.pdf" className={linkClass}>
              {t.nav.resume}
            </a>
            <a
              href="https://github.com/chutluis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.footer.github}
              className={linkClass}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/luis-ortiz-3b5454195/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.footer.linkedin}
              className={linkClass}
            >
              LinkedIn
            </a>
            <a
              href="mailto:me@lfortiz.com"
              aria-label={t.footer.email}
              className={linkClass}
            >
              me@lfortiz.com
            </a>
          </div>

          <div className="mt-4 max-w-[70ch] text-label text-caption">
            <p>
              {t.footer.colophonLead}
              <a
                href="https://open.smk.dk/artwork/image/KAS2918"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-heading"
              >
                {t.footer.colophonSource}
              </a>
              {t.footer.colophonTail}
            </p>
            <p>{t.footer.colophonType}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
