"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { ArrowDown, Star } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "@/lib/ready";
import { Button } from "@/components/ui/Button";
import { openChat } from "@/components/chat/ChatWidget";
import { trips, formatDate } from "@/data/trips";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="bg-brand absolute inset-0" />,
});

const next = trips
  .flatMap((t) => t.departures.map((d) => ({ trip: t, ...d })))
  .sort((a, b) => a.date.localeCompare(b.date))[0];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      if (prefersReducedMotion()) {
        gsap.set("[data-hero-fade], [data-hero-line] > span", { opacity: 1 });
        return;
      }
      gsap.set("[data-hero-line] > span", { yPercent: 115 });
      gsap.set("[data-hero-fade]", { opacity: 0, y: 30 });

      const intro = contextSafe!(() => {
        gsap
          .timeline({ delay: 0.1 })
          .to("[data-hero-line] > span", { yPercent: 0, stagger: 0.12, duration: 1.3, ease: "power4.out" })
          .to("[data-hero-fade]", { opacity: 1, y: 0, stagger: 0.1, duration: 1 }, "-=0.8");
      });
      const cancel = onReady(intro);

      gsap.to("[data-hero-content]", {
        yPercent: -25,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-canvas]", {
        scale: 1.08,
        borderBottomLeftRadius: "3rem",
        borderBottomRightRadius: "3rem",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return cancel;
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ink-950">
      <div data-hero-canvas className="absolute inset-0 origin-top overflow-hidden">
        <HeroScene />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-ink-950/10" />
      </div>

      <div data-hero-content className="container-x relative z-10 flex h-full flex-col justify-end pb-14 pt-32 text-white sm:pb-20">
        <p data-hero-fade className="eyebrow text-white/90">
          The Legend Travellers Community
        </p>
        <h1 className="mt-5 font-display text-[clamp(3.4rem,11vw,10.5rem)] font-semibold leading-[0.88] tracking-[-0.05em] drop-shadow-[0_4px_30px_rgba(120,40,0,0.25)]">
          <span data-hero-line className="block overflow-hidden pb-[0.06em]">
            <span className="block">Trip.</span>
          </span>
          <span data-hero-line className="block overflow-hidden pb-[0.06em]">
            <span className="block">Travel.</span>
          </span>
          <span data-hero-line className="block overflow-hidden pb-[0.1em]">
            <span className="accent block text-ink-900">Therapy.</span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div data-hero-fade className="max-w-xl">
            <p className="text-lg leading-relaxed text-white/90 sm:text-xl">
              Curated group trips to <strong className="font-semibold">Goa</strong> &{" "}
              <strong className="font-semibold">Hampi</strong> for people who travel to feel alive. Come as strangers, leave as
              legends.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/trips" variant="dark" size="lg">
                Explore trips
              </Button>
              <Button variant="outline-light" size="lg" icon={false} onClick={() => openChat("Help me choose a trip")}>
                Plan with AI assistant
              </Button>
            </div>
          </div>

          {next && (
            <Link
              data-hero-fade
              href={`/trips/${next.trip.slug}`}
              data-cursor="View"
              className="group hidden w-80 rounded-3xl border border-white/25 bg-white/15 p-5 backdrop-blur-xl transition-colors hover:bg-white/25 md:block"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                <span>Next departure</span>
                <span className="flex items-center gap-1 normal-case tracking-normal">
                  <Star className="h-3.5 w-3.5 fill-sun-300 text-sun-300" /> {next.trip.rating}
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-semibold">{next.trip.title}</p>
              <p className="mt-1 text-sm text-white/80">
                {formatDate(next.date)} · {next.trip.nights}N/{next.trip.days}D
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
                  <span className="block h-full rounded-full bg-white" style={{ width: `${Math.max(12, 100 - next.seatsLeft * 5)}%` }} />
                </span>
                <span className="text-xs font-semibold">{next.seatsLeft} seats left</span>
              </div>
            </Link>
          )}
        </div>

        <div data-hero-fade className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70 lg:flex">
          <span>Scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
