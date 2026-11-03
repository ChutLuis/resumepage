// Approximate Aquarius coordinates: right ascension, declination, brightness.
export const STARS = {
  eps: [20.79, -9.5, 1.2],
  bet: [21.53, -5.57, 1.6],
  alp: [22.1, -0.32, 1.6],
  gam: [22.36, -1.39, 1.2],
  zet: [22.48, 0.02, 1.0],
  eta: [22.59, -0.12, 1.0],
  pi: [22.42, 1.38, 0.9],
  the: [22.28, -7.78, 1.0],
  iot: [22.11, -13.87, 0.9],
  lam: [22.88, -7.58, 1.0],
  tau: [22.83, -13.59, 0.9],
  del: [22.91, -15.82, 1.4],
  phi: [23.23, -6.05, 0.9],
  psi: [23.26, -9.09, 1.0],
  s88: [23.16, -21.17, 0.9],
} as const;

export type StarId = keyof typeof STARS;

export const EDGES: readonly (readonly [StarId, StarId])[] = [
  ["eps", "bet"], ["bet", "alp"], ["alp", "gam"], ["gam", "zet"],
  ["zet", "eta"], ["gam", "pi"], ["alp", "the"], ["the", "iot"],
  ["the", "lam"], ["lam", "phi"], ["phi", "psi"], ["psi", "s88"],
  ["lam", "tau"], ["tau", "del"], ["del", "psi"],
];

export const STAR_IDS = Object.keys(STARS) as StarId[];

// Shared meet-fit frame: SVG coordinates invert the scene's y axis.
export const FRAME = { x: -3.4, y: -2.6, width: 6.8, height: 5.7 } as const;

export const starPosition = (id: StarId): [number, number, number] => {
  const [ra, dec] = STARS[id];
  const depth = ((STAR_IDS.indexOf(id) % 5) - 2) * 0.06;
  return [-(ra - 22.05) * 2.1, (dec + 8.5) * 0.21, depth];
};

type Vec3 = [number, number, number];

// --- Draw-in schedule -------------------------------------------------------
// Earliest-arrival traversal (Dijkstra over edge lengths) from alpha at a
// constant pen speed. Each edge is drawn outward from whichever end is reached
// first; the del-psi cycle edge therefore starts at its earlier end.
export const PEN_SPEED = 3.2; // scene units per second
export const INTRO_OFFSET = 0.35; // seconds before the first stroke

const edgeLength = (a: StarId, b: StarId) => {
  const [ax, ay] = starPosition(a);
  const [bx, by] = starPosition(b);
  return Math.hypot(ax - bx, ay - by);
};

const arrival = Object.fromEntries(STAR_IDS.map((id) => [id, Infinity])) as Record<StarId, number>;
arrival.alp = 0;
const settled = new Set<StarId>();
while (settled.size < STAR_IDS.length) {
  const next = STAR_IDS.filter((id) => !settled.has(id)).reduce((a, b) => (arrival[b] < arrival[a] ? b : a));
  settled.add(next);
  for (const [a, b] of EDGES) {
    if (a !== next && b !== next) continue;
    const other = a === next ? b : a;
    arrival[other] = Math.min(arrival[other], arrival[next] + edgeLength(a, b) / PEN_SPEED);
  }
}

export interface ScheduledEdge { from: StarId; to: StarId; delay: number; duration: number }

export const EDGE_SCHEDULE: readonly ScheduledEdge[] = EDGES.map(([a, b]) => {
  const [from, to] = arrival[a] <= arrival[b] ? [a, b] : [b, a];
  return { from, to, delay: INTRO_OFFSET + arrival[from], duration: edgeLength(a, b) / PEN_SPEED };
});

export const STAR_IGNITE = Object.fromEntries(
  STAR_IDS.map((id) => [id, INTRO_OFFSET + arrival[id]])
) as Record<StarId, number>;

export const INTRO_END = Math.max(...EDGE_SCHEDULE.map((e) => e.delay + e.duration));

export const STATUE = { x: 0, baseY: -3.7, height: 6.4, rotY: 0 } as const;
export const STATUE_POUR_POINT: readonly [number, number, number] = [-0.127, 0.447, 0.078];
export const STATUE_START = INTRO_END - 0.3;
export const STATUE_DURATION = 2.0;
const pourXRotated = Math.cos(STATUE.rotY) * STATUE_POUR_POINT[0] + Math.sin(STATUE.rotY) * STATUE_POUR_POINT[2];
const pourZRotated = -Math.sin(STATUE.rotY) * STATUE_POUR_POINT[0] + Math.cos(STATUE.rotY) * STATUE_POUR_POINT[2];
export const STATUE_Z = -pourZRotated * STATUE.height;
export const URN_MOUTH: readonly [number, number] = [
  STATUE.x + pourXRotated * STATUE.height,
  STATUE.baseY + STATUE_POUR_POINT[1] * STATUE.height,
];
export const STREAM_START = STATUE_START + 1.0;
export const PULSE_START = STATUE_START + 1.2;

// Keep the spill just outside the plinth's left edge, then drop past its base.
export const heroRiverControls = (mouth: readonly [number, number] = URN_MOUTH): readonly Vec3[] => {
  const fallX = mouth[0] - 0.35;
  return [
    [mouth[0], mouth[1], 0],
    [mouth[0] - 0.08, mouth[1] - 0.16, 0],
    [fallX, mouth[1] - 0.42, 0],
    [fallX, STATUE.baseY - 0.2, 0],
    [fallX, STATUE.baseY - 0.8, 0],
    [fallX, STATUE.baseY - 1.25, 0],
  ];
};

const STREAM_CONTROLS = heroRiverControls(URN_MOUTH);

const catmullRom = (u: number): Vec3 => {
  const last = STREAM_CONTROLS.length - 1;
  const i = Math.min(Math.floor(Math.min(Math.max(u, 0), last)), last - 1);
  const f = Math.min(Math.max(u, 0), last) - i;
  const p0 = STREAM_CONTROLS[Math.max(i - 1, 0)];
  const p1 = STREAM_CONTROLS[i];
  const p2 = STREAM_CONTROLS[i + 1];
  const p3 = STREAM_CONTROLS[Math.min(i + 2, last)];
  const f2 = f * f;
  const f3 = f2 * f;
  return [0, 1, 2].map(
    (k) =>
      0.5 *
      (2 * p1[k] +
        (p2[k] - p0[k]) * f +
        (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * f2 +
        (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * f3)
  ) as Vec3;
};

// Arc-length table so particles flow at a constant speed along the curve.
const TABLE_STEPS = 600;
const tablePoints: Vec3[] = Array.from({ length: TABLE_STEPS + 1 }, (_, i) =>
  catmullRom((i / TABLE_STEPS) * (STREAM_CONTROLS.length - 1))
);
const tableLength = [0];
for (let i = 1; i <= TABLE_STEPS; i++) {
  const a = tablePoints[i - 1];
  const b = tablePoints[i];
  tableLength.push(tableLength[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
}
export const STREAM_LENGTH = tableLength[TABLE_STEPS];

export const streamPoint = (t: number): Vec3 => {
  const target = Math.min(Math.max(t, 0), 1) * STREAM_LENGTH;
  let lo = 0;
  let hi = TABLE_STEPS;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (tableLength[mid] <= target) lo = mid;
    else hi = mid;
  }
  const span = tableLength[hi] - tableLength[lo] || 1;
  const f = (target - tableLength[lo]) / span;
  const a = tablePoints[lo];
  const b = tablePoints[hi];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
};

export const sampleStream = (n: number): Vec3[] =>
  Array.from({ length: n }, (_, i) => streamPoint(i / (n - 1)));
