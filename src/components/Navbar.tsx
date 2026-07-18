import { useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import useActiveSection from "../hooks/useActiveSection";
import { useLocale } from "../i18n/LocaleContext";
import LanguageToggle from "./ui/LanguageToggle";

// Stable reference so the IntersectionObserver effect doesn't re-run each render.
const SECTION_IDS = navLinks.map((link) => link.id);

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { t, content } = useLocale();

  return (
    <nav
      className="fixed top-0 z-30 w-full border-b border-white/[0.06] bg-primary/85 backdrop-blur-md"
      role="navigation"
      aria-label={t.nav.mainNavigation}
    >
      <div className="mx-auto flex w-full max-w-content items-center justify-between px-6 py-[18px] sm:px-10">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={() => window.scrollTo(0, 0)}
        >
          <img src={logo} alt="" className="h-5 w-5 object-contain" />
          <span className="font-display text-[16px] font-bold text-heading">
            {t.nav.brand}
          </span>
        </Link>

        <ul className="hidden list-none flex-row items-center gap-7 sm:flex">
          {content.navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`text-[14px] transition-colors duration-200 ${
                    isActive ? "text-heading" : "text-body hover:text-heading"
                  }`}
                >
                  {link.title}
                </a>
              </li>
            );
          })}
          <li>
            <LanguageToggle />
          </li>
          <li>
            <a
              href="/resume.pdf"
              download="Luis_Ortiz_Resume.pdf"
              className="rounded-lg border border-accent-500/40 px-3.5 py-1.5 text-[14px] font-medium text-accent-300 transition-colors duration-200 hover:border-accent-400 hover:text-accent-200"
            >
              {t.nav.resume}
            </a>
          </li>
        </ul>

        <div className="flex flex-1 items-center justify-end sm:hidden">
          <button
            onClick={() => setToggle(!toggle)}
            className="flex h-11 w-11 items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-accent-400"
            aria-label={toggle ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={toggle}
            aria-controls="mobile-menu"
          >
            <img
              src={toggle ? close : menu}
              alt=""
              className="h-7 w-7 object-contain"
            />
          </button>
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.mainNavigation}
            className={`${
              !toggle ? "hidden" : "flex"
            } absolute right-4 top-[68px] z-10 min-w-[180px] flex-col rounded-2xl border border-line bg-bg-2 p-5`}
          >
            <ul className="flex w-full list-none flex-col items-start gap-4">
              {content.navLinks.map((link) => {
                const isActive = activeId === link.id;
                return (
                  <li
                    key={link.id}
                    className={`text-[16px] font-medium transition-colors duration-200 ${
                      isActive ? "text-heading" : "text-body hover:text-heading"
                    }`}
                    onClick={() => setToggle(false)}
                  >
                    <a href={`#${link.id}`}>{link.title}</a>
                  </li>
                );
              })}
              <li className="w-full border-t border-line pt-3">
                <LanguageToggle />
              </li>
              <li className="w-full border-t border-line pt-3">
                <a
                  href="/resume.pdf"
                  download="Luis_Ortiz_Resume.pdf"
                  className="text-[16px] font-medium text-accent-300 transition-colors duration-200 hover:text-accent-200"
                  onClick={() => setToggle(false)}
                >
                  {t.nav.resume}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
