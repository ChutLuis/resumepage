import { useLocale } from "../i18n/LocaleContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();

  const linkClass =
    "inline-flex min-h-11 items-center text-body transition-colors duration-200 hover:text-heading";

  return (
    <footer id="site-footer" className="border-t border-line">
      <div className="mx-auto flex w-full max-w-content flex-col px-6 py-8 sm:px-10">
        <div className="flex w-full flex-col items-start justify-between gap-3 text-[13px] text-body sm:flex-row sm:items-center">
          <span>© {currentYear} Luis Ortiz</span>
          <div className="flex flex-wrap items-center gap-x-6">
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
        </div>

        <p className="mt-2 w-full text-[12px] leading-relaxed text-body">
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
      </div>
    </footer>
  );
};

export default Footer;
