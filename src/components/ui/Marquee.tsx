import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  /** Scroll direction */
  reverse?: boolean;
  /** Pause the animation while hovered */
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Infinite horizontal marquee. Renders the children twice back-to-back and
 * translates the track by -50% so the loop is seamless. Edge fade is applied
 * by the `.marquee-mask` utility.
 */
const Marquee = ({
  children,
  reverse = false,
  pauseOnHover = true,
  className = "",
}: MarqueeProps) => {
  return (
    <div className={`marquee-mask w-full overflow-hidden ${className}`}>
      <div
        className={`flex w-max ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
