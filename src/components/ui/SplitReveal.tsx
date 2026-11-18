"use client";

import clsx from "clsx";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "@/lib/ready";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  type?: "lines" | "words" | "chars";
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
};

export function SplitReveal({ as: Tag = "h2", children, className, type = "lines", trigger = "scroll", delay = 0, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      let split: SplitText | undefined;
      let cancelReady = () => {};

      const run = contextSafe!(() => {
        gsap.set(el, { opacity: 1 });
        split = SplitText.create(el, {
          type: type === "chars" ? "words,chars" : type === "words" ? "words" : "lines",
          mask: type === "lines" ? "lines" : "words",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            const targets = type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: 115,
              rotate: type === "lines" ? 3 : 0,
              duration: type === "chars" ? 0.9 : 1.15,
              stagger: stagger ?? (type === "chars" ? 0.025 : type === "words" ? 0.06 : 0.1),
              ease: "power4.out",
              delay,
              scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
            });
          },
        });
      });

      let cancelled = false;
      document.fonts.ready.then(() => {
        if (cancelled) return;
        if (trigger === "load") cancelReady = onReady(run);
        else run();
      });

      return () => {
        cancelled = true;
        cancelReady();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal className={clsx(className)}>
      {children}
    </Tag>
  );
}
