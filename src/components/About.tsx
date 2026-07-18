import { Section, Reveal, Eyebrow } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const ABOUT_RADIAL =
  "radial-gradient(60% 80% at 90% 0%, rgba(139,92,246,0.10), transparent 60%)";

const About = () => {
  const { t } = useLocale();

  return (
    <Section id="about" className="pb-10 pt-[72px]">
      <Reveal>
        <div
          className="grid grid-cols-1 gap-10 rounded-2xl border border-line bg-surface p-8 sm:p-11 lg:grid-cols-2 lg:gap-12"
          style={{ backgroundImage: ABOUT_RADIAL }}
        >
          {/* Left: story + CTAs */}
          <div>
            <Eyebrow>{t.about.subhead}</Eyebrow>
            <h2 className="mt-3 font-display text-[28px] font-bold tracking-[-0.02em] text-heading sm:text-[34px]">
              {t.about.heading}
            </h2>
            <p className="mt-[18px] text-[15px] leading-[1.7] text-body">
              {t.about.bioLead}
            </p>
            <p className="mt-3.5 text-[15px] leading-[1.7] text-body">
              {t.about.bioSecondary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3.5">
              <a
                href="/resume.pdf"
                download="Luis_Ortiz_Resume.pdf"
                className="inline-block rounded-[10px] bg-accent-500 px-[22px] py-[11px] text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-accent-400"
              >
                {t.about.resumeCta}
              </a>
              <a
                href="#contact"
                className="inline-block rounded-[10px] border border-line px-[22px] py-[11px] text-[14px] font-semibold text-heading transition-colors duration-200 hover:border-accent-400"
              >
                {t.about.talkCta} →
              </a>
            </div>
          </div>

          {/* Right: currently @ TELUS */}
          <div className="flex flex-col justify-center gap-[18px] border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <p className="font-mono text-[12px] text-accent-400">
              {t.about.currentlyLabel}
            </p>
            <div className="flex flex-col gap-3 text-[14px] text-body-strong">
              {t.about.currentlyPoints.map((point) => (
                <span key={point} className="flex gap-3">
                  <span className="text-accent-500">—</span>
                  {point}
                </span>
              ))}
            </div>
            <p className="mt-1.5 border-t border-line pt-4 text-[13px] text-body">
              {t.about.openToNote}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
};

export default About;
