import { lazy, Suspense, useEffect, useState } from "react";
import { Reveal } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

// Defer three.js off the initial critical path — only the hero canvas needs it.
const AquariusCanvas = lazy(() => import("./canvas/AquariusCanvas"));

const HERO_RADIAL =
  "radial-gradient(70% 60% at 30% 0%, rgba(139,92,246,0.14), transparent 65%)";

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * True on lg+ viewports. Initialized synchronously from matchMedia so the
 * correct canvas (desktop column vs. mobile background) mounts on first paint
 * without a remount flash.
 */
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_QUERY).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return isDesktop;
};

const Hero = () => {
  const { t } = useLocale();
  const isDesktop = useIsDesktop();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundImage: HERO_RADIAL }}
    >
      {/* Mobile: constellation as a faint full-bleed backdrop behind the text.
          pointer-events-none keeps the CTAs fully tappable. */}
      {!isDesktop && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-50"
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <AquariusCanvas />
          </Suspense>
        </div>
      )}

      <div className="relative z-10 mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-6 pb-16 pt-28 sm:px-10 sm:pb-[90px] lg:grid-cols-[1.3fr_1fr] lg:pt-[110px]">
        <Reveal>
          <p className="font-mono text-[13px] tracking-[0.08em] text-accent-400">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-heading xs:text-[40px] sm:mt-5 sm:text-[52px] sm:leading-[1.08] lg:text-[62px]">
            {t.hero.headline}
          </h1>
          <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-body sm:mt-6 sm:text-[18px] sm:leading-[1.65]">
            {t.hero.intro}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:mt-9">
            <a
              href="#contact"
              className="inline-block rounded-[10px] bg-accent-500 px-[26px] py-[13px] text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-accent-400"
            >
              {t.hero.contactCta}
            </a>
            <a
              href="#work"
              className="inline-block rounded-[10px] border border-line px-[26px] py-[13px] text-[15px] font-semibold text-heading transition-colors duration-200 hover:border-accent-400"
            >
              {t.hero.workCta} ↓
            </a>
          </div>
        </Reveal>

        {/* Desktop: constellation in the right column with its caption. */}
        <div className="hidden lg:block">
          <div
            className="h-[440px] w-full"
            role="img"
            aria-label={t.hero.canvasAria}
          >
            {isDesktop && (
              <Suspense fallback={null}>
                <AquariusCanvas />
              </Suspense>
            )}
          </div>
          <p className="mt-1.5 text-right font-mono text-[11px] tracking-[0.08em] text-caption">
            {t.hero.canvasCaption}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
