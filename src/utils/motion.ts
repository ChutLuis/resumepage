import { MotionVariants } from "../types";

type Direction = "left" | "right" | "up" | "down" | "";
type TransitionType = "spring" | "tween";

// Detect if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Hook to get reduced motion state
export const useReducedMotion = (): boolean => {
  const [shouldReduceMotion, setShouldReduceMotion] = React.useState(
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return shouldReduceMotion;
};

// Import React for the hook
import * as React from 'react';

export const textVariant = (delay?: number): MotionVariants => {
  const reducedMotion = prefersReducedMotion();
  
  return {
    hidden: {
      y: reducedMotion ? 0 : -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: reducedMotion ? "tween" : "spring",
        duration: reducedMotion ? 0.3 : 1.25,
        delay: reducedMotion ? 0 : delay,
      },
    },
  };
};

export const fadeIn = (
  direction: Direction,
  type: TransitionType,
  delay: number,
  duration: number
): MotionVariants => {
  const reducedMotion = prefersReducedMotion();
  
  return {
    hidden: {
      x: reducedMotion ? 0 : (direction === "left" ? 100 : direction === "right" ? -100 : 0),
      y: reducedMotion ? 0 : (direction === "up" ? 100 : direction === "down" ? -100 : 0),
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: reducedMotion ? "tween" : type,
        delay: reducedMotion ? 0 : delay,
        duration: reducedMotion ? 0.2 : duration,
        ease: "easeOut",
      },
    },
  };
};

export const zoomIn = (delay: number, duration: number): MotionVariants => {
  const reducedMotion = prefersReducedMotion();
  
  return {
    hidden: {
      scale: reducedMotion ? 1 : 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay: reducedMotion ? 0 : delay,
        duration: reducedMotion ? 0.2 : duration,
        ease: "easeOut",
      },
    },
  };
};

export const slideIn = (
  direction: Direction,
  type: TransitionType,
  delay: number,
  duration: number
): MotionVariants => {
  const reducedMotion = prefersReducedMotion();
  
  return {
    hidden: {
      x: reducedMotion ? 0 : (direction === "left" ? "-100%" : direction === "right" ? "100%" : 0),
      y: reducedMotion ? 0 : (direction === "up" ? "100%" : direction === "down" ? "100%" : 0),
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: reducedMotion ? "tween" : type,
        delay: reducedMotion ? 0 : delay,
        duration: reducedMotion ? 0.2 : duration,
        ease: "easeOut",
      },
    },
  };
};

export const staggerContainer = (
  staggerChildren?: number,
  delayChildren?: number
): MotionVariants => {
  const reducedMotion = prefersReducedMotion();
  
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : staggerChildren,
        delayChildren: reducedMotion ? 0 : (delayChildren || 0),
      },
    },
  };
};