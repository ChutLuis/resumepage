import { Section, Reveal, Eyebrow } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Experience = () => {
  const { t, content } = useLocale();

  return (
    <Section id="experience" className="pb-10 pt-[72px]">
      <Reveal>
        <Eyebrow>{t.experience.subhead}</Eyebrow>
        <h2 className="mt-2.5 font-display text-[32px] font-bold tracking-[-0.02em] text-heading sm:text-[40px] lg:text-[44px]">
          {t.experience.heading}
        </h2>

        <div className="mt-8 border-t border-line">
          {content.experiences.map((experience) => (
            <article
              key={experience.id}
              className="grid grid-cols-[44px_1fr] gap-x-5 gap-y-3 border-b border-divider py-[26px] md:grid-cols-[220px_56px_1fr] md:items-start md:gap-6"
            >
              <p className="order-1 col-span-2 font-mono text-[12px] text-body md:order-none md:col-span-1 md:pt-1">
                {experience.date}
              </p>
              <img
                src={experience.icon}
                alt={experience.company_name}
                className="order-2 h-11 w-11 rounded-[10px] object-cover md:order-none"
                loading="lazy"
              />
              <div className="order-3 md:order-none">
                <h3 className="font-display text-[19px] font-semibold leading-snug text-heading">
                  {experience.title} ·{" "}
                  <span className="text-accent-400">
                    {experience.company_name}
                  </span>
                </h3>
                <p className="mt-2 max-w-[680px] text-[14px] leading-[1.65] text-body">
                  {experience.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </Section>
  );
};

export default Experience;
