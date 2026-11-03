import { Section, Reveal, SectionHead, Eyebrow, ArrowRight, buttonClass, textLinkClass } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const About = () => {
  const { t } = useLocale();
  const lastPoint = t.about.currentlyPoints.length - 1;

  return (
    <Section id="about" className="py-16 sm:py-20 lg:py-24">
      <SectionHead
        label={t.about.subhead}
        title={t.about.heading}
        aside={t.about.facts[0].value}
      />

      <Reveal className="mt-12">
        <div data-scene-calm>
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Left: statement + CTAs */}
            <div className="lg:flex-[1.4]">
              <p className="max-w-[34ch] font-display text-display-statement font-medium text-heading">
                {t.about.bioLead}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a href="/resume.pdf" download="Luis_Ortiz_Resume.pdf" className={buttonClass}>
                  {t.about.resumeCta}
                </a>
                <a href="#contact" className={textLinkClass}>
                  {t.about.talkCta}
                  <ArrowRight />
                </a>
              </div>
            </div>

            {/* Right: currently at TELUS */}
            <div className="lg:flex-1">
              <Eyebrow>{t.about.currentlyLabel}</Eyebrow>
              <ul className="mt-3.5">
                {t.about.currentlyPoints.map((point, index) => (
                  <li
                    key={point}
                    className={`relative border-t border-line py-3.5 pl-5 text-copy text-body-strong ${
                      index === lastPoint ? "border-b" : ""
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[22px] h-1.5 w-1.5 bg-accent-400"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick facts */}
          <dl className="mt-16 grid border-t border-line sm:grid-cols-3">
            {t.about.facts.map((fact) => (
              <div key={fact.label} className="py-5 pr-6">
                <dt className="text-label font-medium text-caption">{fact.label}</dt>
                <dd className="mt-1.5 text-lead text-body-strong">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </Section>
  );
};

export default About;
