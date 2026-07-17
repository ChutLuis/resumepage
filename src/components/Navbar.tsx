import { useState } from "react";

import { Link } from "react-router-dom";
import styles from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import useActiveSection from "../hooks/useActiveSection";
import { useLocale } from "../i18n/LocaleContext";
import LanguageToggle from "./ui/LanguageToggle";

// Stable reference so the IntersectionObserver effect doesn't re-run each render.
const SECTION_IDS = navLinks.map((link) => link.id).filter(Boolean);

const ResumeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { t, content } = useLocale();

  return (
    <nav
      className={`${styles.styles.paddingX} w-full flex items-center py-5 fixed top-0 z-30 bg-primary/80 border-b border-white/5 backdrop-blur-md`}
      role="navigation"
      aria-label={t.nav.mainNavigation}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => window.scrollTo(0, 0)}
        >
          <img
            src={logo}
            alt={`${t.nav.brand} - ${t.nav.brandRole} logo`}
            className="w-6 h-6 object-contain"
          />
          <p className="text-white text-[18px] font-bold font-display cursor-pointer flex">
            {t.nav.brand} &nbsp;
            <span className="sm:block hidden text-secondary font-medium">
              | {t.nav.brandRole}
            </span>
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-8 items-center">
          {content.navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.id} data-cursor="hover">
                <a
                  href={`#${link.id}`}
                  className={`relative text-[17px] font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-secondary hover:text-white"
                  }`}
                >
                  {link.title}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-gradient-to-r from-accent-500 to-cyan-400 transition-all duration-300 ${
                      isActive ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
          <li>
            <LanguageToggle />
          </li>
          <li data-cursor="hover">
            <a
              href="/resume.pdf"
              download="Luis_Ortiz_Resume.pdf"
              className="flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-1.5 text-[15px] font-medium text-accent-300 transition-all duration-300 hover:border-accent-400 hover:bg-accent-500/20 hover:text-white"
            >
              {t.nav.resume}
              <ResumeIcon />
            </a>
          </li>
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            onClick={() => setToggle(!toggle)}
            className="w-[44px] h-[44px] flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-400 rounded"
            aria-label={toggle ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={toggle}
            aria-controls="mobile-menu"
          >
            <img
              src={toggle ? close : menu}
              alt=""
              className="w-[28px] h-[28px] object-contain"
            />
          </button>
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.mainNavigation}
            className={`${
              !toggle ? "hidden" : "flex"
            } glass p-6 absolute top-20 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-2xl`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4 w-full">
              {content.navLinks.map((link) => {
                const isActive = activeId === link.id;
                return (
                  <li
                    key={link.id}
                    className={`font-medium cursor-pointer text-[16px] transition-colors duration-300 ${
                      isActive ? "text-white" : "text-secondary hover:text-white"
                    }`}
                    onClick={() => setToggle(false)}
                  >
                    <a href={`#${link.id}`}>{link.title}</a>
                  </li>
                );
              })}
              <li className="w-full border-t border-white/10 pt-3">
                <LanguageToggle />
              </li>
              <li className="w-full pt-2 border-t border-white/10">
                <a
                  href="/resume.pdf"
                  download="Luis_Ortiz_Resume.pdf"
                  className="flex items-center gap-2 text-[16px] font-medium text-accent-300 hover:text-white transition-colors duration-300"
                  onClick={() => setToggle(false)}
                >
                  {t.nav.resume}
                  <ResumeIcon />
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
