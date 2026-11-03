import { Eyebrow, tagClass } from "../ui/primitives";
import type { SchematicLayerId } from "../../types";

type Layer = { label: string; items: readonly string[] };

const ORDER: readonly SchematicLayerId[] = ["screen", "platform", "server"];

/**
 * Layer diagram of the mobile platform work, standing in for the absent public
 * screenshot. Three rows (screen -> platform -> server), echoing the hero line
 * "from screen to server", plus the release note, inside one hairline panel.
 * Flat surfaces only: 1px rules, no shadows or glows.
 */
const PlatformSchematic = ({
  label,
  layers,
  release,
  caption,
  className = "",
}: {
  label: string;
  layers: Record<SchematicLayerId, Layer>;
  release: string;
  caption: string;
  className?: string;
}) => (
  <figure className={`min-w-0 ${className}`}>
    <div className="rounded-xl border border-line bg-surface p-6">
      <Eyebrow>{label}</Eyebrow>
      <ol className="mt-3.5">
        {ORDER.map((id) => {
          const layer = layers[id];
          return (
            <li key={id} className="flex items-start gap-5 border-t border-line py-4">
              <p className="w-28 shrink-0 font-display text-lead font-medium text-heading">
                {layer.label}
              </p>
              <ul className="flex min-w-0 flex-1 flex-wrap gap-2">
                {layer.items.map((item) => (
                  <li key={item} className={tagClass}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-2.5 border-t border-line pt-4">
        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 bg-accent-400" />
        <p className="text-small text-body-strong">{release}</p>
      </div>
    </div>
    {caption ? (
      <figcaption className="mt-3 text-label font-medium text-caption">{caption}</figcaption>
    ) : null}
  </figure>
);

export default PlatformSchematic;
