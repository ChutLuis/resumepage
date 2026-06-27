import { motion, Variants } from "framer-motion";
import styles from "../styles";
import { services, stats } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import AnimatedCounter from "./ui/AnimatedCounter";
import MagneticButton from "./ui/MagneticButton";
import { iconMap } from "./ui/ServiceIcons";
import type { Service } from "../types";

const ServiceCard = ({
  service,
  index,
}: {
  service: Service;
  index: number;
}) => {
  const Icon = service.iconName ? iconMap[service.iconName] : null;
  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.1 * index, 0.6) as Variants}
      data-cursor="hover"
      className="group card-lift relative gradient-border rounded-2xl bg-surface/70 p-6"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 ring-1 ring-line transition-shadow duration-300 group-hover:shadow-accent-glow">
        {Icon ? (
          <Icon className="h-7 w-7" />
        ) : (
          <img src={service.icon} alt="" className="h-7 w-7 object-contain" />
        )}
      </div>
      <h3 className="font-display text-[17px] font-semibold leading-tight text-heading">
        {service.title}
      </h3>
      {service.blurb && (
        <p className="mt-2 text-[13px] leading-relaxed text-body">
          {service.blurb}
        </p>
      )}
    </motion.div>
  );
};

const About = () => {
  return (
    <>
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.styles.sectionSubText}>Introduction</p>
        <h2 className={styles.styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      {/* Bento grid: prominent bio + a purposeful "currently" card */}
      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Bio — the human story, now front and center */}
        <motion.div
          variants={fadeIn("right", "spring", 0.1, 0.75) as Variants}
          className="relative gradient-border overflow-hidden rounded-3xl bg-surface/70 p-8 lg:col-span-2 sm:p-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-2/80 px-3 py-1 text-[12px] font-medium text-body">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              Senior Applications Developer · TELUS Digital
            </span>

            <p className="mt-6 text-[17px] leading-[30px] text-body">
              I'm a full-stack engineer who architects and ships modern web and
              mobile products with{" "}
              <span className="font-medium text-heading">
                React, TypeScript &amp; Node.js
              </span>
              . Today I lead enhancements for native mobile apps and drive a
              strategic migration to React Native at TELUS Digital Solutions.
            </p>
            <p className="mt-4 text-[17px] leading-[30px] text-body">
              Over{" "}
              <span className="font-medium text-heading">4+ years</span> I've
              delivered solutions across enterprise apps, cloud infrastructure
              and interactive Web AR — spanning React, Vue, Angular, NestJS and
              AWS. Bachelor of Engineering in Computers &amp; Systems, bilingual
              EN (C2) / ES (native).
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton
                href="/resume.pdf"
                download="Luis_Ortiz_Resume.pdf"
                ariaLabel="Download résumé"
                className="rounded-xl bg-gradient-to-r from-accent-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-accent-glow transition-shadow hover:shadow-cyan-glow"
              >
                Download Résumé
              </MagneticButton>
              <MagneticButton
                href="#contact"
                ariaLabel="Jump to contact section"
                className="rounded-xl border border-line bg-bg-2/60 px-6 py-3 font-semibold text-heading transition-colors hover:border-accent-400"
              >
                Let's talk →
              </MagneticButton>
            </div>
          </div>
        </motion.div>

        {/* "Currently" card */}
        <motion.div
          variants={fadeIn("left", "spring", 0.2, 0.75) as Variants}
          data-cursor="hover"
          className="relative gradient-border flex flex-col justify-between overflow-hidden rounded-3xl bg-surface/70 p-8"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="relative">
            <p className="text-[12px] uppercase tracking-[0.25em] text-cyan-400">
              Currently
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold text-heading">
              Building at TELUS
            </h3>
            <ul className="mt-5 space-y-3 text-[14px] text-body">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-accent-400 to-cyan-400" />
                Leading the native → React Native migration
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-accent-400 to-cyan-400" />
                Shipping performance &amp; engagement wins
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-accent-400 to-cyan-400" />
                Designing reusable component systems
              </li>
            </ul>
          </div>
          <div className="relative mt-6 border-t border-line pt-5">
            <p className="text-[13px] text-body">
              Open to{" "}
              <span className="font-medium text-heading">
                freelance &amp; collaboration
              </span>{" "}
              worldwide.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Stat band */}
      <div className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={fadeIn("up", "spring", 0.08 * index, 0.6) as Variants}
            data-cursor="hover"
            className="card-lift gradient-border flex flex-col justify-center rounded-2xl bg-surface/70 p-6"
          >
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              className="font-display text-4xl font-bold text-gradient sm:text-5xl"
            />
            <p className="mt-2 text-[13px] uppercase tracking-wider text-body">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* What I do */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
