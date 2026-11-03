import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "../i18n/LocaleContext";
import { buttonClass, textLinkClass } from "./ui/primitives";
import AquariusFallback from "./canvas/AquariusFallback";
import { useGuatemalaTime } from "../hooks/useGuatemalaTime";
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

/**
 * Per-cell hairlines and padding for the proof strip. Two columns below lg
 * (a 2x2 grid with a rule between rows), four columns from lg with a rule
 * between cells.
 */
const PROOF_CELL = [
  "pr-4 lg:pr-6",
  "border-l border-line pl-4 lg:pl-6 lg:pr-6",
  "border-t border-line pr-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pr-6",
  "border-l border-t border-line pl-4 lg:border-t-0 lg:pl-6 lg:pr-6",
] as const;

const Hero = () => {
  const { t } = useLocale();
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

  const maskedWord = (text: string, index: number) => (
    <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span
        className="inline-block"
        initial={reduced ? { opacity: 0 } : { y: "105%" }}
        animate={reduced ? { opacity: 1 } : { y: "0%" }}
        transition={{ duration: reduced ? 0 : 0.9, ease: EASE, delay: reduced ? 0 : 0.15 + index * 0.06 }}
      >
        {text}
      </motion.span>
    </span>
  );
  const wordLine = (list: string[], offset: number, keyPrefix: string) =>
    list.map((text, i) => (
      <Fragment key={`${keyPrefix}-${i}`}>
        {maskedWord(text, offset + i)}
        {i < list.length - 1 ? " " : null}
      </Fragment>
    ));

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex max-w-content flex-col px-6 pb-10 pt-[77px] sm:px-10 lg:min-h-[min(100svh,1040px)] lg:pt-[89px]">
        {/* Meta row */}
        <div className="relative flex items-center justify-between gap-4 pb-4 text-label text-body">
          <motion.span className="whitespace-nowrap" {...fade(0.05)}>
            {t.hero.metaRole}
          </motion.span>
          <motion.span className="hidden whitespace-nowrap md:inline" {...fade(0.12)}>
            {t.hero.metaEdition} — {year}
          </motion.span>
          <motion.span className="inline-flex items-center gap-2 whitespace-nowrap" {...fade(0.18)}>
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-status" />
            {t.hero.metaLocation}
            <span className="font-mono">{time} GMT−6</span>
          </motion.span>
          <motion.span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-line" {...rule(0.1)} />
        </div>

        {/* Stage: on desktop the statue stands centred behind everything in here */}
        <div className="relative flex flex-1 flex-col pt-4 sm:pt-6 lg:pb-10 lg:pt-14">
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

          <h1 className="relative order-2 font-display text-display-hero font-semibold text-heading lg:mt-auto">
            <span className="sr-only">{t.hero.headline}</span>
            <span aria-hidden="true">
              <span className="block text-balance">{wordLine(leadWords, 0, "l")}</span>
              <span className="block text-body">{wordLine(accentWords, leadWords.length, "a")}</span>
            </span>
          </h1>

          <div className="relative order-3 mt-8 max-w-[38ch] text-lead lg:order-1 lg:mt-0">
            <motion.p className="text-lead text-body-strong" {...fade(0.55, 16)}>
              {t.hero.intro}
            </motion.p>
            <motion.div
              className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2"
              {...fade(0.7, 16)}
            >
              <a
                href="#work"
                className={`${buttonClass} w-full justify-between sm:w-auto sm:justify-start`}
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

        {/* Proof strip: sits under the headline on desktop, under the CTAs on mobile */}
        <motion.dl
          aria-label={t.hero.proofLabel}
          className="relative mt-10 grid grid-cols-2 border-t border-line lg:mt-0 lg:grid-cols-4"
          {...fade(0.85, 12)}
        >
          {t.hero.proof.map((stat, i) => (
            <div key={stat.value} className={`pb-6 pt-5 lg:pb-7 lg:pt-6 ${PROOF_CELL[i]}`}>
              <dt className="font-display text-display-stat font-medium text-heading">{stat.value}</dt>
              <dd className="mt-2 max-w-[26ch] text-small text-body">{stat.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
};

export default Hero;