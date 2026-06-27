import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently the most prominent in the viewport
 * using IntersectionObserver, so the navbar can highlight the active link.
 *
 * @param sectionIds ordered list of element ids to observe
 * @returns the id of the section currently considered active ("" if none)
 */
export const useActiveSection = (sectionIds: string[]): string => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Track visibility ratios so the most-visible section wins, even when
    // several are partially on screen at once.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let best = "";
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });

        if (best) setActiveId(best);
      },
      {
        // Bias the active zone toward the upper-middle of the viewport so a
        // section counts as active a little before it reaches the top.
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
};

export default useActiveSection;
