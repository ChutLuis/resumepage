import { Section, Reveal, SectionHead } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Tech = () => {
  const { t, content } = useLocale();

  return (
    <Section id="tech" className="py-20 sm:py-24 lg:py-28">
      <Reveal>
        <SectionHead index="03" label={t.tech.subhead} title={t.tech.heading} />

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-10">
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-9 lg:col-start-4">
            {content.techGroups.map((group) => (
              <div key={group.id}>
                <p className="border-b border-line pb-3 font-mono text-[12px] uppercase tracking-eyebrow text-body">
                  {group.label}
                </p>
                <ul className="mt-4 space-y-2 text-[17px] leading-relaxed text-body-strong">
                  {group.items.map((tech) => <li key={tech.name}>{tech.name}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
};

export default Tech;