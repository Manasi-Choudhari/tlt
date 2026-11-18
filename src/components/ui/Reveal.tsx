"use client";

import { useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: number;
  y?: number;
  delay?: number;
  scale?: boolean;
};

export function Reveal({ as: Tag = "div", children, className, style, stagger, y = 48, delay = 0, scale }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { opacity: 1 });
      if (prefersReducedMotion()) return;
      const targets = stagger !== undefined ? Array.from(el.children) : el;
      gsap.from(targets, {
        y,
        opacity: 0,
        scale: scale ? 0.94 : 1,
        duration: 1.1,
        delay,
        stagger: stagger ?? 0,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal className={className} style={style}>
      {children}
    </Tag>
  );
}
