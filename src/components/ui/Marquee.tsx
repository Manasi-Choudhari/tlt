"use client";

import clsx from "clsx";
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Infinite marquee whose speed and direction react to scroll velocity.
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el || prefersReducedMotion()) return;
      const tween = gsap.fromTo(
        el,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, ease: "none", duration: speed, repeat: -1 },
      );
      let speedTl: gsap.core.Timeline | undefined;
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const dir = self.direction;
          const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 500);
          speedTl?.kill();
          speedTl = gsap
            .timeline()
            .to(tween, { timeScale: dir * boost, duration: 0.2 })
            .to(tween, { timeScale: dir, duration: 1.2, ease: "power2.out" }, "+=0.2");
        },
      });
      return () => {
        speedTl?.kill();
        st.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={clsx("relative flex overflow-hidden", className)}>
      <div ref={track} className="flex w-max shrink-0 will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
