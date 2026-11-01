import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import useActiveSection from "../hooks/useActiveSection";
import { useLocale } from "../i18n/LocaleContext";
import LanguageToggle from "./ui/LanguageToggle";

const SECTION_IDS = navLinks.map((link) => link.id);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const activeId = useActiveSection(SECTION_IDS);
  const { t, content } = useLocale();

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpen(false);
    };
    const onBreakpointChange = () => {
      if (!desktop.matches) return;
      const menuElement = document.getElementById("mobile-menu");
      if (menuElement?.contains(document.activeElement)) navRef.current?.querySelector("a")?.focus();
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpointChange);
    onBreakpointChange();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpointChange);
    };
  }, [open]);

  const linkClass = (active: boolean) =>
    `inline-flex min-h-11 min-w-11 items-center text-[14px] transition-colors duration-200 ${
      active ? "text-heading" : "text-body hover:text-heading"
    }`;

  return (
    <nav ref={navRef} className="fixed top-0 z-30 w-full border-b border-line bg-primary" aria-label={t.nav.mainNavigation}>
      <div className="relative mx-auto flex w-full max-w-content items-center justify-between px-6 py-2 sm:px-10">
        <Link to="/" className="flex min-h-11 items-center gap-2.5" onClick={() => window.scrollTo(0, 0)}>
          <img src={logo} alt="" className="h-5 w-5 object-contain" />
          <span className="font-display text-[16px] font-bold text-heading">{t.nav.brand}</span>
        </Link>

        <ul className="hidden list-none items-center gap-5 lg:flex">
          {content.navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} aria-current={activeId === link.id ? "true" : undefined} className={linkClass(activeId === link.id)}>
                {link.title}
              </a>
            </li>
          ))}
          <li><LanguageToggle /></li>
          <li><a href="/resume.pdf" download="Luis_Ortiz_Resume.pdf" className={linkClass(false)}>{t.nav.resume}</a></li>
          <li>
            <a href="#contact" className="inline-flex min-h-11 items-center text-[14px] font-medium text-accent-300 transition-colors duration-200 hover:text-accent-200">
              {t.hero.contactCta} →
            </a>
          </li>
        </ul>

        <div className="lg:hidden">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <img src={open ? close : menu} alt="" className="h-7 w-7 object-contain" />
          </button>
          <div id="mobile-menu" hidden={!open} className="absolute right-6 top-full min-w-[200px] border border-line bg-bg-2 p-5 sm:right-10 lg:hidden">
            <ul className="flex list-none flex-col items-start">
              {content.navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} aria-current={activeId === link.id ? "true" : undefined} className={linkClass(activeId === link.id)} onClick={() => setOpen(false)}>
                    {link.title}
                  </a>
                </li>
              ))}
              <li className="w-full border-t border-line"><LanguageToggle /></li>
              <li className="w-full border-t border-line">
                <a href="#contact" className="inline-flex min-h-11 items-center text-[14px] font-medium text-accent-300 hover:text-accent-200" onClick={() => setOpen(false)}>
                  {t.hero.contactCta} →
                </a>
              </li>
              <li><a href="/resume.pdf" download="Luis_Ortiz_Resume.pdf" className={linkClass(false)} onClick={() => setOpen(false)}>{t.nav.resume}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
