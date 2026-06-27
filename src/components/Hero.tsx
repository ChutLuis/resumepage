import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import styles from "../styles";
import { ComputersCanvas } from "./canvas";
import MagneticButton from "./ui/MagneticButton";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const badges = ["React", "React Native", "Node.js", "AWS", "TypeScript"];

const Hero = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative mx-auto h-screen w-full">
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className={`${styles.styles.paddingX} absolute inset-0 top-[90px] z-10 mx-auto flex max-w-7xl flex-row items-start gap-5 pb-4`}
      >
        <div className="mt-2 flex flex-col items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-accent-500 shadow-accent-glow" />
          <div className="blue-gradient h-40 w-1 sm:h-80" />
        </div>

        <div className="relative z-10 rounded-2xl bg-primary/70 p-6 backdrop-blur-sm sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <motion.p
            variants={item}
            className="mb-3 text-[15px] font-medium uppercase tracking-[0.3em] text-cyan-400"
          >
            Full-Stack Software Engineer
          </motion.p>
          <motion.h1 variants={item} className={styles.styles.heroHeadText}>
            Hi, I'm{" "}
            <span className="text-gradient-animated">Luis Ortiz</span>
          </motion.h1>
          <motion.p
            variants={item}
            className={`${styles.styles.heroSubText} mt-3 max-w-2xl`}
          >
            I build modern web &amp; mobile products with React, Node.js &amp;
            AWS — from enterprise platforms to interactive experiences.
          </motion.p>

          <motion.div variants={item} className="mt-6 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-line bg-bg-2/70 px-3 py-1 text-[13px] font-medium text-body backdrop-blur-sm"
              >
                {b}
              </span>
            ))}
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <MagneticButton
              href="#work"
              ariaLabel="View my work"
              className="rounded-xl bg-gradient-to-r from-accent-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-accent-glow transition-shadow hover:shadow-cyan-glow"
            >
              View my work
            </MagneticButton>
            <MagneticButton
              href="#contact"
              ariaLabel="Get in touch"
              className="rounded-xl border border-line bg-bg-2/50 px-6 py-3 font-semibold text-heading transition-colors hover:border-accent-400"
            >
              Get in touch
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* 3D model as background layer */}
      <div
        className="absolute inset-0 z-[1] opacity-60 sm:opacity-100"
        role="img"
        aria-label="3D computer model decoration"
      >
        <ComputersCanvas />
      </div>

      <div className="absolute bottom-10 z-10 flex w-full items-center justify-center xs:bottom-10">
        <a
          href="#about"
          className="rounded-3xl focus:outline-none focus:ring-4 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-primary"
          aria-label="Scroll to about section"
          data-cursor="hover"
        >
          <div className="flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 border-accent-400 p-2 transition-colors duration-300 hover:border-cyan-400">
            <div
              className={`mb-1 h-3 w-3 rounded-full bg-accent-400 shadow-accent-glow ${
                !reducedMotion ? "animate-bounce" : ""
              }`}
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
