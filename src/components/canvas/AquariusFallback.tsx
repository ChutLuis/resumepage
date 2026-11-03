import { EDGES, FRAME, STAR_IDS, STARS, sampleStream, starPosition } from "./aquariusData";

// A faint trail of the water-bearer stream; opacity thins out downstream.
const STREAM_DOTS = sampleStream(60).map(([x, y], i, all) => {
  const s = i / (all.length - 1);
  // Alternating lateral jitter keeps it reading as a river, not a dotted line.
  const jitter = ((i * 7) % 5 - 2) * 0.012 * (0.4 + s);
  return { x: x + jitter, y: -y, r: 0.012 + (i % 3) * 0.005, opacity: 0.5 * (1 - s) ** 1.3 + 0.04, fill: s < 0.25 ? "#c4b5fd" : "#8b5cf6" };
});

// The same stars and connections as the scene, without WebGL or animation.
const AquariusFallback = () => (
  <svg
    aria-hidden="true"
    className="h-full w-full"
    viewBox={`${FRAME.x} ${FRAME.y} ${FRAME.width} ${FRAME.height}`}
    preserveAspectRatio="xMidYMid meet"
    fill="none"
  >
    <g stroke="#a78bfa" strokeOpacity="0.42" strokeWidth="0.018">
      {EDGES.map(([from, to]) => {
        const [x1, y1] = starPosition(from);
        const [x2, y2] = starPosition(to);
        return <line key={`${from}-${to}`} x1={x1} y1={-y1} x2={x2} y2={-y2} />;
      })}
    </g>
    <g>
      {STREAM_DOTS.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.fill} fillOpacity={dot.opacity} />
      ))}
    </g>
    {STAR_IDS.map((id) => {
      const [x, y] = starPosition(id);
      const bright = STARS[id][2] >= 1.4;
      return (
        <circle
          key={id}
          cx={x}
          cy={-y}
          r={bright ? 0.07 : 0.045}
          fill={bright ? "#ecebf4" : "#a78bfa"}
        />
      );
    })}
  </svg>
);

export default AquariusFallback;
