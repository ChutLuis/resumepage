import { useLocale } from "../i18n/LocaleContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();

  const linkClass =
    "text-body transition-colors duration-200 hover:text-heading";

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-content flex-col items-center justify-between gap-4 px-6 py-7 text-[13px] text-body sm:flex-row sm:px-10">
        <span>© {currentYear} Luis Ortiz</span>
        <div className="flex flex-wrap items-center justify-center gap-5">
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
    </footer>
  );
};

export default Footer;
