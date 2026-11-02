import {
  ArrowUpRight,
  Eyebrow,
  Reveal,
  Section,
  SectionHead,
  StatusDot,
  fillTemplate,
  textLinkClass,
} from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";
import PlatformSchematic from "./work/PlatformSchematic";

type LocalizedWork = ReturnType<typeof useLocale>["content"]["workItems"][number];

/** Status label with a green square only for work that is running for real. */
const StatusChip = ({ status, label }: { status: LocalizedWork["status"]; label: string }) => {
  if (!status || !label) return null;
  const showDot = status === "live" || status === "production" || status === "flagship";
  return (
    <span className="inline-flex items-center text-label font-medium text-body-strong">
      {showDot && <StatusDot />}
      {label}
    </span>
  );
};

const WorkCard = ({ item }: { item: LocalizedWork }) => {
  const thumbnail = item.image ? (
    <img
      src={item.image}
      alt={item.imageLabel || item.name}
      loading="lazy"
      className={`block aspect-[16/10] w-full rounded-md border border-line object-cover object-top transition-colors duration-300 ${
        item.url ? "group-hover/card:border-accent-400/50" : ""
      }`}
    />
  ) : null;

  return (
    <article
      className={item.image ? "group/card min-w-0" : "min-w-0 border-t border-line pt-4"}
    >
      {thumbnail &&
        (item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden="true"
            className="block"
          >
            {thumbnail}
          </a>
        ) : (
          thumbnail
        ))}
      {!item.image && item.imageLabel && (
        <p className="text-label font-medium text-caption">{item.imageLabel}</p>
      )}

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-display-item font-medium text-heading">{item.name}</h3>
        <div className="flex items-baseline gap-3.5">
          <StatusChip status={item.status} label={item.statusLabel} />
          <span className="font-mono text-label text-caption">{item.number}</span>
        </div>
      </div>
      <p className="mt-1.5 text-small text-body-strong">{item.descriptor}</p>
      <p className="mt-2.5 max-w-[58ch] text-small text-body">{item.paragraph}</p>
      <p className="mt-3 font-mono text-label text-body">{item.stack}</p>
      <div className="mt-3.5">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${textLinkClass} -my-2`}
          >
            <span>{item.linkLabel}</span>
            <ArrowUpRight />
          </a>
        ) : (
          <p className="text-small text-caption">{item.linkLabel}</p>
        )}
      </div>
    </article>
  );
};

const Works = () => {
  const { t, content } = useLocale();
  const featured = content.featuredWork;
  const telus = content.experiences.find((experience) => experience.id === "telus");
  const projectCount = 1 + content.workItems.length;

  return (
    <Section id="work" className="py-16 sm:py-20 lg:py-24">
      <SectionHead
        label={t.work.subhead}
        title={t.work.heading}
        aside={fillTemplate(t.work.extent, { count: projectCount })}
      />

      <Reveal className="mt-12 lg:mt-14">
        <article
          className="grid grid-cols-1 items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
          data-scene-calm
        >
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <Eyebrow>{t.work.featuredLabel}</Eyebrow>
              <StatusChip status={featured.status} label={featured.statusLabel} />
            </div>
            <h3 className="mt-4 text-balance font-display text-display-feature font-medium text-heading">
              {featured.name}
            </h3>
            <p className="mt-2.5 text-lead text-body-strong">{featured.descriptor}</p>
            <p className="mt-5 max-w-[62ch] text-copy text-body">{featured.paragraph}</p>

            <dl className="mt-7">
              {telus && (
                <div className="flex items-baseline gap-4 border-t border-line py-3">
                  <dt className="w-24 shrink-0 text-label font-medium text-caption">{t.work.meta.company}</dt>
                  <dd className="min-w-0 text-small text-body-strong">{telus.company_name}</dd>
                </div>
              )}
              {telus && (
                <div className="flex items-baseline gap-4 border-t border-line py-3">
                  <dt className="w-24 shrink-0 text-label font-medium text-caption">{t.work.meta.dates}</dt>
                  <dd className="min-w-0 font-mono text-label lowercase text-body">{telus.date}</dd>
                </div>
              )}
              <div className="flex items-baseline gap-4 border-t border-line py-3">
                <dt className="w-24 shrink-0 text-label font-medium text-caption">{t.work.meta.stack}</dt>
                <dd className="min-w-0 font-mono text-label text-body">{featured.stack}</dd>
              </div>
            </dl>

            <p className="mt-5 text-small text-caption">{featured.linkLabel}</p>
          </div>

          <PlatformSchematic
            label={t.work.schematic.label}
            layers={t.work.schematic.layers}
            release={t.work.schematic.release}
            caption={featured.imageLabel ?? ""}
          />
        </article>

        <div className="mt-16 flex items-center gap-4 sm:mt-20 lg:mt-24">
          <Eyebrow className="shrink-0">{t.work.secondaryLabel}</Eyebrow>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>

        <div
          className="mt-7 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2"
          data-scene-calm
        >
          {content.workItems.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
};

export default Works;
