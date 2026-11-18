"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useRef, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "./SplitReveal";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs = [],
  children,
  size = "lg",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  crumbs?: { href?: string; label: string }[];
  children?: ReactNode;
  size?: "md" | "lg";
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-ph-fade]", { opacity: 0, y: 24, stagger: 0.1, duration: 1, delay: 0.5 });
      if (image) {
        gsap.fromTo("[data-ph-img]", { scale: 1.25 }, { scale: 1, duration: 2.2, ease: "power3.out" });
        gsap.to("[data-ph-img-wrap]", {
          yPercent: 25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
      gsap.to("[data-ph-content]", {
        yPercent: -15,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className={clsx(
        "relative flex overflow-hidden text-white",
        size === "lg" ? "min-h-[88svh]" : "min-h-[70svh]",
        image ? "bg-ink-950" : "bg-brand grain",
      )}
    >
      {image ? (
        <div data-ph-img-wrap className="absolute inset-0">
          <div data-ph-img className="absolute inset-0">
            <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-ink-950/40" />
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 h-[520px] w-[400px] rotate-12 opacity-15">
            <Image src="/brand/mark-white.png" alt="" fill sizes="400px" className="object-contain" />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-full bg-gradient-to-t from-flame-700/30 to-transparent" />
        </>
      )}

      <div data-ph-content className="container-x relative z-10 flex flex-col justify-end pb-16 pt-36 sm:pb-24">
        {crumbs.length > 0 && (
          <nav data-ph-fade aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white" aria-current="page">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p data-ph-fade className="eyebrow text-white/90">
            {eyebrow}
          </p>
        )}
        <SplitReveal as="h1" trigger="load" delay={0.15} className="heading-xl mt-5 max-w-6xl">
          {title}
        </SplitReveal>
        {description && (
          <p data-ph-fade className="mt-8 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {description}
          </p>
        )}
        {children && <div data-ph-fade>{children}</div>}
      </div>
    </section>
  );
}
