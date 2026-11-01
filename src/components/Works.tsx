import { Section, Reveal, SectionHead } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";
import type { WorkId } from "../types";

// Intrinsic dimensions of the existing showcase files; unknown images still
// render at their natural aspect ratio without a fabricated placeholder.
const imageSizes: Partial<Record<WorkId, readonly [number, number]>> = {
  socialhub: [1100, 563],
  comal: [2560, 1280],
  socializa: [2465, 1292],
  "portfolio-analytics": [2469, 1291],
};

type LocalizedWork = ReturnType<typeof useLocale>["content"]["workItems"][number];

/** 6x6 status square shown before live/production labels. */
const StatusDot = () => (
  <span aria-hidden="true" className="mr-2.5 inline-block h-1.5 w-1.5 bg-status align-middle" />
);

const WorkDetails = ({ item }: { item: LocalizedWork }) => {
  const showDot = item.status === "live" || item.status === "production";
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-[12px] text-body">{item.number}</span>
        {item.status && (
          <span className="font-mono text-[12px] text-body">
            {showDot && <StatusDot />}
            {item.statusLabel}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-[24px] font-medium leading-tight tracking-[-0.025em] text-heading sm:text-[28px]">
        {item.name}
      </h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-body-strong">{item.descriptor}</p>
      <p className="mt-3 font-mono text-[12px] leading-relaxed text-body">{item.stack}</p>
      <p className="mt-4 max-w-[65ch] text-[15px] leading-[1.7] text-body">{item.paragraph}</p>
      <p className="mt-3 text-[14px] leading-relaxed">
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-accent-300 underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-accent-200">
            {item.linkLabel} ↗
          </a>
        ) : (
          <span className="font-mono text-[12px] text-body">{item.linkLabel}</span>
        )}
      </p>
    </div>
  );
};

const Works = () => {
  const { t, content } = useLocale();
  const featured = content.featuredWork;
  const featuredShowDot = featured.status === "live" || featured.status === "production";

  return (
    <Section id="work" className="py-20 sm:py-24 lg:py-28">
      <Reveal>
        <SectionHead index="01" label={t.work.subhead} title={t.work.heading} />

        <article className="group mt-12 grid grid-cols-1 gap-y-6 lg:mt-16 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-3">
            <p className="font-mono text-[12px] text-body">
              {featuredShowDot && <StatusDot />}
              {featured.statusLabel}
            </p>
          </div>
          <div className="lg:col-span-9">
            <h3 className="max-w-[22ch] text-balance font-display text-[30px] font-medium leading-[1.08] tracking-[-0.03em] text-heading sm:text-[40px] lg:text-[44px]">
              {featured.name}
            </h3>
            <p className="mt-4 text-[18px] leading-[1.5] text-body-strong">{featured.descriptor}</p>
            <p className="mt-6 max-w-[65ch] text-[16px] leading-[1.75] text-body">{featured.paragraph}</p>
            <div className="mt-8 grid gap-3 border-t border-line pt-5 font-mono text-[12px] leading-relaxed text-body sm:grid-cols-3">
              <p>{featured.stack}</p>
              <p>{featured.imageLabel}</p>
              <p>{featured.linkLabel}</p>
            </div>
          </div>
        </article>

        <div className="mt-20 flex items-center gap-4 lg:mt-24">
          <p className="font-mono text-[12px] uppercase tracking-eyebrow text-body">{t.work.secondaryLabel}</p>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-12 lg:gap-x-10 lg:gap-y-20">
          {content.workItems.map((item, index) => {
            const dimensions = imageSizes[item.id];
            const columns = index % 4 === 0 || index % 4 === 3 ? "md:col-span-7" : "md:col-span-5";
            return (
              <article key={item.id} className={item.image ? `group min-w-0 ${columns}` : "min-w-0 border-t border-line pt-6 md:col-span-12"}>
                {item.image && (
                  <div className="mb-6 overflow-hidden border border-line transition-colors duration-300 group-hover:border-accent-400/50">
                    <img
                      src={item.image}
                      alt={item.imageLabel || item.name}
                      width={dimensions?.[0]}
                      height={dimensions?.[1]}
                      loading="lazy"
                      className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                    />
                  </div>
                )}
                {!item.image && item.imageLabel && (
                  <p className="mb-5 font-mono text-[12px] leading-relaxed text-body">{item.imageLabel}</p>
                )}
                <WorkDetails item={item} />
              </article>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
};

export default Works;
