import { Section, Reveal, SectionHead } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Feedbacks = () => {
  const { t, content } = useLocale();
  const [lead, ...rest] = content.testimonials;

  return (
    <Section id="testimonials" className="py-20 sm:py-24 lg:py-28">
      <Reveal>
        <SectionHead index="05" label={t.testimonials.subhead} title={t.testimonials.heading} />

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-9 lg:col-start-4">
            {lead && (
              <figure>
                <blockquote className="max-w-[30ch] font-serif italic text-[26px] leading-[1.25] tracking-[-0.01em] text-quote sm:text-[32px] lg:text-[40px]">
                  &ldquo;{lead.testimonial}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-[14px] text-body">
                  <span className="font-semibold text-heading">{lead.name}</span>{" "}
                  — {lead.designation}
                </figcaption>
              </figure>
            )}

            {rest.length > 0 && (
              <div className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-2 md:gap-12">
                {rest.map((item) => (
                  <figure key={item.id}>
                    <blockquote className="max-w-[36ch] font-serif italic text-[20px] leading-[1.45] text-quote sm:text-[22px]">
                      &ldquo;{item.testimonial}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 text-[13px] text-body">
                      <span className="font-semibold text-heading">{item.name}</span>{" "}
                      — {item.designation}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
};

export default Feedbacks;