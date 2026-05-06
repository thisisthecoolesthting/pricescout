"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps children with an IntersectionObserver-based reveal-on-scroll.
 * Mirrors getrevalue.com's `.animate-on-scroll` pattern (translate(30px) -> 0,
 * opacity 0 -> 1) but actually fires from a real observer instead of always-on
 * CSS keyframes.
 *
 * `delay` staggers reveals when wrapping a sequence of cards.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    // Respect prefers-reduced-motion.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setSeen(true);
      return;
    }
    const node = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const style: React.CSSProperties = {
    transition: "opacity 600ms ease, transform 600ms ease",
    transitionDelay: `${delay}ms`,
    opacity: seen ? 1 : 0,
    transform: seen ? "translateY(0)" : "translateY(30px)",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
