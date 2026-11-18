"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export function ParallaxImage({
  src,
  alt,
  className,
  amount = 12,
  priority,
  sizes = "100vw",
  reveal = true,
}: {
  src: string;
  alt: string;
  className?: string;
  amount?: number;
  priority?: boolean;
  sizes?: string;
  reveal?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el || prefersReducedMotion()) return;
      const img = el.querySelector("[data-img]");
      gsap.fromTo(
        img,
        { yPercent: -amount },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      if (reveal) {
        gsap.from(el, {
          clipPath: "inset(18% 12% 18% 12% round 2rem)",
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={clsx("relative overflow-hidden", className)} style={{ clipPath: "inset(0% 0% 0% 0% round 0rem)" }}>
      <div data-img className="absolute -inset-y-[15%] inset-x-0">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    </div>
  );
}
