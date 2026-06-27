import { SVGProps } from "react";

/**
 * Custom line icons in the Aurora palette — replaces the generic template
 * 3D blob PNGs (web/mobile/backend/creator) that were an instant template tell.
 * Each icon inherits the gradient stroke defined inline.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = (id: string) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
      <stop stopColor="#a78bfa" />
      <stop offset="1" stopColor="#22d3ee" />
    </linearGradient>
  </defs>
);

const wrap = (id: string) => ({
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: `url(#${id})`,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const FullStackIcon = (props: IconProps) => (
  <svg {...wrap("fs-grad")} {...props}>
    {base("fs-grad")}
    <path d="M8 9l-3 3 3 3" />
    <path d="M16 9l3 3-3 3" />
    <path d="M13.5 5l-3 14" />
  </svg>
);

export const MobileIcon = (props: IconProps) => (
  <svg {...wrap("mb-grad")} {...props}>
    {base("mb-grad")}
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
);

export const CloudIcon = (props: IconProps) => (
  <svg {...wrap("cl-grad")} {...props}>
    {base("cl-grad")}
    <path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1 .5 6.96" />
    <path d="M12 13v6m0 0l-2.2-2.2M12 19l2.2-2.2" />
  </svg>
);

export const ArchitectureIcon = (props: IconProps) => (
  <svg {...wrap("ar-grad")} {...props}>
    {base("ar-grad")}
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

export const iconMap = {
  fullstack: FullStackIcon,
  mobile: MobileIcon,
  cloud: CloudIcon,
  architecture: ArchitectureIcon,
} as const;

export type ServiceIconName = keyof typeof iconMap;
