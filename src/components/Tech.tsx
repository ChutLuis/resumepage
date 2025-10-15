import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const TechBall = ({ tech, index }: any) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Mount when in view, unmount when out of view
          setIsInView(entry.isIntersecting);
        });
      },
      { rootMargin: "200px", threshold: 0 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className="w-28 h-28"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        {isInView ? (
          <BallCanvas icon={tech.icon} />
        ) : (
          <div className="w-full h-full bg-tertiary rounded-full" />
        )}
        <p className="text-center text-xs mt-2 text-secondary">{tech.name}</p>
      </div>
    </motion.div>
  );
};

const Tech = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((tech, index) => (
        <TechBall key={tech.name} tech={tech} index={index} />
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
