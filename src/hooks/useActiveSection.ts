import { useEffect, useState } from "react";

/** Track sections as lazy-loaded content mounts or is replaced inside main. */
export const useActiveSection = (sectionIds: string[]): string => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root) return;

    const ids = new Set(sectionIds);
    const observed = new Map<string, HTMLElement>();
    const ratios = new Map<string, number>();
    const updateActive = () => {
      let best = "";
      let bestRatio = 0;
      ratios.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          best = id;
          bestRatio = ratio;
        }
      });
      setActiveId(best);
    };

    let intersection: IntersectionObserver;
    const configureIntersection = () => {
      intersection?.disconnect();
      ratios.clear();
      const height = Math.max(1, document.documentElement.clientHeight || window.innerHeight);
      const top = Math.floor(height * 0.4);
      const bottom = Math.floor(height * 0.5);
      intersection = new IntersectionObserver((entries, observer) => {
        if (observer !== intersection) return;
        entries.forEach((entry) => {
          if (observed.get(entry.target.id) === entry.target) {
            ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
        });
        updateActive();
      }, { rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: [0, 0.01, 0.05, 0.1, 0.25, 0.5, 1] });
      observed.forEach((element) => intersection.observe(element));
      updateActive();
    };

    const sync = () => {
      sectionIds.forEach((id) => {
        const found = document.getElementById(id);
        const next = found && root.contains(found) ? found : null;
        const previous = observed.get(id);
        if (previous === next) return;
        if (previous) intersection.unobserve(previous);
        observed.delete(id);
        ratios.delete(id);
        if (next) {
          observed.set(id, next);
          intersection.observe(next);
        }
      });
      updateActive();
    };
    const containsSection = (node: Node) => {
      if (!(node instanceof Element)) return false;
      if (ids.has(node.id)) return true;
      return Array.from(node.querySelectorAll("section[id]"))
        .some((section) => ids.has(section.id));
    };
    const mutations = new MutationObserver((records) => {
      if (records.some((record) =>
        Array.from(record.addedNodes).some(containsSection) ||
        Array.from(record.removedNodes).some(containsSection)
      )) sync();
    });

    configureIntersection();
    window.addEventListener("resize", configureIntersection);
    mutations.observe(root, { childList: true, subtree: true });
    sync();
    return () => {
      mutations.disconnect();
      intersection.disconnect();
      window.removeEventListener("resize", configureIntersection);
    };
  }, [sectionIds]);

  return activeId;
};

export default useActiveSection;
