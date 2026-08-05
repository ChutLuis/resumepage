import { Section, Reveal, Eyebrow } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const PLACEHOLDER_STRIPES =
  "repeating-linear-gradient(45deg, rgba(139,92,246,0.07), rgba(139,92,246,0.07) 12px, transparent 12px, transparent 24px)";

const WorkThumbnail = ({
  image,
  name,
  imageLabel,
  className = "h-[160px]",
}: {
  image?: string;
  name: string;
  imageLabel?: string;
  className?: string;
}) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        loading="lazy"
        className={`w-full rounded-lg border border-line object-cover transition duration-300 group-hover:brightness-110 ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-lg border border-line bg-surface ${className}`}
      style={{ backgroundImage: PLACEHOLDER_STRIPES }}
    >
      <span className="px-4 text-center font-mono text-[12px] text-body">
        {imageLabel}
      </span>
    </div>
  );
};

/**
 * Lead card for the single flagship/proprietary engagement — no number (it
 * isn't part of the "Also built" count), larger type, and a status chip
 * instead of a numbered-list treatment. No image/link: this is proprietary
 * production work described by mechanism, not by artifact. Replace with the
 * Waymark case study once it ships (see PIN comment in constants/index.ts).
 */
const FeaturedWork = ({
  item,
}: {
  item: ReturnType<typeof useLocale>["content"]["featuredWork"];
}) => (
  <article className="rounded-2xl border border-line bg-surface p-8 sm:p-10">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-10">
      <div>
        <h3 className="font-display text-[26px] font-bold leading-tight text-heading sm:text-[30px]">
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
        <p className="mt-4 text-[14px] leading-[1.65] text-body">
          {item.paragraph}
        </p>
        <p className="mt-3 font-mono text-[12px] text-caption">
          {item.linkLabel}
        </p>
      </div>
      <WorkThumbnail
        name={item.name}
        imageLabel={item.imageLabel}
        className="h-[200px] lg:h-[240px]"
      />
    </div>
  </article>
);

const Works = () => {
  const { t, content } = useLocale();

  return (
    <Section id="work" className="py-10">
      <Reveal>
        <Eyebrow>{t.work.subhead}</Eyebrow>

        <div className="mt-6">
          <FeaturedWork item={content.featuredWork} />
        </div>

        <p className="mb-2 mt-12 font-mono text-[12px] uppercase tracking-eyebrow text-caption">
          {t.work.secondaryLabel}
        </p>
        <div className="border-t border-line">
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

              {/* Paragraph + link (or plain label when there's no safe public URL yet) */}
              <div className="text-[14px] leading-[1.65] text-body">
                <p>{item.paragraph}</p>
                <p className="mt-2.5">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-300 transition-colors duration-200 hover:text-accent-200"
                    >
                      {item.linkLabel} ↗
                    </a>
                  ) : (
                    <span className="font-mono text-[12px] text-caption">
                      {item.linkLabel}
                    </span>
                  )}
                </p>
              </div>

              {/* Thumbnail */}
              <WorkThumbnail image={item.image} name={item.name} imageLabel={item.imageLabel} />
            </article>
          ))}
        </div>
      </Reveal>
    </Section>
  );
};

export default Works;
