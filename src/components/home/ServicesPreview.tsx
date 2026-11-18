"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Button } from "@/components/ui/Button";
import { useTouchActive } from "@/lib/use-touch-active";

export function ServicesPreview() {
  const root = useRef<HTMLElement>(null);
  useTouchActive(root, "[data-service]");

  useGSAP(
    () => {
      gsap.from("[data-service]", {
        y: 60,
        opacity: 0,
        stagger: { each: 0.08, grid: "auto", from: "start" },
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-services-grid]", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-cream-100 py-28 sm:py-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Travel, <span className="accent text-flame-600">handled.</span>
              </>
            }
            description="From weekend escapes to 100-person offsites — we plan, book and host so you can just be present."
          />
          <Button href="/services" variant="outline">
            All services
          </Button>
        </div>

        <div data-services-grid className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <div
              key={s.title}
              data-service
              className="group relative overflow-hidden bg-cream-50 p-8 transition-colors duration-500 hover:bg-ink-900 sm:p-10 [&.is-active]:bg-ink-900"
            >
              <div className="bg-brand absolute inset-0 origin-bottom scale-y-0 opacity-0 transition-all duration-700 ease-out-expo group-hover:scale-y-100 group-hover:opacity-100 group-[.is-active]:scale-y-100 group-[.is-active]:opacity-100" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-flame-500/10 text-flame-600 transition-colors duration-500 group-hover:bg-white/20 group-hover:text-white group-[.is-active]:bg-white/20 group-[.is-active]:text-white">
                    <ServiceIcon name={s.icon} className="h-6 w-6" />
                  </span>
                  <span className="font-display text-sm font-semibold text-ink-500 transition-colors group-hover:text-white/70 group-[.is-active]:text-white/70">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-10 font-display text-2xl font-semibold tracking-tight text-ink-900 transition-colors duration-500 group-hover:text-white group-[.is-active]:text-white">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700/80 transition-colors duration-500 group-hover:text-white/90 group-[.is-active]:text-white/90">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
