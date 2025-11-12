import { useState, useEffect, useRef } from "react";
import styles from "../styles";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  const [mountCanvas, setMountCanvas] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

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
        className={`${styles.styles.paddingX} pb-4 absolute inset-0 top-[80px] max-w-7xl mx-auto flex flex-row items-start gap-5 z-10`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-blue-400 shadow-blue-glow" />
          <div className="w-1 sm:h-80 h-40 blue-gradient" />
        </div>
        <div className="relative z-10 bg-primary/80 backdrop-blur-sm p-6 rounded-lg sm:bg-transparent sm:backdrop-blur-none sm:p-0">
          <h1 className={`${styles.styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]">Luis Ortiz</span>
          </h1>
          <p className={`${styles.styles.heroSubText} mt-2 text-white`}>
            Full-Stack Software Engineer specializing in{" "}
            React, Node.js & AWS solutions worldwide.
          </p>
        </div>
      </div>
      {/* 3D Model rendered as background, lower z-index so it doesn't block text */}
      <div className="absolute inset-0 z-0 opacity-60 sm:opacity-100" role="img" aria-label="3D computer model decoration">
        {mountCanvas && <ComputersCanvas key={Date.now()} />}
      </div>

      <div className="absolute xs:bottom-10 bottom-10 w-full flex justify-center items-center z-10">
        <a
          href="#about"
          className="focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-primary rounded-3xl"
          aria-label="Scroll to about section"
        >
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-blue-400 flex justify-center items-start p-2 hover:border-cyan-400 transition-colors duration-300">
            <div className={`w-3 h-3 rounded-full bg-blue-400 mb-1 shadow-blue-glow ${!reducedMotion ? 'animate-bounce' : ''}`} />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
