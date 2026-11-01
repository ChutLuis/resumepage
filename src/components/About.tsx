import { Section, Reveal, SectionHead, ArrowRight, buttonClass, textLinkClass } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const About = () => {
  const { t } = useLocale();

  return (
    <Section id="about" className="py-20 sm:py-24 lg:py-28">
      <Reveal>
        <SectionHead index="04" label={t.about.subhead} title={t.about.heading} />

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-10">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14 lg:col-span-9 lg:col-start-4">
            {/* Left: story + CTAs */}
            <div>
              <p className="max-w-[34ch] text-[20px] leading-[1.55] text-body-strong">
                {t.about.bioLead}
              </p>
              <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.7] text-body">
                {t.about.bioSecondary}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a
                  href="/resume.pdf"
                  download="Luis_Ortiz_Resume.pdf"
                  className={buttonClass}
                >
                  {t.about.resumeCta}
                </a>
                <a href="#contact" className={textLinkClass}>
                  {t.about.talkCta}
                  <ArrowRight />
                </a>
              </div>
            </div>

            {/* Right: currently @ TELUS */}
            <div>
              <p className="font-mono text-[12px] uppercase tracking-eyebrow text-body">
                {t.about.currentlyLabel}
              </p>
              <div className="mt-5 flex flex-col gap-3 text-[15px] leading-relaxed text-body-strong">
                {t.about.currentlyPoints.map((point) => (
                  <span key={point} className="flex gap-3">
                    <span aria-hidden="true" className="text-caption">—</span>
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
};

export default About;