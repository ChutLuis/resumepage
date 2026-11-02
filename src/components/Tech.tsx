import { Section, Reveal, SectionHead, fillTemplate, tagClass } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Tech = () => {
  const { t, content } = useLocale();
  const toolCount = content.techGroups.reduce((total, group) => total + group.items.length, 0);
  const extent = fillTemplate(t.tech.extent, {
    count: toolCount,
    groups: content.techGroups.length,
  });

  return (
    <Section id="tech" className="py-16 sm:py-20 lg:py-24">
      <SectionHead label={t.tech.subhead} title={t.tech.heading} aside={extent} />

      <Reveal className="mt-12">
        <div data-scene-calm>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {content.techGroups.map((group) => {
              const notes = group.items.flatMap((tech) => {
                const note = t.tech.usedIn[tech.name];
                return note ? [`${tech.name} — ${note}`] : [];
              });

              return (
                <div key={group.id} className="min-w-0">
                  <h3 className="border-b border-line pb-3.5 text-small font-medium text-body-strong">
                    {group.label}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((tech) => (
                      <li key={tech.name} className={tagClass}>
                        {tech.name}
                      </li>
                    ))}
                  </ul>
                  {notes.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-1.5">
                      {notes.map((note) => (
                        <li key={note} className="text-label text-caption">
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-10 text-label text-caption">{t.tech.notesCaption}</p>
        </div>
      </Reveal>
    </Section>
  );
};

export default Tech;
