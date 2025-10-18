import { useState, useEffect, useRef } from "react";
import styles from "../styles";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  const [mountCanvas, setMountCanvas] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Force remount when coming into view
            setMountCanvas(false);
            setTimeout(() => setMountCanvas(true), 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen mx-auto">
      <div
        className={`${styles.styles.paddingX} pb-4 absolute inset-0 top-[120px] mx-auto flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-blue-400 shadow-blue-glow" />
          <div className="w-1 sm:h-80 h-40 blue-gradient" />
        </div>
        <div>
          <h1 className={`${styles.styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">Luis</span>
          </h1>
          <p className={`${styles.styles.heroSubText} mt-2 text-white-100 `}>
            I am an experienced Full-Stack Software Engineer specializing in{" "}
            <br className="sm:block hidden" /> modern web technologies.
          </p>
        </div>
      </div>
      {/* Always render, but remount on visibility to recover from context loss */}
      {mountCanvas && <ComputersCanvas key={Date.now()} />}

      <div className="absolute xs:bottom-8 sm:bottom-14 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-blue-400 flex justify-center items-start p-2 hover:border-cyan-400 transition-colors duration-300">
            <div className="w-3 h-3 rounded-full bg-blue-400 mb-1 animate-bounce shadow-blue-glow" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
