/**
 * Render-free bridge between the hero (which owns the DOM anchor the constellation tracks)
 * and the fixed full-page WebGL scene layer. Three-free so the hero can import it eagerly.
 *
 * - `anchor`: the element the constellation is meet-fitted into (desktop column or, on
 *   mobile, the hero section itself).
 * - `region`: the hero section, used for pointer tilt.
 * - `ready`: the scene has drawn its first frame.
 * - `lost`: WebGL is unavailable, failed to load or lost its context; show the SVG fallback.
 */
export type AnchorKind = "column" | "hero";

export interface SceneSnapshot {
  anchor: HTMLElement | null;
  region: HTMLElement | null;
  kind: AnchorKind;
  ready: boolean;
  lost: boolean;
}

let snapshot: SceneSnapshot = { anchor: null, region: null, kind: "column", ready: false, lost: false };
const listeners = new Set<() => void>();

const update = (patch: Partial<SceneSnapshot>) => {
  const next = { ...snapshot, ...patch };
  if ((Object.keys(next) as (keyof SceneSnapshot)[]).every((key) => next[key] === snapshot[key])) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
};

export const sceneStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: (): SceneSnapshot => snapshot,
  setAnchor(anchor: HTMLElement | null, region: HTMLElement | null, kind: AnchorKind) {
    update({ anchor, region, kind });
  },
  clearAnchor(anchor: HTMLElement | null) {
    if (snapshot.anchor === anchor) update({ anchor: null, region: null });
  },
  setReady: (ready: boolean) => update({ ready }),
  setLost: (lost: boolean) => update({ lost }),
};

export default sceneStore;
