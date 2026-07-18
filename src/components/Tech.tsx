import { Section, Reveal, Eyebrow } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Tech = () => {
  const { t, content } = useLocale();

  return (
    <Section id="tech" className="pb-10 pt-[72px]">
      <Reveal>
        <Eyebrow>{t.tech.subhead}</Eyebrow>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.techGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-xl border border-line bg-surface p-6"
            >
              <p className="mb-4 font-mono text-[12px] text-accent-400">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((tech) => (
                  <span
                    key={tech.name}
                    className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-[7px] text-[13px] text-body-strong"
                  >
                    <img
                      src={tech.icon}
                      alt=""
                      aria-hidden="true"
                      className="h-[18px] w-[18px] object-contain"
                      loading="lazy"
                    />
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
};

export default Tech;
