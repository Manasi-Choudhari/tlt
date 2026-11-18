"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { SplitReveal } from "@/components/ui/SplitReveal";

const columns = [
  [media.goa.vagator, media.hampi.relief, media.goa.boat],
  [media.hampi.virupaksha, media.goa.shack, media.hampi.gopuram],
  [media.goa.mandrem, media.hampi.chariot2, media.goa.querim],
  [media.hampi.lakshmi, media.goa.butterfly, media.hampi.hemakuta],
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const speeds = [-12, 10, -18, 8];
      gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col, i) => {
        gsap.fromTo(
          col,
          { yPercent: speeds[i] * -1 },
          { yPercent: speeds[i], ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-cream-50 py-28 sm:py-36">
      <div className="container-x text-center">
        <span className="eyebrow text-flame-600">#TLTCommunity</span>
        <SplitReveal as="h2" className="heading-lg mx-auto mt-5 max-w-4xl">
          Moments from the road
        </SplitReveal>
        <a
          href={site.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 font-display font-semibold text-flame-600 hover:text-flame-700"
        >
          <InstagramIcon className="h-5 w-5" /> Follow @tltcommunity
        </a>
      </div>

      <div className="mt-16 grid h-[110vh] grid-cols-2 gap-4 overflow-hidden px-4 sm:h-[130vh] md:grid-cols-4 md:gap-6 md:px-6">
        {columns.map((col, i) => (
          <div key={i} data-col className={`flex flex-col gap-4 md:gap-6 ${i > 1 ? "hidden md:flex" : ""}`}>
            {col.map((src, j) => (
              <div key={src} className={`group relative overflow-hidden rounded-[1.5rem] ${j % 2 === i % 2 ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={src}
                  alt="TLT Community travel moment"
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-[translate,scale,rotate] duration-[1.2s] ease-out-expo group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
