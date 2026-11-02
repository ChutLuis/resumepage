import { Section, Reveal, SectionHead, StatusDot, fillTemplate } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Experience = () => {
  const { t, content } = useLocale();
  const lastIndex = content.experiences.length - 1;
  const earliestYear = Math.min(...content.experiences.map((experience) => experience.startYear));
  const extent = fillTemplate(t.experience.extent, {
    count: content.experiences.length,
    year: earliestYear,
  });

  return (
    <Section id="experience" className="py-16 sm:py-20 lg:py-24">
      <SectionHead label={t.experience.subhead} title={t.experience.heading} aside={extent} />

      <Reveal className="mt-12">
        <ol data-scene-calm>
          {content.experiences.map((experience, index) => (
            <li
              key={experience.id}
              className={`flex flex-col gap-4 border-t border-line py-8 lg:flex-row lg:items-start lg:gap-12 ${
                index === lastIndex ? "border-b" : ""
              }`}
            >
              <div className="lg:w-[220px] lg:shrink-0">
                <p className="font-mono text-label lowercase text-body">{experience.date}</p>
                {experience.current && (
                  <p className="mt-2.5 flex items-center text-label font-medium text-body-strong">
                    <StatusDot />
                    {t.experience.currentLabel}
                  </p>
                )}
              </div>
              <div className="min-w-0 lg:flex-1">
                <h3 className="font-display text-display-item font-medium text-heading">
                  {experience.title}
                </h3>
                <p className="mt-1.5 text-small text-body-strong">{experience.company_name}</p>
              </div>
              <p className="max-w-[62ch] text-copy text-body lg:min-w-0 lg:flex-[1.4]">
                {experience.summary}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
};

export default Experience;
