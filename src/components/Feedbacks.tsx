import { Section, Reveal, Eyebrow } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Feedbacks = () => {
  const { t, content } = useLocale();

  return (
    <Section id="testimonials" className="pb-10 pt-[72px]">
      <Reveal>
        <Eyebrow>{t.testimonials.subhead}</Eyebrow>
        <div className="mt-6 grid grid-cols-1 border-t border-line md:grid-cols-3">
          {content.testimonials.map((item) => (
            <figure
              key={item.id}
              className="border-b border-divider py-8 last:border-b-0 md:border-b-0 md:border-r md:border-divider md:px-9 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <blockquote className="font-serif text-[21px] italic leading-[1.55] text-quote">
                &ldquo;{item.testimonial}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-[13px] text-body">
                <span className="font-semibold text-heading">{item.name}</span>{" "}
                — {item.designation}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </Section>
  );
};

export default Feedbacks;
