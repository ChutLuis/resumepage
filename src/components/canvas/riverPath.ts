import { FRAME, heroRiverControls } from "./aquariusData";

export const RIVER_SAMPLE_COUNT = 512;

export interface RiverPathFit {
  centerXDocPx: number;
  centerYDocPx: number;
  pxPerUnit: number;
}

export interface RiverSectionOffset {
  id: string;
  top: number;
  height: number;
}

/**
 * Document-px rectangle describing the Contact lake. The lake is a rectangle,
 * not an ellipse: `centerX/centerY` is its centre and `radiusX/radiusY` are the
 * HALF width / HALF height (so the rect spans centerX±radiusX, centerY±radiusY).
 */
export interface RiverPoolAnchor {
  centerX: number;
  centerY: number;
  /** HALF width of the lake rectangle, in document px. */
  radiusX: number;
  /** HALF height of the lake rectangle, in document px. */
  radiusY: number;
  /** Document px where the stream lands (top hairline of Contact, centred). */
  impactX: number;
  impactY: number;
  /** Document px centre and px half extents of the reflected constellation. */
  reflectX: number;
  reflectY: number;
  reflectHalfWidth: number;
  reflectHalfHeight: number;
  /** Calm rectangles (doc px) where the lake keeps out of the way of content.
   *  A rectangle is disabled when its right edge is <= its left edge. */
  calmLeft: number;
  calmTop: number;
  calmRight: number;
  calmBottom: number;
  calm2Left: number;
  calm2Top: number;
  calm2Right: number;
  calm2Bottom: number;
}

export type RiverPool = RiverPoolAnchor & {
  /** Half-width of the falling sheet where it meets the lake surface. */
  impactHalfWidth: number;
};

export interface RiverPathData {
  /** RGBA samples: document x, document y, half-width in px, spare. */
  samples: Float32Array;
  length: number;
  heroEnd: number;
  poolStart: number;
  heroBottom: number;
  mobile: boolean;
  pool: RiverPool;
  /** Normalised (0..1) path position where the final vertical drop begins. */
  fallStart: number;
}

interface ControlPoint {
  x: number;
  y: number;
  width: number;
}

const CATMULL_STEPS = 18;
const frameCenterY = -(FRAME.y + FRAME.height / 2);

/** River half-width (px) at the first and last section control points. */
const RIVER_WIDTH_START_DESKTOP = 12;
const RIVER_WIDTH_END_DESKTOP = 72;
const RIVER_WIDTH_START_MOBILE = 8;
const RIVER_WIDTH_END_MOBILE = 40;

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1 +
    (p2 - p0) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (3 * p1 - p0 - 3 * p2 + p3) * t3
  );
};

const interpolatePoint = (p0: ControlPoint, p1: ControlPoint, p2: ControlPoint, p3: ControlPoint, t: number): ControlPoint => ({
  x: catmull(p0.x, p1.x, p2.x, p3.x, t),
  y: catmull(p0.y, p1.y, p2.y, p3.y, t),
  width: Math.max(0.5, catmull(p0.width, p1.width, p2.width, p3.width, t)),
});

export const buildRiverPath = ({
  fit,
  heroBottom,
  viewportWidth,
  viewportHeight,
  sections,
  pool,
}: {
  fit: RiverPathFit;
  heroBottom: number;
  viewportWidth: number;
  viewportHeight: number;
  sections: readonly RiverSectionOffset[];
  pool: RiverPoolAnchor | null;
}): RiverPathData | null => {
  const orderedSections = ["work", "experience", "tech", "about", "testimonials", "contact"]
    .map((id) => sections.find((section) => section.id === id))
    .filter((section): section is RiverSectionOffset => Boolean(section));
  if (orderedSections.length !== 6) return null;

  const mobile = viewportWidth <= 768;
  const sideInset = mobile ? 0.12 : 0.08;
  const heroControls = heroRiverControls().map(([x, y], index, all): ControlPoint => {
    const t = index / (all.length - 1);
    return {
      x: fit.centerXDocPx + x * fit.pxPerUnit,
      y: fit.centerYDocPx - (y - frameCenterY) * fit.pxPerUnit,
      width: (0.015 + 0.115 * Math.pow(t, 0.85)) * fit.pxPerUnit,
    };
  });

  const heroEnd = heroControls[heroControls.length - 1];
  const leadIn = {
    x: heroEnd.x,
    y: heroEnd.y + Math.max(220, viewportHeight * 0.25),
    width: heroEnd.width,
  };
  const controls = [...heroControls, leadIn];
  let priorY = leadIn.y;

  const contact = orderedSections[orderedSections.length - 1];
  const resolvedPool: RiverPoolAnchor = pool ?? (() => {
    const halfWidth = Math.min(280, viewportWidth * 0.38);
    const top = contact.top + 48;
    return {
      centerX: viewportWidth * 0.5,
      centerY: (top + (contact.top + contact.height)) * 0.5,
      radiusX: viewportWidth * 0.5,
      radiusY: Math.max((contact.top + contact.height - top) * 0.5, 1),
      impactX: viewportWidth * 0.5,
      impactY: top,
      reflectX: viewportWidth * 0.5,
      reflectY: contact.top + contact.height - 100,
      reflectHalfWidth: halfWidth,
      reflectHalfHeight: Math.min(100, halfWidth * 0.4),
      // Calm rectangles are disabled when the DOM measurement is unavailable.
      calmLeft: 0,
      calmTop: 0,
      calmRight: 0,
      calmBottom: 0,
      calm2Left: 0,
      calm2Top: 0,
      calm2Right: 0,
      calm2Bottom: 0,
    };
  })();

  const W0 = mobile ? RIVER_WIDTH_START_MOBILE : RIVER_WIDTH_START_DESKTOP;
  const W1 = mobile ? RIVER_WIDTH_END_MOBILE : RIVER_WIDTH_END_DESKTOP;

  orderedSections.forEach((section, index) => {
    if (index === orderedSections.length - 1) return;
    const side = index % 2 === 0 ? 1 - sideInset : sideInset;
    const targetY = section.top + section.height * 0.48;
    const y = Math.max(targetY, priorY + Math.max(120, viewportHeight * 0.2));
    controls.push({
      x: viewportWidth * side,
      y,
      width: W0 + (W1 - W0) * Math.pow((index + 1) / (orderedSections.length - 1), 1.4),
    });
    priorY = y;
  });

  const impactY = Math.max(resolvedPool.impactY, priorY + 140);
  const approachY = Math.min(Math.max(priorY + 100, impactY - 320), impactY - 80);
  const approachIndex = controls.length;
  controls.push({ x: resolvedPool.impactX, y: approachY, width: W1 });
  controls.push({ x: resolvedPool.impactX, y: impactY, width: W1 * 1.5 });

  const heroEndIndex = (heroControls.length - 1) * CATMULL_STEPS;
  const points: ControlPoint[] = [controls[0]];

  for (let segment = 0; segment < controls.length - 1; segment++) {
    const p0 = controls[Math.max(segment - 1, 0)];
    const p1 = controls[segment];
    const p2 = controls[segment + 1];
    const p3 = controls[Math.min(segment + 2, controls.length - 1)];
    for (let step = 1; step <= CATMULL_STEPS; step++) {
      const point = interpolatePoint(p0, p1, p2, p3, step / CATMULL_STEPS);
      point.y = Math.max(point.y, points[points.length - 1].y);
      points.push(point);
    }
  }

  const distances = new Float64Array(points.length);
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    distances[i] = distances[i - 1] + Math.hypot(dx, dy);
  }
  const length = distances[distances.length - 1];
  if (!length) return null;

  // Control point k sits at points[k * CATMULL_STEPS]: the loop above pushes
  // CATMULL_STEPS points per segment starting from the second control point.
  const fallStart = Math.min(
    Math.max(distances[Math.min(approachIndex * CATMULL_STEPS, distances.length - 1)] / length, 0),
    1,
  );

  const samples = new Float32Array(RIVER_SAMPLE_COUNT * 4);
  let segment = 1;
  for (let i = 0; i < RIVER_SAMPLE_COUNT; i++) {
    const target = (i / (RIVER_SAMPLE_COUNT - 1)) * length;
    while (segment < distances.length - 1 && distances[segment] < target) segment++;
    const start = distances[segment - 1];
    const span = distances[segment] - start || 1;
    const t = (target - start) / span;
    const a = points[segment - 1];
    const b = points[segment];
    const offset = i * 4;
    samples[offset] = a.x + (b.x - a.x) * t;
    samples[offset + 1] = a.y + (b.y - a.y) * t;
    samples[offset + 2] = a.width + (b.width - a.width) * t;
    samples[offset + 3] = 0;
  }

  return {
    samples,
    length,
    heroEnd: distances[heroEndIndex] / length,
    poolStart: 1,
    heroBottom,
    mobile,
    pool: { ...resolvedPool, impactY, impactHalfWidth: W1 * 1.5 },
    fallStart,
  };
};
