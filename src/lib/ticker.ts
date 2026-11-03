/**
 * One shared requestAnimationFrame loop with priority-ordered subscribers.
 *
 * Lower priorities run first: Lenis advances at 0 and the WebGL scene renders at 10, so the
 * scene always reads the scroll position of the frame it draws. The loop only runs while it
 * has subscribers and pauses while the document is hidden.
 */
export type TickCallback = (time: number, delta: number) => void;

interface Subscriber {
  fn: TickCallback;
  priority: number;
}

const subscribers: Subscriber[] = [];
let frameId = 0;
let lastTime = 0;

const frame = (time: number) => {
  frameId = requestAnimationFrame(frame);
  const delta = lastTime ? time - lastTime : 0;
  lastTime = time;
  // Iterate a copy: callbacks may (un)subscribe while the frame runs.
  for (const subscriber of subscribers.slice()) subscriber.fn(time, delta);
};

const start = () => {
  if (frameId || document.hidden || subscribers.length === 0) return;
  lastTime = 0;
  frameId = requestAnimationFrame(frame);
};

const stop = () => {
  if (!frameId) return;
  cancelAnimationFrame(frameId);
  frameId = 0;
};

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
}

export const subscribeTicker = (fn: TickCallback, priority = 0): (() => void) => {
  const subscriber: Subscriber = { fn, priority };
  // Insert after every subscriber of equal or lower priority (stable order).
  let index = subscribers.length;
  while (index > 0 && subscribers[index - 1].priority > priority) index--;
  subscribers.splice(index, 0, subscriber);
  start();
  return () => {
    const at = subscribers.indexOf(subscriber);
    if (at >= 0) subscribers.splice(at, 1);
    if (subscribers.length === 0) stop();
  };
};

export default subscribeTicker;
