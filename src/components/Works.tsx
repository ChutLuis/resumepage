import { Section, Reveal, Eyebrow } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const PLACEHOLDER_STRIPES =
  "repeating-linear-gradient(45deg, rgba(139,92,246,0.07), rgba(139,92,246,0.07) 12px, transparent 12px, transparent 24px)";

const WorkThumbnail = ({
  image,
  name,
  imageLabel,
}: {
  image?: string;
  name: string;
  imageLabel?: string;
}) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="h-[160px] w-full rounded-lg border border-line object-cover transition duration-300 group-hover:brightness-110"
      />
    );
  }

  return (
    <div
      className="flex h-[160px] w-full items-center justify-center rounded-lg border border-line bg-surface"
      style={{ backgroundImage: PLACEHOLDER_STRIPES }}
    >
      <span className="px-4 text-center font-mono text-[12px] text-body">
        {imageLabel}
      </span>
    </div>
  );
};

const Works = () => {
  const { t, content } = useLocale();

  return (
    <Section id="work" className="py-10">
      <Reveal>
        <Eyebrow>{t.work.subhead}</Eyebrow>
        <div className="mt-6 border-t border-line">
          {content.workItems.map((item) => (
            <article
              key={item.id}
              className="group grid grid-cols-1 items-start gap-6 border-b border-divider py-[30px] lg:grid-cols-[64px_1.1fr_1fr_320px] lg:items-center lg:gap-8"
            >
              {/* Number */}
              <span className="font-mono text-[22px] leading-none text-accent-500">
                {item.number}
              </span>

              {/* Name / descriptor / stack */}
              <div>
                <h3 className="font-display text-[26px] font-bold leading-tight text-heading">
                  {item.name}
                  {item.status && (
                    <span className="ml-2 align-middle font-mono text-[11px] text-status">
                      ● {item.statusLabel}
                    </span>
                  )}
                </h3>
                <p className="mt-1.5 text-[14px] text-body">{item.descriptor}</p>
                <p className="mt-2.5 font-mono text-[12px] text-accent-400">
                  {item.stack}
                </p>
              </div>

              {/* Paragraph + link */}
              <div className="text-[14px] leading-[1.65] text-body">
                <p>{item.paragraph}</p>
                <p className="mt-2.5">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-300 transition-colors duration-200 hover:text-accent-200"
                  >
                    {item.linkLabel} ↗
                  </a>
                </p>
              </div>

              {/* Thumbnail */}
              <WorkThumbnail
                image={item.image}
                name={item.name}
                imageLabel={item.imageLabel}
              />
            </article>
          ))}
        </div>
      </Reveal>
    </Section>
  );
};

export default Works;
