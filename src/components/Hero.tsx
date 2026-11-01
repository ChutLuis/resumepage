import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "../i18n/LocaleContext";
import { buttonClass, textLinkClass } from "./ui/primitives";
import AquariusFallback from "./canvas/AquariusFallback";
import { sceneStore } from "../lib/sceneStore";

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * True on lg+ viewports. Initialized synchronously from matchMedia so the
 * correct constellation anchor (desktop column vs. mobile hero) is selected
 * on first paint without a remount flash.
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

const getSceneSnapshot = () => sceneStore.getSnapshot();

const EASE = [0.16, 1, 0.3, 1] as const;

const guatemalaClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/Guatemala",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const formatGuatemalaTime = () => guatemalaClock.format(new Date());

const useGuatemalaTime = () => {
  const [time, setTime] = useState(formatGuatemalaTime);
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatGuatemalaTime()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return time;
};

const Hero = () => {
  const { t, locale } = useLocale();
  const isDesktop = useIsDesktop();
  const heroRef = useRef<HTMLElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const scene = useSyncExternalStore(sceneStore.subscribe, getSceneSnapshot, getSceneSnapshot);
  const [fallbackMounted, setFallbackMounted] = useState(true);
  const ready = scene.ready && !scene.lost;
  const reduced = useReducedMotion() ?? false;
  const time = useGuatemalaTime();
  const year = new Date().getFullYear();

  useEffect(() => {
    const region = heroRef.current;
    const anchor = isDesktop ? columnRef.current : mobileStageRef.current;
    if (!anchor || !region) return;
    sceneStore.setAnchor(anchor, region, "column");
    return () => sceneStore.clearAnchor(anchor);
  }, [isDesktop]);

  useEffect(() => {
    if (!ready) {
      setFallbackMounted(true);
      return;
    }
    const id = window.setTimeout(() => setFallbackMounted(false), 600);
    return () => window.clearTimeout(id);
  }, [ready]);

  const fallbackOpacity = ready ? 0 : 1;

  const fade = (delay: number, y = 0) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.7, ease: EASE, delay: reduced ? 0 : delay },
  });
  const rule = (delay: number) => ({
    initial: { scaleX: reduced ? 1 : 0 },
    animate: { scaleX: 1 },
    transition: { duration: reduced ? 0 : 1.1, ease: EASE, delay: reduced ? 0 : delay },
  });

  const leadWords = t.hero.headlineLead.split(" ");
  const accentWords = t.hero.headlineAccent.split(" ");
  const headlineSize = locale === "es"
    ? "lg:text-[length:min(80px,calc((100svh-290px)/6.6),calc((100vw-80px)/14.2))]"
    : "lg:text-[length:min(92px,calc((100svh-290px)/6.6),calc((100vw-80px)/11.8))]";

  const maskedWord = (text: string, index: number, accent: boolean) => (
    <span
      className={`-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom ${accent ? "-mr-[0.06em] pr-[0.06em]" : ""}`}
    >
      <motion.span
        className={`inline-block ${accent ? "font-serif text-[1.08em] font-normal italic tracking-[-0.01em] text-accent-300" : ""}`}
        initial={reduced ? { opacity: 0 } : { y: "105%" }}
        animate={reduced ? { opacity: 1 } : { y: "0%" }}
        transition={{ duration: reduced ? 0 : 0.9, ease: EASE, delay: reduced ? 0 : 0.15 + index * 0.06 }}
      >
        {text}
      </motion.span>
    </span>
  );
  const wordLine = (list: string[], offset: number, accent: boolean) =>
    list.map((text, i) => (
      <Fragment key={`${accent ? "a" : "l"}-${i}`}>
        {maskedWord(text, offset + i, accent)}
        {i < list.length - 1 ? " " : null}
      </Fragment>
    ));

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex max-w-content flex-col px-6 pt-24 sm:px-10 lg:h-[100svh] lg:max-h-[1040px] lg:min-h-[720px]">
        {/* Meta row */}
        <div className="relative flex items-center justify-between gap-4 pb-4 font-mono text-[11px] uppercase tracking-eyebrow text-body sm:text-[12px]">
          <motion.span className="flex items-center gap-2.5 whitespace-nowrap" {...fade(0.05)}>
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent-400" />
            {t.hero.metaRole}
          </motion.span>
          <motion.span className="hidden whitespace-nowrap md:inline" {...fade(0.12)}>
            {t.hero.metaEdition} — {year}
          </motion.span>
          <motion.span className="whitespace-nowrap tabular-nums" {...fade(0.18)}>
            <span className="hidden sm:inline">{t.hero.metaLocation} — </span>
            {time} GMT−6
          </motion.span>
          <motion.span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-line" {...rule(0.1)} />
        </div>

        {/* Stage: on desktop the statue stands centred behind everything in here */}
        <div className="relative flex flex-1 flex-col pb-14 pt-4 sm:pt-6 lg:pb-12 lg:pt-10">
          <div ref={columnRef} className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
            {isDesktop && (!ready || fallbackMounted) && (
              <div
                className="absolute inset-0"
                style={{ opacity: fallbackOpacity, transition: "opacity 600ms ease-out" }}
              >
                <AquariusFallback />
              </div>
            )}
          </div>

          <div
            ref={mobileStageRef}
            className="pointer-events-none relative order-1 -mx-6 mb-4 h-[46svh] min-h-[280px] sm:-mx-10 lg:hidden"
            aria-hidden="true"
          >
            {!isDesktop && (!ready || fallbackMounted) && (
              <div
                className="absolute inset-0"
                style={{ opacity: fallbackOpacity, transition: "opacity 600ms ease-out" }}
              >
                <AquariusFallback />
              </div>
            )}
          </div>

          <h1 className={`relative order-2 font-display text-[44px] font-semibold leading-[1.0] tracking-[-0.04em] text-heading xs:text-[54px] sm:text-[68px] ${headlineSize} lg:mt-auto lg:leading-[0.98]`}>
            <span className="sr-only">{t.hero.headline}</span>
            <span aria-hidden="true">
              <span className="block text-balance">{wordLine(leadWords, 0, false)}</span>
              <span className="block">{wordLine(accentWords, leadWords.length, true)}</span>
            </span>
          </h1>

          <div className="relative order-3 mt-7 max-w-[480px] sm:mt-8 lg:order-1 lg:mt-0 lg:max-w-[380px]">
            <motion.p className="text-[16px] leading-[1.65] text-body sm:text-[17px] lg:text-[16px]" {...fade(0.55, 16)}>
              {t.hero.intro}
            </motion.p>
            <motion.div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2" {...fade(0.7, 16)}>
              <a
                href="#work"
                className={buttonClass}
              >
                {t.hero.workCta}
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  <path d="M8 3v10m0 0 4-4m-4 4L4 9" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>
              <a
                href="#contact"
                className={textLinkClass}
              >
                {t.hero.contactLink}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;