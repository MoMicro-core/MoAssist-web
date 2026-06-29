import { useEffect } from "react";

// Adds `.mm-in` to every [data-reveal] when it scrolls into view, and animates
// [data-count] numbers from 0 to their target. Re-runs when `deps` change so it
// catches nodes mounted by a route switch. Honors prefers-reduced-motion.
export const useReveal = (deps = []) => {
  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      revealNodes.forEach((n) => n.classList.add("mm-in"));
      document.querySelectorAll("[data-count]").forEach((n) => {
        n.textContent = (n.dataset.prefix || "") + n.dataset.count + (n.dataset.suffix || "");
      });
      return undefined;
    }

    const runCount = (el) => {
      if (el.__counted) return;
      el.__counted = true;
      const target = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const dur = 1100;
      const start = Date.now();
      const id = setInterval(() => {
        const p = Math.min(1, (Date.now() - start) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * e) + suffix;
        if (p >= 1) clearInterval(id);
      }, 32);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("mm-in");
          entry.target
            .querySelectorAll?.("[data-count]")
            .forEach(runCount);
          if (entry.target.hasAttribute("data-count")) runCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );

    revealNodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
