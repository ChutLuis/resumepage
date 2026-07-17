import { useState } from "react";
import { motion, Variants } from "framer-motion";
import styles from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import type { Testimonial } from "../types";
import { useLocale } from "../i18n/LocaleContext";

interface FeedbackCardProps extends Testimonial {
  index: number;
}

// Initials from a person's name, e.g. "Lisa Gonzáles Solé" -> "LS"
const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Stars = () => (
  <div className="flex gap-1" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className="h-4 w-4 fill-cyan-400"
        viewBox="0 0 20 20"
      >
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
      </svg>
    ))}
  </div>
);

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => {
  // LinkedIn-hosted avatar URLs are signed and expire / block hotlinking, so
  // fall back to an initials avatar when the image fails to load.
  const [imageFailed, setImageFailed] = useState(!image);

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.3, 0.75) as Variants}
      className="gradient-border card-lift glass flex w-full flex-col rounded-3xl p-8 xs:w-[360px]"
    >
      <div className="flex items-center justify-between">
        <Stars />
        <span
          className="text-gradient select-none font-display text-5xl leading-none"
          aria-hidden="true"
        >
          &rdquo;
        </span>
      </div>

      <p className="mt-5 flex-1 text-[16px] leading-relaxed text-body">
        {testimonial}
      </p>

      <div className="mt-7 flex items-center gap-3 border-t border-line/60 pt-5">
        {imageFailed ? (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-600 to-cyan-600 text-sm font-bold text-white ring-2 ring-accent-500/40"
              aria-label={name}
          >
            {getInitials(name)}
          </div>
        ) : (
          <img
            src={image}
            alt={name}
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-accent-500/40"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="flex flex-col">
          <p className="font-medium text-heading">
            <span className="text-accent-400">@</span>
            {name}
          </p>
          <p className="mt-0.5 text-[12px] text-body">
            {designation} · {company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Feedbacks = () => {
  const { t, content } = useLocale();

  return (
    <div className="mt-12">
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.styles.sectionSubText}>{t.testimonials.subhead}</p>
        <h2 className={styles.styles.sectionHeadText}>{t.testimonials.heading}</h2>
      </motion.div>

      <div className="mt-12 flex flex-wrap gap-7">
        {content.testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "testimonials");
