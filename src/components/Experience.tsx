import { Section, Reveal, SectionHead } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Experience = () => {
  const { t, content } = useLocale();
  const lastIndex = content.experiences.length - 1;

  return (
    <Section id="experience" className="py-20 sm:py-24 lg:py-28">
      <Reveal>
        <SectionHead index="02" label={t.experience.subhead} title={t.experience.heading} />

        <div className="mt-12 lg:mt-16">
          {content.experiences.map((experience, index) => (
            <article
              key={experience.id}
              className={`grid gap-3 border-t border-line py-8 lg:grid-cols-12 lg:gap-x-10 lg:py-10 ${
                index === lastIndex ? "border-b" : ""
              }`}
            >
              <p className="font-mono text-[12px] leading-relaxed text-body lg:col-span-3 lg:pt-2">
                {experience.date}
              </p>
              <div className="lg:col-span-9">
                <h3 className="font-display text-[22px] font-medium leading-snug tracking-[-0.02em] text-heading sm:text-[24px]">
                  {experience.title}
                  <span className="mt-1 block font-sans text-[15px] font-normal tracking-normal text-body-strong">
                    {experience.company_name}
                  </span>
                </h3>
                <p className="mt-4 max-w-[65ch] text-[16px] leading-[1.7] text-body">
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