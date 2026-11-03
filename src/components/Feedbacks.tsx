import { Section, Reveal, SectionHead, fillTemplate } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Feedbacks = () => {
  const { t, content } = useLocale();
  const [lead, ...rest] = content.testimonials;

  return (
    <Section id="testimonials" className="py-16 sm:py-20 lg:py-24">
      <SectionHead
        label={t.testimonials.subhead}
        title={t.testimonials.heading}
        aside={fillTemplate(t.testimonials.extent, { count: content.testimonials.length })}
      />

      <Reveal className="mt-12">
        <div data-scene-calm>
          {lead && (
            <figure className="max-w-[860px]">
              <blockquote className="font-display text-display-statement font-medium text-heading">
                &ldquo;{lead.testimonial}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-8 shrink-0 bg-control" />
                <span className="text-small text-body">
                  <span className="font-medium text-body-strong">{lead.name}</span> — {lead.designation}
                </span>
              </figcaption>
            </figure>
          )}

          {rest.length > 0 && (
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {rest.map((item) => (
                <figure key={item.id} className="rounded-xl border border-line bg-surface p-7">
                  <blockquote className="text-lead text-quote">
                    &ldquo;{item.testimonial}&rdquo;
                  </blockquote>
                  <figcaption className="mt-[18px]">
                    <span className="block text-small font-medium text-body-strong">{item.name}</span>
                    <span className="block text-small text-body">{item.designation}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
};

export default Feedbacks;
